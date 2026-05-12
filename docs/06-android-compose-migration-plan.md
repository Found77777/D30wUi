# 06 Android Compose 迁移计划（Migration Plan）

## 1. 推荐技术栈

按目标要求落地：
- Kotlin
- Jetpack Compose
- MVVM
- Navigation Compose
- Kotlin Coroutines + StateFlow
- Retrofit/OkHttp（HTTP）
- WebSocket 或 MQTT（遥测与ACK）
- ExoPlayer / WebRTC / MJPEG（按流类型选择）

## 2. Kotlin package 结构（建议）

- `com.xxx.robotapp.ui.main`（主控制）
- `com.xxx.robotapp.ui.follow`（跟随模式）
- `com.xxx.robotapp.ui.components`（通用Compose组件）
- `com.xxx.robotapp.domain.model`（状态与命令模型）
- `com.xxx.robotapp.domain.usecase`（控制用例）
- `com.xxx.robotapp.data.repository`（聚合仓库）
- `com.xxx.robotapp.data.remote.http`
- `com.xxx.robotapp.data.remote.ws`
- `com.xxx.robotapp.data.remote.sdk`

## 3. Compose Screen 拆分

- `MainControlScreen`（对应 `MainApp`）
- `FollowModeScreen`（对应 `FollowModePage`）
- （可选）`MapNavigationScreen`（若后续全屏地图任务编辑独立）

## 4. Compose Component 拆分

- `JoystickControl`
- `ModeSegmentGroup`
- `ActionWheelPicker`
- `StatusChipsRow`（运行/诊断/速度/电量）
- `EmergencyStopButton`
- `CameraStreamView`
- `MapBackgroundLayer`
- `MiniMapOverlay`
- `SettingsControlSheet`
- `ExitConfirmDialog`

## 5. ViewModel 拆分

- `MainControlViewModel`
  - 负责主控制 UI 状态、命令门禁、状态聚合。
- `FollowModeViewModel`
  - 负责跟随配置、开始/停止、状态订阅。
- `SettingsViewModel`（可选）
  - 若设置项继续增长，独立管理配置与校验。

## 6. Repository 拆分

- `MotionRepository`（movement/direction）
- `ModeRepository`（速度/运动/体态）
- `SafetyRepository`（急停、控制权、故障状态）
- `CameraRepository`（流状态与切换）
- `MapRepository`（地图数据与导航）
- `FollowRepository`（跟随 start/stop/updateConfig）
- `SettingsRepository`（AI、SDK、产品信息）

## 7. Data model 映射

直接映射现有 TS 接口到 Kotlin data class：
- `RobotStatus`、`CameraStatus`、`MapData`
- `MovementCommand`、`DirectionCommand`
- `FollowModeConfig`、`FollowStatus`
- `RobotSettings`、`ProductInfo`

并新增：
- `ConnectionState`
- `ControlAuthorityState`
- `EmergencyState`
- `UiError`

## 8. 实时通信方案

- 高频控制与遥测：WS/MQTT（低延迟 + ACK）。
- 配置写入：HTTP。
- 关键安全命令（急停）：SDK直达 + HTTP兜底 + ACK超时重试。

## 9. 视频流方案

按 `streamType` 分流：
- `webrtc`：WebRTC SDK（低延迟）
- `hls/rtsp`：ExoPlayer（必要时接网关转码）
- `mjpeg`：Image pipeline
- 流状态统一为 `CameraStreamState`（connecting/connected/error/disconnected）

## 10. 地图渲染方案

- 第一阶段：Compose Canvas 渲染简化网格/位姿/路径。
- 第二阶段：接入真实 SLAM/导航数据。
- 第三阶段：航点编辑、避障可视化、地图诊断。

## 11. 三阶段实施范围

### 第一阶段：Mock 版（UI可演示）
- 完成两大 Screen + 关键组件。
- 以假数据驱动 StateFlow。
- 保留现有原型交互路径。

### 第二阶段：接真实机器人接口
- 接入 HTTP + WS/MQTT + SDK。
- 打通命令 ACK、遥测订阅、跟随模式三命令。
- 完成失败回滚与状态同步。

### 第三阶段：安全与测试强化
- 增加统一安全门禁（建议增加）。
- 完成异常注入测试（断流、弱网、低电、控制权丢失）。
- 增加集成测试与回归脚本。

## 12. React 状态设计到 ViewModel + StateFlow 的改造要点

- 将当前分散 `useState` 汇总成 `MainControlUiState` / `FollowUiState`。
- 把回调事件转为 `UiIntent`，避免组件直接调用 SDK。
- 把“是否可发送命令”做成可观测派生状态 `canSendControl`。
- 对需要ACK的操作统一使用 `pending -> success/failure` 状态机。

> 说明：以上计划严格依据当前原型代码结构整理；当前缺失的安全门禁、控制权管理、失败回滚细节均已标注为“建议增加”。
