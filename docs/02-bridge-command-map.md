# 02 Bridge Command Map（React WebView ↔ Android SDK）

> 目标：定义 React WebView 与 Android Bridge/SDK Adapter 间的命令协议。仅文档，不包含 Android 代码。

## A. `window.AndroidRobot` 方法总览

建议在 WebView 中暴露统一对象：`window.AndroidRobot`。

### 方法列表（必须覆盖）
1. `sendMovement(json)`
2. `sendDirection(json)`
3. `stopMovement(reason)`
4. `emergencyStop()`
5. `setSpeedMode(mode)`
6. `setMovementMode(mode)`
7. `setPosture(posture)`
8. `executeAction(json)`
9. `switchCamera(position)`
10. `openSettings()`
11. `startFollowMode(json)`
12. `stopFollowMode()`
13. `updateFollowConfig(json)`
14. `requestRobotStatus()`
15. `requestMapData()`

---

## B. 命令映射表

| React Bridge 方法 | UI 来源 | JSON 入参 | Kotlin Bridge 方法（建议） | SDK Adapter 方法（建议） | 高频 | 危险 | 安全门禁 | 限频 | ACK | 失败反馈给 React |
|---|---|---|---|---|---|---|---|---|---|---|
| `sendMovement(json)` | 主控页左摇杆 `onMovement` | `{x:number,y:number,timestamp:number}` | `onSendMovement(payload:String)` | `motionAdapter.sendMovement(cmd)` | 是 | 中 | 是 | 是（20~30Hz） | 是 | `commandResult`=BLOCKED/FAILED + reason |
| `sendDirection(json)` | 主控页右摇杆 `onDirection` | `{x:number,y:number,timestamp:number}` | `onSendDirection(payload:String)` | `motionAdapter.sendDirection(cmd)` | 是 | 中 | 是 | 是（20~30Hz） | 是 | `commandResult`=BLOCKED/FAILED + reason |
| `stopMovement(reason)` | 摇杆松手/丢焦点/超时 | `{reason:string,timestamp:number}` | `onStopMovement(payload:String)` | `motionAdapter.stop(reason)` | 否（事件型） | 中 | 是 | 否 | 是 | 失败时发 FAILED + reason |
| `emergencyStop()` | 急停按钮 | `{timestamp:number,source:string}`（可由桥接层补） | `onEmergencyStop()` | `safetyAdapter.emergencyStop()` | 否 | 高 | 是（仅做可执行性检查，不阻塞触发） | 否 | 是（高优先） | 立即回传 SENT，后续 ACK/FAILED |
| `setSpeedMode(mode)` | 速度模式组 | `{mode:0|1|2,timestamp:number}` | `onSetSpeedMode(payload:String)` | `modeAdapter.setSpeedMode(mode)` | 否 | 中 | 是 | 否 | 是 | BLOCKED（低电/故障）或 FAILED |
| `setMovementMode(mode)` | 运动模式组 | `{mode:0|1|2,timestamp:number}` | `onSetMovementMode(payload:String)` | `modeAdapter.setMovementMode(mode)` | 否 | 中 | 是 | 否 | 是 | BLOCKED/FAILED |
| `setPosture(posture)` | 体态按钮 | `{posture:"standing"|"crawling"|"sitting",timestamp:number}` | `onSetPosture(payload:String)` | `modeAdapter.setPosture(posture)` | 否 | 中 | 是 | 否 | 是 | BLOCKED/FAILED |
| `executeAction(json)` | 动作选择器 | `{id:string,name:string,parameters?:object,timestamp:number}` | `onExecuteAction(payload:String)` | `actionAdapter.execute(action)` | 否 | 高（视动作） | 是 | 可选 | 是 | BLOCKED（禁发）/FAILED（执行失败） |
| `switchCamera(position)` | 顶部切镜按钮 | `{position:"front"|"back",timestamp:number}` | `onSwitchCamera(payload:String)` | `cameraAdapter.switch(position)` | 否 | 低 | 否（可选） | 否 | 是 | FAILED + reason |
| `openSettings()` | 顶部设置按钮 | `{timestamp:number}` | `onOpenSettings(payload:String)` | `uiAdapter.openSettings()`（可不落 SDK） | 否 | 低 | 否 | 否 | 可选 | UI 级失败事件 |
| `startFollowMode(json)` | 跟随页“开始跟随” | `{mode:"auto"|"manual",distance:number,speed:"slow"|"medium"|"fast",targetType?:string,timestamp:number}` | `onStartFollowMode(payload:String)` | `followAdapter.start(config)` | 否 | 高 | 是 | 否 | 是 | BLOCKED/FAILED + reason |
| `stopFollowMode()` | 跟随页“停止跟随” | `{timestamp:number}` | `onStopFollowMode(payload:String)` | `followAdapter.stop()` | 否 | 中 | 是 | 否 | 是 | FAILED + reason |
| `updateFollowConfig(json)` | 跟随页距离/速度调整 | `{distance?:number,speed?:string,targetType?:string,timestamp:number}` | `onUpdateFollowConfig(payload:String)` | `followAdapter.updateConfig(config)` | 中（滑杆连续） | 中 | 是 | 是（如 5~10Hz） | 是 | BLOCKED/FAILED |
| `requestRobotStatus()` | 页面初始化/轮询/手动刷新 | `{requestId:string,timestamp:number}` | `onRequestRobotStatus(payload:String)` | `telemetryAdapter.getRobotStatus()` | 否 | 低 | 否 | 可选 | 是 | 返回 error 事件 |
| `requestMapData()` | 地图显示初始化/轮询 | `{requestId:string,timestamp:number}` | `onRequestMapData(payload:String)` | `mapAdapter.getMapData()` | 中（若轮询） | 低 | 否 | 是（轮询限频） | 是 | 返回 error 事件 |

