# 03 WebView + SDK Adapter Architecture

> 基于 `docs/01-react-ui-inventory.md` 与 `docs/02-bridge-command-map.md`，定义 Hybrid 落地架构。仅文档，不写 Android 工程代码。

## 1) 为什么选择 React WebView + Bridge，而不是 Compose 重写

选择 WebView Hybrid 的核心原因：

1. **复用现有 UI 资产**：当前 React 原型已经覆盖主控制台与跟随模式核心交互，重写成本高。
2. **交付速度更快**：优先打通 Bridge 与 SDK，而不是先做 UI 迁移。
3. **风险更可控**：UI 风险（视觉、交互）与 SDK 风险（控制、遥测）解耦。
4. **便于迭代**：前端可快速发布交互优化，Android 侧专注控制链路与安全门禁。
5. **迁移可渐进**：后续若需要，可将高性能模块逐步原生化，而非一次性全量重写。

## 2) 架构图（逻辑分层）

```text
React UI (App.tsx / components / pages)
        │
        │ Command Dispatcher (JS)
        ▼
window.AndroidRobot (JS Bridge API)
        │
        ▼
AndroidRobotBridge (WebView JavascriptInterface)
        │
        ▼
ControlGate (safety + auth + state gate)
        │
        ├── CommandThrottle (joystick rate limit)
        ├── CommandWatchdog (timeout auto stop)
        ▼
RobotSdkAdapter (interface)
   ├── MockRobotSdkAdapter
   └── RealRobotSdkAdapter
        │
        ▼
Robot Vendor SDK / ROS / Backend Gateway
```

## 3) React build 产物如何进入 Android assets

建议流程：

1. React 执行 `vite build` 生成 `dist/`。
2. 将 `dist` 内容拷贝到 Android `assets/webapp/`（或 `assets/h5/`）。
3. 通过 CI 或脚本固定这个拷贝步骤，避免手工漏同步。

建议目录形态：

```text
android-app/app/src/main/assets/webapp/index.html
android-app/app/src/main/assets/webapp/assets/*.js
android-app/app/src/main/assets/webapp/assets/*.css
```

## 4) Android WebView 如何加载本地 index.html

推荐使用本地 assets 路径：

- `file:///android_asset/webapp/index.html`

优点：
- 离线可运行
- 启动快
- 可与 Bridge 紧密联动

## 5) Android WebView 需要的设置

1. `JavaScript enabled`：必须开启。
2. `DOM storage`：必须开启（本地状态、前端存储依赖）。
3. `file access` 策略：
   - 只允许必要的本地访问。
   - 避免开启过宽的 universal access。
4. `local asset loading`：允许从 `android_asset` 加载 `index.html` 与静态资源。
5. **禁止任意外链跳转**：
   - 覆盖 URL 加载策略，仅白名单域名或禁止全部外跳。
   - 防止恶意页面劫持 Bridge。

## 6) AndroidManifest 需要的配置

1. `INTERNET`：
   - 若需要遥测/SDK 网关/视频流则需要。
   - 纯离线 mock 可不强依赖。
2. 横屏：
   - Activity 固定 landscape，匹配控制台 UI。
3. `cleartextTraffic`：
   - **默认不建议开启**。
   - 仅当 SDK/网关必须走 HTTP 明文且不可改造时，按域名/Network Security Config 精细放开。

## 7) `AndroidRobotBridge.kt` 设计（职责）

职责边界：

- 暴露 `@JavascriptInterface` 方法（对应 `window.AndroidRobot.*`）。
- 参数解析/基本校验（JSON schema / 必填字段）。
- 生成标准命令对象（含 `commandId`、`timestamp`）。
- 调用 `ControlGate`，而不是直接触发 SDK。
- 将 `commandResult/telemetry/status` 回推给前端。

**禁止**：
- 直接在 Bridge 层写业务门禁逻辑。
- 直接在 Bridge 层调用真实 SDK。

## 8) `RobotSdkAdapter.kt` 设计（接口层）

定义统一能力接口，屏蔽厂商 SDK 差异：

- `sendMovement`
- `sendDirection`
- `stopMovement`
- `emergencyStop`
- `setSpeedMode`
- `setMovementMode`
- `setPosture`
- `executeAction`
- `switchCamera`
- `startFollowMode/stopFollowMode/updateFollowConfig`
- `requestRobotStatus`
- `requestMapData`

并统一返回：`Result<T>` 或标准错误码。

