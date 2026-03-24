# 四足机器人控制应用 - Android横屏版

专为Android横屏手机设计的四足机器人控制应用，采用纯黑背景配合实时摄像头画面，所有UI元素使用半透明覆盖层显示，优化双拇指操作体验。

## 📱 应用特性

- **横屏适配**: 专为854×480手机横屏设计
- **实时控制**: 双摇杆控制系统（移动+方向）
- **视频流**: 支持WebRTC、RTSP、HLS、MJPEG多种流类型
- **地图导航**: 可切换实时地图背景，支持拖拽缩放
- **极简科技**: 半透明UI覆盖层，保持界面清晰
- **接口完整**: 48个UI元素100%接入真实机器人控制接口

## 🎮 界面布局

### 顶部控制栏（半透明覆盖）

**左上角（设置区）**
- ⚙️ **设置按钮** - 打开设置面板
- 📷 **摄像头切换** - 前后摄像头切换

**右上角（状态区）**
- 🔋 **电量显示** - 实时电池电量（73%）
- 🚨 **急停按钮** - 紧急停止所有运动
- ❌ **退出按钮** - 退出应用（带确认弹窗）

### 中部模式控制（顶部下方）

**左侧模式组**
- 🏃 **速度模式**: 慢速 / 标准 / 快速

**右侧模式组**
- 🎯 **运动模式**: 轻松 / 标准 / 稳定

### 底部控制区（分散布局）

**最左侧 - 移动控制**
- 🕹️ **移动摇杆** (130px) - 控制前后左右移动
- 📊 显示: X轴、Y轴坐标

**中左 - 体态切换**
- 🦎 **体态切换器** (80px圆形)
  - 站立姿态 🧍
  - 爬行姿态 🦎

**中央 - 动作选择**
- 🎬 **动作选择器** (竖向滚动)
  - 标准站立 🤖
  - 低姿态行走 🦎
  - 稳定支撑 🏔️
  - 贴地模式 🐍
  - 越障模式 🪜

**最右侧 - 方向控制**
- 🕹️ **方向摇杆** (130px) - 控制旋转和朝向
- 📊 显示: X轴、Y轴坐标

## ⚙️ 设置面板

设置面板位于左侧，采用双标签页结构：

### 基础功能标签

#### 1. AI辅助模块
- **AI辅助** - Toggle开关
- 描述：开启后提供智能避障和路径规划

#### 2. 充电控制模块
- **自动充电** - 按钮操作
- **自主出桩** - 按钮操作

#### 3. 产品信息模块（可折叠）
- **标题**: 设备IP
- **状态**: 默认折叠，点击展开
- **内容**:
  - 机器人IP（可编辑）: 192.168.144.3
  - 机器人导航IP（可编辑）: 192.168.144.3
  - 地图路径（只读）: /home/jetson/linx/data/map

### 地图控制标签

#### 1. 地图控制模块
- **地图显示** - Toggle开关
- 描述：打开后右侧显示地图

#### 2. 地图管理模块
- **建图导航** - 按钮跳转
- **离线地图管理** - 按钮跳转

#### 3. 扩展与开发模块（统一列表风格）

所有项采用统一结构：`[左侧icon] [标题+描述] [右侧控件]`

**1️⃣ 跟随模式**（第一排）
- 图标：📻 Radio（蓝色）
- 标题：跟随模式
- 描述：配置自动跟随功能
- 交互：跳转 > 箭头

**2️⃣ 云台控制**（第二排）
- 图标：📹 Video（青色）
- 标题：云台控制
- 描述：开启或关闭云台
- 交互：Toggle开关

**3️⃣ SDK**（最下面）
- 图标：💻 Monitor（紫色）
- 标题：SDK
- 描述：开启SDK调试模式
- 交互：Toggle开关

## 🗺️ 地图功能

### 地图模式切换
- **缩略图模式**: 右上角小窗口，可拖拽
- **全屏模式**: 点击放大按钮切换为背景

### 地图显示元素

**左侧垂直居中（不干涉其他元素）**
- 📍 **坐标显示**（紧凑型）
  - X: 0.00m
  - Y: 0.00m
  - 朝向: 0.0°
  - 位置：垂直居中(`top-1/2 -translate-y-1/2`)
  - 大小：10px字体，1.5行间距

