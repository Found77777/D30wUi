# 03 控制状态清单（Control State Map）

## React useState -> Android ViewModel StateFlow 映射

| React 当前状态 | 位置 | 未来 ViewModel 状态（建议） | 说明 |
|---|---|---|---|
| `speedMode` | MainApp | `uiState.speedMode: SpeedMode` | 速度模式 |
| `movementMode` | MainApp | `uiState.movementMode: MovementMode` | 运动模式 |
| `cameraPosition` | MainApp | `uiState.cameraPosition` | 前/后摄像头 |
| `postureMode` | MainApp | `uiState.postureMode` | 站立/匍匐 |
| `selectedAction` | MainApp | `uiState.selectedAction` | 当前动作 |
| `isSettingsOpen` | MainApp | `uiState.settingsSheetVisible` | UI态 |
| `isMapVisible` | MainApp | `uiState.mapOverlayVisible` | UI态 |
| `isMapMode` | MainApp | `uiState.mapModeEnabled` | 相机/地图背景态 |
| `isExitModalOpen` | MainApp | `uiState.exitDialogVisible` | UI态 |
| `followMode` | FollowModePage | `followUiState.mode` | 手动/自动 |
| `followStatus` | FollowModePage | `followUiState.status` | idle/following/target-lost |
| `followDistance` | FollowModePage | `followUiState.distanceMeters` | 跟随距离 |
| `followSpeed` | FollowModePage | `followUiState.speed` | 跟随速度 |
| `streamState`/`errorMessage` | CameraStream | `cameraUiState.streamState/error` | 流连接状态 |
| `zoom` | MapOverlay/MapBackground | `mapUiState.zoom` | 地图缩放 |

---

## 全局控制域状态（建议补齐）

当前接口里已有但未形成状态机的关键域：

- App 连接状态：`isConnected`、`connectionQuality`（props有定义，主页面未使用）
- 机器人在线状态：建议 `robotOnline: Boolean`
- 控制权状态：建议 `controlAuthority: {owner, granted, expiresAt}`
- 急停状态：建议 `estopState: Idle/Triggered/Recovering`
- error/loading：建议统一 `uiState.error`、`uiState.loading`

---

## 状态流转（简化）

1. **连接流转**：`Disconnected -> Connecting -> Connected -> Degraded -> Disconnected`
2. **控制流转**：`NoAuthority -> RequestingAuthority -> AuthorityGranted -> AuthorityLost`
3. **跟随流转**：`idle -> following -> target-lost -> idle`
4. **相机流转**：`disconnected -> connecting -> connected -> error`
5. **急停流转**：`Idle -> Triggered -> (人工复位) -> Idle`

---

## 哪些状态下禁止发送控制命令

应禁止 `onMovement/onDirection/onActionSelect/onPostureChange/onModeChange` 的场景（**建议增加**）：

- `isConnected == false`
- `connectionQuality == disconnected`
- `robotStatus.state == error`
- `diagnosticStatus == error`（或 warning 时仅限速）
- `battery <= lowBatteryThreshold`（如 15%）
- `controlAuthority != granted`
- `estopState == Triggered`
- 跟随模式 `following` 且策略要求禁止人工摇杆抢占

> 当前 React 原型主要是展示层，缺少上述门禁策略；迁移 Android 时应在 ViewModel/UseCase 层统一拦截，而不是散落在按钮点击中。
