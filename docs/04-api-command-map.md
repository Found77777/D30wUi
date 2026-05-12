# 04 接口与控制命令清单（API/Command Map）

> 来源：`MainApp` 回调、`SettingsPanel` 回调、`FollowModePage` 中 TODO 注释。

## 命令映射总表（核心）

| 当前来源 | 未来接口名称（建议） | 命令 | 参数 | 调用位置 | 通信 | 二次确认 | 失败反馈 |
|---|---|---|---|---|---|---|---|
| `onMovement` | `RobotMotionApi.sendMovement` | movement | `x,y,timestamp` | Joystick(左) | WS/MQTT + ACK | 否 | 回中/Toast/状态条 |
| `onDirection` | `RobotMotionApi.sendDirection` | direction | `x,y,timestamp` | Joystick(右) | WS/MQTT + ACK | 否 | 回中/Toast |
| `onEmergencyStop` | `RobotSafetyApi.emergencyStop` | estop | `timestamp,source` | 顶部急停按钮 | WS高优先+HTTP兜底 | 否（必须立即） | 红色告警条+锁控 |
| `onCameraSwitch` | `RobotCameraApi.switchCamera` | camera.switch | `position` | 顶部按钮 | HTTP/SDK | 否 | 回滚UI显示 |
| `onSpeedModeChange` | `RobotModeApi.setSpeedMode` | mode.speed | `mode` | ModeGroup | HTTP/WS | 视模式（快速建议确认） | 回滚选中态 |
| `onMovementModeChange` | `RobotModeApi.setMovementMode` | mode.movement | `mode` | ModeGroup | HTTP/WS | 建议条件确认 | 回滚选中态 |
| `onPostureChange` | `RobotModeApi.setPosture` | mode.posture | `posture` | 体态按钮 | SDK/WS | 建议条件确认 | 回滚按钮态 |
| `onActionSelect` | `RobotActionApi.selectAction` | action.select | `id,name,parameters` | ActionPicker | SDK/WS | 视动作危险级别 | 恢复上次动作 |
| `onMapUpdate` | `RobotMapApi.updateMapData` | map.update | `mapData` | MapOverlay | WS订阅主导 | 否 | 提示地图异常 |
| `onAIAssistToggle` | `RobotFeatureApi.toggleAiAssist` | feature.ai | `enabled` | Settings | HTTP | 否 | 回滚开关 |
| `onAutoCharge` | `RobotDockApi.autoCharge` | dock.auto_charge | - | Settings | SDK/HTTP | 建议是 | 提示失败+保持原态 |
| `onAutoUndock` | `RobotDockApi.autoUndock` | dock.auto_undock | - | Settings | SDK/HTTP | 建议是 | 提示失败+保持原态 |
| `onSDKToggle` | `RobotDevApi.toggleSdkMode` | dev.sdk_mode | `enabled` | Settings | HTTP/本地配置 | 建议是 | 回滚开关 |
| `onGimbalEnable` | `RobotCameraApi.setGimbalEnabled` | gimbal.enable | `enabled` | Settings | SDK/HTTP | 建议是 | 回滚开关 |
| `onMapNavigation` | `RobotNavApi.startMappingNav` | nav.mapping | - | Settings | SDK/HTTP | 建议是 | 提示失败 |
| `onOfflineMapManage` | `RobotMapApi.openOfflineMapManager` | map.offline.manage | - | Settings | HTTP/本地 | 否 | 提示不可用 |
| `onProductInfoUpdate` | `RobotConfigApi.updateProductInfo` | config.product_info | `robotIP/navIP/mapPath` | Settings | 本地持久化+HTTP同步 | 否 | 输入错误提示 |

---

## 跟随模式命令覆盖

| 当前 TODO 来源 | 未来接口名称（建议） | 命令 | 参数 | 返回字段 |
|---|---|---|---|---|
| `handleStartFollow` | `RobotFollowApi.start` | follow.start | `mode,distance,speed,targetType` | `success,errorCode,message,sessionId` |
| `handleStopFollow` | `RobotFollowApi.stop` | follow.stop | `sessionId?` | `success,errorCode,message` |
| `handleDistanceChange/SpeedChange` | `RobotFollowApi.updateConfig` | follow.update_config | `distance/speed/...` | `success,effectiveConfig` |

---

## HTTP / WebSocket / SDK 分工建议

- **HTTP**：低频配置类（模式设置、产品信息更新、功能开关）。
- **WebSocket/MQTT**：高频遥测、控制命令 ACK、状态广播（移动/方向）。
- **机器人 SDK**：硬实时或厂商私有能力（急停、云台、底盘模式、建图任务）。

---

## 命令失败后的 UI 反馈

- 统一规则（建议增加）：
  1) 乐观更新则必须可回滚；
  2) 错误分类（网络、超时、权限、机器人拒绝）；
  3) 顶部状态条 + Toast 双通道；
  4) 高风险命令失败需给操作建议（如“请确认控制权/急停复位”）。

---

## 接真实 SDK / 后端 API 的替换方式

1. 把当前 props callback 作为 `UiIntent`。
2. 在 ViewModel 中调用 `UseCase`。
3. `UseCase` 再路由到 `Repository`（HTTP/WS/SDK 三路）。
4. 组件层不直接知道通信协议，保留现有 UI 结构即可平滑替换。