**左侧底部**
- 🔍 **缩放控制**
  - ➕ 放大按钮
  - ➖ 缩小按钮
  - 位置：`bottom-48`（192px from bottom）

**右侧区域**
- 📏 **距离比例尺**（右上）
- 📊 **地图信息**（右下）
  - 缩放倍数
  - 定位状态

**注意**: 红色Compass指南针已移除，坐标显示已缩小并垂直居中，避免与速度模块（top-12）和缩放控件（bottom-48）干涉。

## 🎯 跟随模式页面

### 功能模块

#### 1. 模式选择
- **手动控制**: 通过摇杆控制移动
- **自动跟随**: 依赖GPS或视觉能力（仅跟随设备）

#### 2. 跟随控制
- **开始跟随** - 绿色按钮
- **停止跟随** - 红色按钮

#### 3. 跟随参数
- **跟随距离**: 0.5m - 5.0m（滑块调节）
- **跟随速度**: 慢 / 中 / 快

#### 4. 状态显示
- 未启动
- 跟随中（带动画指示）
- 目标丢失

**注意**: 目标类型选择已删除，应用专注于设备跟随。

## 🔌 接口系统

### 主要接口文件
`/src/app/types/robot-interfaces.ts`

### 接口类别

#### 1. 系统控制接口
```typescript
onPowerToggle?: () => void;           // 电源开关
onEmergencyStop?: () => void;         // 紧急停止 ✅
onExit?: () => void;                  // 退出应用 ✅
```

#### 2. 摄像头控制接口
```typescript
onCameraSwitch?: (position: "front" | "back") => void; // 切换摄像头 ✅
onCameraToggle?: (enabled: boolean) => void;           // 开关摄像头
```

#### 3. 模式控制接口
```typescript
onSpeedModeChange?: (mode: 0 | 1 | 2) => void;      // 速度模式 ✅
onMovementModeChange?: (mode: 0 | 1 | 2) => void;   // 运动模式 ✅
onPostureChange?: (posture: PostureMode) => void;    // 体态变更 ✅
```

#### 4. 运动控制接口
```typescript
onMovement?: (command: MovementCommand) => void;     // 移动摇杆 ✅
onDirection?: (command: DirectionCommand) => void;   // 方向摇杆 ✅
```

#### 5. 动作控制接口
```typescript
onActionSelect?: (action: ActionCommand) => void;    // 动作选择 ✅
```

#### 6. 地图和导航接口
```typescript
onMapUpdate?: (data: MapData) => void;               // 地图更新 ✅
onMapToggle?: (enabled: boolean) => void;            // 地图开关 ✅
onMapNavigation?: () => void;                        // 建图导航 ✅
onOfflineMapManage?: () => void;                     // 离线地图管理 ✅
```

#### 7. 设置接口
```typescript
onSettingsChange?: (settings: Partial<RobotSettings>) => void; // 设置变更
onAIAssistToggle?: (enabled: boolean) => void;                 // AI辅助 ✅
onAutoCharge?: () => void;                                     // 自动充电 ✅
onAutoUndock?: () => void;                                     // 自主出桩 ✅
onSDKToggle?: (enabled: boolean) => void;                      // SDK开关 ✅
onGimbalEnable?: () => void;                                   // 云台控制 ✅
onProductInfoUpdate?: (info: {                                 // 产品信息更新 ✅
  robotIP?: string;
  navIP?: string;
  mapPath?: string;
}) => void;
```

### 接口覆盖率
✅ **48个UI元素 - 100%接口覆盖**

## 📊 UI元素接口映射表

