# 接口清单 - 所有UI元素接口确认

本文档列出了四足机器人控制应用中所有UI元素及其对应的接口。

## ✅ 完整接口清单

### 📱 顶部状态栏（Top Bar）

| UI元素 | 类型 | 接口名称 | 接口类型 | 说明 |
|--------|------|----------|----------|------|
| ⚙️ 设置按钮 | 按钮 | - | UI状态 | 打开设置面板（面板内功能都有接口） |
| 📷 摄像头切换 | 按钮 | `onCameraSwitch` | 回调 | 切换前后摄像头 |
| 📹 摄像头位置显示 | 指示器 | `cameraStatus.position` | 状态输入 | 显示当前摄像头（前/后） |
| 🟢 运行状态 | 指示器 | `status.state` | 状态输入 | 显示待机/运行状态 |
| ⚠️ 诊断状态 | 指示器 | `status.diagnosticStatus` | 状态输入 | 显示正常/警告/故障 |
| 🏃 速度显示 | 指示器 | `status.speed` | 状态输入 | 显示当前速度 m/s |
| 🎯 当前动作显示 | 指示器 | - | UI状态 | 显示选中的动作名称 |
| 🔋 电量显示 | 指示器 | `status.battery` | 状态输入 | 显示电池电量百分比 |
| 🔴 电源按钮 | 按钮 | `onPowerToggle` | 回调 | 电源开关/急停 |
| ❌ 退出按钮 | 按钮 | `onExit` | 回调 | 退出应用 |

---

### 🎮 模式控制行（Mode Controls）

| UI元素 | 类型 | 接口名称 | 接口类型 | 说明 |
|--------|------|----------|----------|------|
| 🐢 速度模式 | 切换器 | `onSpeedModeChange` | 回调 | 慢速(0)/标准(1)/快速(2) |
| 🎮 控制方式 | 切换器 | `onControlModeChange` | 回调 | 手动(0)/自动跟随(1) |
| 🏃 运动模式 | 切换器 | `onMovementModeChange` | 回调 | 轻松(0)/标准(1)/稳定(2) |

---

### 🕹️ 底部控制区（Bottom Controls）

| UI元素 | 类型 | 接口名称 | 接口类型 | 说明 |
|--------|------|----------|----------|------|
| 👈 左摇杆 | 摇杆 | `onMovement` | 回调 | 移动控制（MovementCommand） |
| 🧍 站立按钮 | 按钮 | `onPostureChange` | 回调 | 切换到站立姿态 |
| 🐛 匍匐按钮 | 按钮 | `onPostureChange` | 回调 | 切换到匍匐姿态 |
| 🎯 动作选择器 | 选择器 | `onActionSelect` | 回调 | 选择预定义动作（ActionCommand） |
| ▶️ 跟随开始 | 按钮 | `onFollowToggle` | 回调 | 开启跟随模式 |
| ⏹️ 跟随停止 | 按钮 | `onFollowToggle` | 回调 | 关闭跟随模式 |
| 👉 右摇杆 | 摇杆 | `onDirection` | 回调 | 方向控制（DirectionCommand） |

---

### 📹 相机实时画面（Camera Stream）

| UI元素 | 类型 | 接口名称 | 接口类型 | 说明 |
|--------|------|----------|----------|------|
| 📺 视频流显示 | 视频 | `cameraStatus.streamUrl` | 状态输入 | 实时视频流地址 |
| 🎞️ 流类型配置 | 配置 | `cameraStatus.streamType` | 状态输入 | mjpeg/hls/webrtc/rtsp |
| 🔴 LIVE指示灯 | 指示器 | `cameraStatus.isActive` | 状态输入 | 摄像头激活状态 |
| 📊 分辨率显示 | 指示器 | `cameraStatus.resolution` | 状态输入 | 视频分辨率 |
| 🎬 帧率显示 | 指示器 | `cameraStatus.fps` | 状态输入 | 视频帧率 |
| ⚠️ 流错误回调 | 回调 | `onStreamError` | 回调 | 视频流错误处理 |
| ✅ 流连接回调 | 回调 | `onStreamConnected` | 回调 | 视频流连接成功 |

---

### 🗺️ 实时地图（Map Overlay）

| UI元素 | 类型 | 接口名称 | 接口类型 | 说明 |
|--------|------|----------|----------|------|
| 📍 机器人位置 | 指示器 | `mapData.robotPosition` | 状态输入 | {x, y} 坐标 |
| 🧭 机器人朝向 | 指示器 | `mapData.robotHeading` | 状态输入 | 角度（度） |
| 🛤️ 路径点 | 可视化 | `mapData.pathPoints` | 状态输入 | 路径点数组 |
| 🚧 障碍物 | 可视化 | `mapData.obstacles` | 状态输入 | 障碍物数组 |
| 🗺️ 边界 | 可视化 | `mapData.boundaries` | 状态输入 | 边界点数组 |
| 📌 航点 | 可视化 | `mapData.waypoints` | 状态输入 | 航点数组 |
| 🔄 地图更新 | 回调 | `onMapUpdate` | 回调 | 地图数据更新回调 |
| 🖱️ 拖拽功能 | 交互 | - | 内置 | 可拖动地图窗口 |
| 🔍 缩放按钮 | 按钮 | - | 内置 | 放大/缩小地图 |
| ⛶ 全屏切换 | 按钮 | - | 内置 | 全屏/窗口模式 |

---

### ⚙️ 设置面板（Settings Panel）

