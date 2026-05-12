# 02 组件清单（Component Map）

## 组件总表

| 组件 | React 文件 | 主要页面 | 可复用性 | 实时状态 | 危险操作 | 未来 Compose 文件名（建议） |
|---|---|---|---|---|---|---|
| Joystick | `src/app/components/Joystick.tsx` | 主控制页 | 高 | 高 | 间接高 | `JoystickControl.kt` |
| ModeGroup | `src/app/components/ModeGroup.tsx` | 主控制页 | 高 | 中 | 中 | `ModeSegmentGroup.kt` |
| VerticalActionPicker | `src/app/components/VerticalActionPicker.tsx` | 主控制页 | 中 | 中 | 中 | `ActionWheelPicker.kt` |
| SettingsPanel | `src/app/components/SettingsPanel.tsx` | 主控制页 | 中 | 中 | 高 | `SettingsControlSheet.kt` |
| MapOverlay | `src/app/components/MapOverlay.tsx` | 主控制页 | 中 | 中 | 中 | `MiniMapOverlay.kt` |
| CameraStream | `src/app/components/CameraStream.tsx` | 主控制页 | 高 | 高 | 低 | `CameraStreamView.kt` |
| MapBackground | `src/app/components/MapBackground.tsx` | 主控制页 | 中 | 中 | 低 | `MapBackgroundLayer.kt` |
| ExitConfirmModal | `src/app/components/ExitConfirmModal.tsx` | 主控制页 | 高 | 低 | 中 | `ExitConfirmDialog.kt` |

---

## 关键组件细化

### Joystick
- 展示内容：外圈 + 摇杆内核。
- 输入参数：`size`、`onChange(x,y)`。
- 用户交互：拖拽、释放回中。
- 复用性：高（移动/方向同构）。
- 实时状态：高频 Pointer 事件连续输出。
- 危险操作关联：直接驱动运动命令，需在上层进行限流与安全门禁。

### ModeGroup
- 展示内容：标题 + 多选项分段按钮。
- 输入参数：`title` `options` `activeIndex` `onChange`。
- 用户交互：点击切换模式。
- 复用性：高。
- 实时状态：中。
- 危险操作关联：速度模式、运动模式均可能改变风险等级。

### VerticalActionPicker
- 展示内容：动作锁定态 + 可滚动选择态。
- 输入参数：`actions`、`onSelect(action)`。
- 用户交互：点击进入编辑、滚动、确认。
- 复用性：中（场景特定）。
- 实时状态：中（滚动+选择）。
- 危险操作关联：动作切换可能导致体态/稳定性变化。

### SettingsPanel
- 展示内容：基础功能 + 地图与任务 Tab，含开关、按钮、IP 配置。
- 输入参数：`isOpen`、`onClose` 及一系列回调。
- 用户交互：开关、按钮、输入框、导航跳转。
- 复用性：中。
- 实时状态：中。
- 危险操作关联：自动充电/出桩、SDK、云台、地图导航均可能影响机器人行为。

### MapOverlay
- 展示内容：可拖拽小地图、缩放按钮、坐标信息。
- 输入参数：`isVisible` `isMapMode` `onToggleMapMode` `mapData`。
- 用户交互：拖拽、缩放、全屏切换。
- 复用性：中。
- 实时状态：中（地图刷新+缩放）。
- 危险操作关联：导航态可引导路径决策（当前仅UI）。

### CameraStream
- 展示内容：视频画面或连接状态占位（connecting/error/disconnected）。
- 输入参数：`cameraStatus` `videoRef` `imageUrl` 回调。
- 用户交互：无直接操作。
- 复用性：高。
- 实时状态：高（流连接/断流/帧显示）。
- 危险操作关联：视觉失效将影响安全驾驶。

### MapBackground
- 展示内容：地图网格、机器人位置、缩放、坐标信息。
- 输入参数：`mapData`。
- 用户交互：缩放。
- 复用性：中。
- 实时状态：中。
- 危险操作关联：态势感知组件，非直接命令。

### ExitConfirmModal
- 展示内容：退出确认对话框。
- 输入参数：`isOpen` `onClose` `onConfirm`。
- 用户交互：取消/确认退出。
- 复用性：高。
- 实时状态：低。
- 危险操作关联：退出控制可能导致无人值守风险。

---

## 重点元素识别映射

- **急停按钮**：位于主控制页顶部右侧，直接触发 `onEmergencyStop`，无二次确认（正确方向）。
- **电池状态**：主控制页顶部右侧百分比 + 图标填充。
- **运行状态**：`robotStatus.state`（待机/运行/错误）。
- **诊断状态**：`robotStatus.diagnosticStatus`（正常/警告/故障）。
- **速度显示**：`robotStatus.speed` m/s。
- **摄像头切换按钮**：顶部左侧 `SwitchCamera`。
- **地图/摄像头切换按钮**：顶部右侧 Map/Camera 图标切换 `isMapMode`。

> 说明：上述“状态显示”当前内联在 `MainApp`，并非独立组件；迁移到 Compose 时建议抽为 `StatusChipsRow.kt`、`EmergencyStopButton.kt` 等可测试子组件。