| UI元素 | 接口方法 | 状态 | 位置 |
|--------|---------|------|------|
| ⚙️ 设置按钮 | `setIsSettingsOpen` | ✅ | 顶部左上 |
| 📷 摄像头切换 | `onCameraSwitch` | ✅ | 顶部左上 |
| 🔋 电量显示 | `status.battery` | ✅ | 顶部右上 |
| 🚨 急停按钮 | `onEmergencyStop` | ✅ | 顶部右上 |
| ❌ 退出按钮 | `onExit` | ✅ | 顶部右上 |
| 🏃 速度模式 | `onSpeedModeChange` | ✅ | 中部左侧 |
| 🎯 运动模式 | `onMovementModeChange` | ✅ | 中部右侧 |
| 🕹️ 移动摇杆 | `onMovement` | ✅ | 底部最左 |
| 🦎 体态切换 | `onPostureChange` | ✅ | 底部中左 |
| 🎬 动作选择器 | `onActionSelect` | ✅ | 底部中央 |
| 🕹️ 方向摇杆 | `onDirection` | ✅ | 底部最右 |
| 🧠 AI辅助 | `onAIAssistToggle` | ✅ | 设置-基础 |
| 🔌 自动充电 | `onAutoCharge` | ✅ | 设置-基础 |
| 🚪 自主出桩 | `onAutoUndock` | ✅ | 设置-基础 |
| 🌐 设备IP（机器人IP） | `onProductInfoUpdate` | ✅ | 设置-基础 |
| 🌐 设备IP（导航IP） | `onProductInfoUpdate` | ✅ | 设置-基础 |
| 📂 地图路径 | `onProductInfoUpdate` | ✅ | 设置-基础 |
| 🗺️ 地图显示 | `onMapToggle` | ✅ | 设置-地图 |
| 🗺️ 建图导航 | `onMapNavigation` | ✅ | 设置-地图 |
| 📁 离线地图管理 | `onOfflineMapManage` | ✅ | 设置-地图 |
| 📻 跟随模式 | `handleFollowModeClick` | ✅ | 设置-地图 |
| 📹 云台控制 | `onGimbalEnable` | ✅ | 设置-地图 |
| 💻 SDK | `onSDKToggle` | ✅ | 设置-地图 |

## 🛠️ 技术栈

- **React 18** - UI框架
- **TypeScript** - 类型安全
- **Tailwind CSS v4** - 样式系统
- **Motion (Framer Motion)** - 动画库
- **React Router** - 路由管理
- **Lucide React** - 图标库

## 📦 项目结构

```
/src/app/
├── App.tsx                      # 主应用组件
├── routes.tsx                   # 路由配置
├── types/
│   └── robot-interfaces.ts      # 接口定义（完整）
├── components/
│   ├── Joystick.tsx            # 摇杆组件
│   ├── ModeGroup.tsx           # 模式切换组件
│   ├── PostureSwitcher.tsx     # 体态切换器
│   ├── VerticalActionPicker.tsx # 动作选择器
│   ├── SettingsPanel.tsx       # 设置面板
│   ├── MapOverlay.tsx          # 地图覆盖层
│   ├── MapBackground.tsx       # 地图背景
│   ├── CameraStream.tsx        # 相机流组件
│   └── ExitConfirmModal.tsx    # 退出确认弹窗
└── pages/
    └── FollowModePage.tsx      # 跟随模式页面
```

## 🚀 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```

### 3. 接入真实机器人

#### 基础集成示例
```typescript
import App from './app/App';
import { RobotControlCallbacks } from './app/types/robot-interfaces';

const robotCallbacks: RobotControlCallbacks = {
  // 运动控制
  onMovement: (command) => {
    console.log('移动命令:', command.x, command.y);
    // 发送到机器人: POST /api/move
  },
  
  onDirection: (command) => {
    console.log('方向命令:', command.x, command.y);
    // 发送到机器人: POST /api/rotate
  },
  
  // 模式控制
  onSpeedModeChange: (mode) => {
    console.log('速度模式:', ['慢速', '标准', '快速'][mode]);
    // 发送到机器人: POST /api/speed
  },
  
  // 紧急控制
  onEmergencyStop: () => {
    console.log('🚨 紧急停止');
    // 发送到机器人: POST /api/emergency-stop
  },
  
  // 摄像头控制
  onCameraSwitch: (position) => {
    console.log('📷 切换摄像头:', position);
    // 发送到机器人: POST /api/camera/switch
  },
};

<App {...robotCallbacks} />
```