---

## C. 关键规则（必须执行）

1. **急停规则**
   - 不节流。
   - 不二次确认。
   - 最高优先级队列。
   - 即使当前未连接，也必须记录命令结果并返回状态。

2. **摇杆规则**
   - `sendMovement/sendDirection` 必须限频（建议 20~30Hz）。
   - 摇杆松手必须发送 `stopMovement(reason="joystick_release")`。
   - 前端切后台/页面失焦时也应补发 `stopMovement(reason="lifecycle_pause")`。

3. **Watchdog 规则（Android 侧）**
   - Bridge/Adapter 必须有控制看门狗。
   - 若高频控制流中断超时（如 >300ms 无新控制包），自动触发 stop。
   - Watchdog stop 也必须上报 `commandResult` 给 React。

4. **ControlGate 规则**
   - JS 侧不能绕过 ControlGate 直接调 SDK。
   - 调用链必须为：
     - React UI -> JS Command Dispatcher -> Bridge -> Android ControlGate -> SDK Adapter。

---

## D. 入参 JSON 规范建议

所有命令建议统一包络：

```json
{
  "commandId": "uuid",
  "type": "sendMovement",
  "timestamp": 1710000000000,
  "payload": { }
}
```

其中：
- `commandId`: 前端生成，便于 ACK 对齐
- `timestamp`: 前端发送时间
- `payload`: 命令本体参数

---

## E. 失败反馈规范（React 接收）

统一回传 `commandResult` 事件，最小字段：

```json
{
  "event": "commandResult",
  "commandId": "uuid",
  "type": "sendMovement",
  "result": "SENT|ACKED|BLOCKED|FAILED|TIMEOUT",
  "reason": "diagnostic_error|disconnected|low_battery|sdk_error|...",
  "timestamp": 1710000001111
}
```

UI 处理建议：
- `BLOCKED`: 提示门禁原因，不改动或回滚 UI 态。
- `FAILED/TIMEOUT`: 提示执行失败，必要时回滚。
- `ACKED`: 更新成功状态（若有）。

---

## F. Android -> React 回传（`evaluateJavascript`）

Android 可通过 `WebView.evaluateJavascript(...)` 向页面注入事件分发调用。
建议前端暴露全局入口：
- `window.__onAndroidEvent(jsonString)`

Android 回传三类：

1. `telemetry`
```json
{"event":"telemetry","data":{"battery":73,"speed":0.4,"position":{"x":1.2,"y":3.4}}}
```

2. `status`
```json
{"event":"status","data":{"isConnected":true,"robotState":"running","diagnosticStatus":"normal"}}
```

3. `commandResult`
```json
{"event":"commandResult","commandId":"uuid","type":"setSpeedMode","result":"ACKED"}
```

前端收到后统一进入状态容器（store）更新，不在组件层散处理。

---

## G. 最小落地建议（不改 UI 架构）

- React 保留现有页面与组件。
- 新增一层 JS BridgeClient + CommandDispatcher。
- 把 `props.onXxx` 的出口逐步改为桥接发送（或先兼容双通道）。
- Android 侧实现 ControlGate + Watchdog + SDK Adapter，保证安全闭环。
