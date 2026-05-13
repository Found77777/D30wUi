# 01 React UI Inventory（Hybrid 方案基线盘点）

> 目标：采用 **React UI + Android WebView + JavaScript Bridge + Android SDK Adapter**。本文件仅做代码审查与文档整理，不引入 Android 工程代码。

## 1. 当前 React 项目的入口文件
- `src/main.tsx`：`createRoot(...).render(<App />)`，引入 `src/styles/index.css`。
- `src/app/App.tsx`：默认导出 `AppWithRouter`（`RouterProvider(router)`），主控制页实现 `MainApp`。
- `src/app/routes.tsx`：路由定义 `/` 与 `/follow-mode`。

## 2. 当前 React 项目的构建方式
- 构建工具：Vite。
- scripts：`dev`=`vite`，`build`=`vite build`。
- 模块：`type: module`。
- 样式：Tailwind + 全局 CSS。

## 3. 页面清单
1. 主控制页 `/`（`src/app/App.tsx`）
2. 跟随模式页 `/follow-mode`（`src/app/pages/FollowModePage.tsx`）

## 4. 组件清单
- `Joystick.tsx`
- `ModeGroup.tsx`
- `VerticalActionPicker.tsx`
- `SettingsPanel.tsx`
- `MapOverlay.tsx`
- `CameraStream.tsx`
- `MapBackground.tsx`
- `ExitConfirmModal.tsx`

## 5. 当前控制回调清单
来源：`src/app/types/robot-interfaces.ts`
- 系统：`onEmergencyStop` `onExit` `onPowerToggle`
- 摄像头：`onCameraSwitch` `onCameraToggle`
- 模式：`onSpeedModeChange` `onControlModeChange` `onMovementModeChange` `onPostureChange`
- 运动：`onMovement` `onDirection` `onFollowToggle`
- 动作：`onActionSelect` `onActionExecute`
- 地图导航：`onMapUpdate` `onNavigationStart` `onNavigationStop`
- 设置扩展：`onAIAssistToggle` `onMapToggle` `onAutoCharge` `onAutoUndock` `onSDKToggle` `onGimbalEnable` `onMapNavigation` `onOfflineMapManage` `onProductInfoUpdate`

## 6. 当前状态清单
### MainApp
- `speedMode` `movementMode` `cameraPosition` `postureMode` `selectedAction`
- `isSettingsOpen` `isMapVisible` `isMapMode` `isExitModalOpen`

### FollowModePage
- `followMode` `followStatus` `followDistance` `followSpeed`

### 组件内部
- Joystick：`position` `isDragging`
- CameraStream：`streamState` `errorMessage`
- MapOverlay/MapBackground：`zoom`
- SettingsPanel：tab、开关、输入态
- VerticalActionPicker：`selectedIndex` `isExpanded`

### 外部 props 状态
- `status` `cameraStatus` `mapData` `settings` `productInfo`
- `isConnected` `connectionQuality`

## 7. 摇杆相关逻辑
- 左摇杆 -> `onMovement({x,y,timestamp})`
- 右摇杆 -> `onDirection({x,y,timestamp})`
- Pointer 事件归一化到 `[-1,1]`，抬手回中并发送 `(0,0)`。

## 8. 急停相关逻辑
- 右上红色按钮直接触发 `onEmergencyStop`。
- 无二次确认；当前无统一 ACK/失败回滚机制。

## 9. 摄像头/地图相关逻辑
- `isMapMode=false` 显示 `CameraStream`
- `isMapMode=true` 显示 `MapBackground`
- `MapOverlay` 由 `isMapVisible` 控制
- `CameraStream` 支持流类型语义，但多数为占位逻辑

## 10. 设置面板相关逻辑
- 左侧滑入 `SettingsPanel`，含基础功能/地图任务双 Tab。
- 包含 AI、地图、自动充电、出桩、SDK、云台、建图导航、离线地图、跟随入口、产品信息配置。

## 11. 跟随模式相关逻辑
- 自动/手动切换、开始/停止、距离 slider、速度切换、状态显示。
- 真实调用仍为 TODO（`followMode.start/stop/updateConfig`）。

## 12. 哪些地方需要通过 Android SDK 实现
- 命令发送与 ACK
- 连接/控制权/诊断/低电门禁
- 实时视频流接入
- 地图与导航实时数据
- 跟随模式真实能力
- 配置持久化与权限控制

## 13. 哪些 UI 可以原样保留
- 页面结构、控制台布局、设置面板、跟随页
- 摇杆/模式组/动作选择交互
- Tailwind + motion 动画风格

## 14. 哪些代码需要为 WebView bridge 做最小适配
- 新增统一 bridge 适配层：`sendCommand(type,payload)`
- 统一命令出口（替代分散 callback）
- Android -> Web 状态注入入口
- 摇杆高频节流 + release stop 包
- 统一 `BLOCKED/FAILED/ACKED` 反馈
- 浏览器 mock 与 WebView bridge 双环境切换

---

结论：UI 可高复用，核心工作在 Bridge 协议与 Android SDK Adapter，而非重写前端视图。