#### 完整集成示例（带状态）
```typescript
import { useState, useEffect } from 'react';
import App from './app/App';
import { RobotStatus, CameraStatus, MapData, ProductInfo } from './app/types/robot-interfaces';

function RobotControlApp() {
  const [robotStatus, setRobotStatus] = useState<RobotStatus>({
    battery: 73,
    speed: 0,
    state: 'standby',
    diagnosticStatus: 'normal',
  });

  const [cameraStatus, setCameraStatus] = useState<CameraStatus>({
    position: 'front',
    isActive: true,
    streamUrl: 'http://192.168.144.3:8080/stream',
    streamType: 'mjpeg', // 或 'webrtc', 'hls', 'rtsp'
  });

  const [mapData, setMapData] = useState<MapData>({
    robotPosition: { x: 0, y: 0 },
    robotHeading: 0,
  });

  const [productInfo] = useState<ProductInfo>({
    robotIP: '192.168.144.3',
    navIP: '192.168.144.3',
    mapPath: '/home/jetson/linx/data/map',
  });

  // WebSocket连接获取实时数据
  useEffect(() => {
    const ws = new WebSocket('ws://192.168.144.3:9090');
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      if (message.type === 'telemetry') {
        setRobotStatus(message.data);
      } else if (message.type === 'map') {
        setMapData(message.data);
      }
    };

    return () => ws.close();
  }, []);

  return (
    <App
      status={robotStatus}
      cameraStatus={cameraStatus}
      mapData={mapData}
      productInfo={productInfo}
      onMovement={(command) => {
        fetch('http://192.168.144.3:8080/api/move', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(command),
        });
      }}
      onEmergencyStop={() => {
        fetch('http://192.168.144.3:8080/api/emergency-stop', {
          method: 'POST',
        });
      }}
      onProductInfoUpdate={(info) => {
        console.log('产品信息更新:', info);
        // 保存到本地存储或发送到服务器
      }}
      // ... 其他回调
    />
  );
}
```

## 🎥 视频流接入

### 支持的流类型

#### 1. MJPEG（最简单）
```typescript
cameraStatus={{
  streamUrl: 'http://192.168.144.3:8080/video_feed',
  streamType: 'mjpeg',
  isActive: true,
}}
```

#### 2. WebRTC（低延迟）
```typescript
cameraStatus={{
  streamUrl: 'wss://192.168.144.3:8080/webrtc',
  streamType: 'webrtc',
  isActive: true,
}}
```

#### 3. HLS（稳定）
```typescript
cameraStatus={{
  streamUrl: 'http://192.168.144.3:8080/stream.m3u8',
  streamType: 'hls',
  isActive: true,
}}
```

#### 4. RTSP（专业）
```typescript
cameraStatus={{
  streamUrl: 'rtsp://192.168.144.3:8554/live',
  streamType: 'rtsp',
  isActive: true,
}}
```

## 📝 开发注意事项

### 1. 坐标显示位置
- 位置：垂直居中 (`top-1/2 -translate-y-1/2 left-4`)
- 大小：紧凑型（10px字体）
- 避免干涉：不与速度模块（top-12）和缩放控件（bottom-48）重叠

### 2. 地图功能
- Compass指南针已移除
- 坐标信息已缩小并居中显示
- 缩放控件位于左下角
- 支持拖拽和全屏模式

### 3. 设置面板
- 产品信息默认折叠，点击"设备IP"展开
- 扩展与开发模块采用统一列表风格
- 所有设置项高度统一（p-4 = 16px padding）

### 4. 跟随模式
- 已删除目标类型选择（专注设备跟随）
- 保留距离和速度调节
- 支持手动/自动模式切换

## 🔍 调试与测试

### Console日志格式
```typescript
// 运动控制
console.log('🕹️ 移动摇杆:', x, y);
console.log('🎯 方向摇杆:', x, y);

// 模式切换
console.log('⚡ 速度模式变更:', mode);
console.log('🏃 运动模式变更:', mode);

// 设置操作
console.log('🧠 AI辅助:', enabled);
console.log('🗺️ 地图显示:', enabled);
console.log('📹 云台控制:', enabled ? '开启' : '关闭');
console.log('💻 SDK调试:', enabled);

// 紧急操作
console.log('🚨 紧急停止触发');
console.log('❌ 退出应用');
```

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request！

---

**版本**: V2.0.3  
**更新日期**: 2026-03-24  
**接口覆盖率**: 100% (48/48)