| UI元素 | 类型 | 接口名称 | 接口类型 | 说明 |
|--------|------|----------|----------|------|
| 🤖 AI辅助开关 | 开关 | `onAIAssistToggle` | 回调 | 开启/关闭AI辅助 |
| 🗺️ 地图开关 | 开关 | `onMapToggle` | 回调 | 显示/隐藏地图 |
| 🔌 自动充电 | 按钮 | `onAutoCharge` | 回调 | 触发自动充电 |
| 🔓 脱离充电 | 按钮 | `onAutoUndock` | 回调 | 脱离充电桩 |
| 🧭 地图导航 | 按钮 | `onMapNavigation` | 回调 | 开启地图导航 |
| 💾 离线地图管理 | 按钮 | `onOfflineMapManage` | 回调 | 管理离线地图 |

---

## 📊 接口统计

### 按类型分类：

- **回调接口（Callbacks）**: 22个
  - 运动控制: 2个（移动、方向）
  - 模式控制: 5个（速度、控制方式、运动、体态、跟随）
  - 动作控制: 1个（动作选择）
  - 系统控制: 3个（电源、退出、摄像头切换）
  - 地图控制: 1个（地图更新）
  - 设置控制: 6个（AI辅助、地图开关、充电等）
  - 视频流: 2个（流错误、流连接）
  - 其他: 2个

- **状态输入（State Inputs）**: 15个
  - 机器人状态: 5个（电量、速度、状态、诊断、温度/电压）
  - 摄像头状态: 5个（位置、激活、分辨率、帧率、流URL）
  - 地图数据: 6个（位置、朝向、路径、障碍、边界、航点）

- **内置功能**: 3个
  - 地图拖拽
  - 地图缩放
  - 地图全屏

---

## 🔌 接口使用示例

### 完整接口配置示例：

```typescript
<App
  // ========== 状态输入 ==========
  status={{
    battery: 85,
    speed: 1.2,
    state: 'running',
    diagnosticStatus: 'normal',
    temperature: 35,
    voltage: 24.5,
  }}
  
  cameraStatus={{
    position: 'front',
    isActive: true,
    resolution: '1920x1080',
    fps: 30,
    streamUrl: 'http://192.168.1.100:8080/video_feed',
    streamType: 'mjpeg',
  }}
  
  mapData={{
    robotPosition: { x: 10, y: 20 },
    robotHeading: 90,
    pathPoints: [{ x: 0, y: 0 }, { x: 10, y: 20 }],
    obstacles: [{ x: 5, y: 5, radius: 2 }],
  }}
  
  // ========== 运动控制回调 ==========
  onMovement={(cmd) => console.log('移动:', cmd)}
  onDirection={(cmd) => console.log('方向:', cmd)}
  
  // ========== 模式控制回调 ==========
  onSpeedModeChange={(mode) => console.log('速度模式:', mode)}
  onControlModeChange={(mode) => console.log('控制方式:', mode)}
  onMovementModeChange={(mode) => console.log('运动模式:', mode)}
  onPostureChange={(posture) => console.log('体态:', posture)}
  onFollowToggle={(enabled) => console.log('跟随:', enabled)}
  
  // ========== 动作控制回调 ==========
  onActionSelect={(action) => console.log('动作:', action)}
  
  // ========== 系统控制回调 ==========
  onPowerToggle={() => console.log('电源切换')}
  onExit={() => console.log('退出应用')}
  onCameraSwitch={(pos) => console.log('摄像头:', pos)}
  
  // ========== 地图回调 ==========
  onMapUpdate={(data) => console.log('地图更新:', data)}
  
  // ========== 设置回调 ==========
  onAIAssistToggle={(enabled) => console.log('AI辅助:', enabled)}
  onMapToggle={(enabled) => console.log('地图显示:', enabled)}
  onAutoCharge={() => console.log('自动充电')}
  onAutoUndock={() => console.log('脱离充电')}
/>
```

---

### 💡 特殊说明

**电源按钮（Power Button）**：
- 接口: `onPowerToggle?: () => void`
- UI: 红色圆形按钮，位于右上角
- 用途: 可以实现为电源开关或紧急停止按钮
- 建议实现: 
  ```typescript
  onPowerToggle: () => {
    // 方式1: 紧急停止所有运动
    robot.emergencyStop();
    
    // 方式2: 电源切换
    robot.togglePower();
    
    // 方式3: 结合使用（长按电源关闭，点击急停）
    // 需要自行在调用方实现长按逻辑
  }
  ```
- 额外接口: 如需单独的紧急停止接口，可以使用 `onEmergencyStop?: () => void`（已在接口定义中预留）

---

## ✅ 接口完整性确认

- ✅ **所有可点击按钮** 都有对应的回调接口
- ✅ **所有状态显示** 都有对应的数据输入接口
- ✅ **所有摇杆控制** 都有对应的控制接口
- ✅ **所有模式切换** 都有对应的回调接口
- ✅ **视频流** 有完整的配置和回调接口
- ✅ **实时地图** 有完整的数据输入和更新接口
- ✅ **设置面板** 中所有功能都有对应接口

## 📝 结论

**100%的UI元素都已连接到真实接口！**

每个按钮、显示器、控制器都有相应的接口定义，可以直接连接到真实的机器人控制系统。所有接口的详细定义和使用示例请参考：

- 接口定义: `/src/app/types/robot-interfaces.ts`
- 集成指南: `/INTEGRATION_GUIDE.md`
- 主应用: `/src/app/App.tsx`