## 9) `MockRobotSdkAdapter.kt` 设计

第一阶段用于联调：

- 不控制真实机器人。
- 对命令返回可控 mock 结果（ACK / BLOCKED / FAILED）。
- 产出稳定 telemetry/status 假数据流。
- 支持注入故障场景（断连、低电、诊断错误、延迟）。

## 10) `RealRobotSdkAdapter.kt` 设计

第二阶段接真实能力：

- 封装厂商 SDK / ROS / 网关 API。
- 处理连接生命周期与线程模型。
- 将厂商错误码映射为统一错误码。
- 对高频命令与回执做时间戳对齐。

## 11) `ControlGate.kt` 设计

作为命令前置门禁中心：

- 检查连接态、控制权、急停态、诊断态、电量阈值。
- 决定 `ALLOW / BLOCK`。
- 记录 `reason`（如 `disconnected`, `diagnostic_error`, `low_battery`）。
- 输出标准 `commandResult` 事件。

**要求**：JS 侧不可绕过 ControlGate。

## 12) `CommandThrottle.kt` 设计

目标：限制高频命令，避免 WebView/SDK 过载。

- 作用对象：`sendMovement`、`sendDirection`、`updateFollowConfig(滑杆连续变化)`。
- 建议频率：
  - 摇杆 20~30Hz
  - 跟随配置 5~10Hz
- 策略：
  - 间隔不足则合并/丢弃中间包。
  - 保留最后一包（latest wins）。

## 13) `CommandWatchdog.kt` 设计

目标：防失控。

- 若控制流在阈值时间（如 >300ms）内无新运动包，自动 `stopMovement`。
- App 进入后台、WebView 暂停、页面失焦时触发兜底 stop。
- Watchdog 触发也要回传 `commandResult(type=stopMovement, reason=watchdog_timeout)`。

## 14) Android 向 React 回传 `evaluateJavascript` 设计

统一前端事件入口：

- `window.__onAndroidEvent(jsonString)`

事件类型：

1. `telemetry`：电量、速度、位姿等
2. `status`：连接态、诊断态、控制权等
3. `commandResult`：SENT/ACKED/BLOCKED/FAILED/TIMEOUT

推荐格式：

```json
{
  "event": "commandResult",
  "commandId": "uuid",
  "type": "sendMovement",
  "result": "ACKED",
  "reason": null,
  "timestamp": 1710000000000
}
```

## 15) GitHub Actions 构建流程（建议）

针对 Hybrid 推荐两段：

1. **Web 构建段**
   - 安装 Node
   - `npm/pnpm install`
   - `vite build`
   - 将 `dist` 拷贝到 Android assets
2. **Android 构建段**
   - 安装 JDK/Gradle
   - `assembleDebug`
   - 上传 APK artifact

并在 CI 中对 “assets 是否包含 index.html” 做校验，避免空包。

## 16) 第一阶段 MVP 范围

- React UI 原样运行于 WebView
- `window.AndroidRobot` 全命令打通到 `MockRobotSdkAdapter`
- ControlGate + Throttle + Watchdog 可运行
- telemetry/status/commandResult 回推闭环
- 不接真实机器人 SDK

## 17) 第二阶段接真实 SDK 范围

- `RealRobotSdkAdapter` 接入真实控制/遥测
- 视频流与地图数据接入真实通道
- 错误码映射与稳定性治理
- 弱网/断连/重连策略落地

## 18) 风险与约束

1. **WebView bridge 安全**
   - 必须限制可调用接口与来源页面。
   - 禁止任意外链跳转。
2. **高频摇杆性能**
   - 未限频会导致卡顿与控制延迟。
3. **视频流**
   - WebView 对低延迟视频能力有限，可能需原生播放器承载。
4. **横屏适配**
   - 设备分辨率差异大，需 UI 安全区与缩放策略。
5. **Android 权限**
   - 网络、存储（若有离线地图）等权限按最小化原则申请。
6. **SDK 生命周期**
   - Activity/WebView 生命周期与 SDK 连接生命周期要对齐。
7. **断连自动停止**
   - 断连/失焦/崩溃路径必须确保底盘 stop 兜底。

---

## 总结

Hybrid 方案的关键不是 UI 重写，而是 **Bridge 协议标准化 + ControlGate 安全门禁 + SDK Adapter 抽象 + Watchdog 兜底**。在此基础上，React UI 可保持高复用，Android 侧聚焦机器人控制可靠性与安全性。
