# 跟随模式功能说明

## 📍 功能概述

四足机器人控制APP新增了独立的"跟随模式"二级页面，将跟随功能从主界面剥离，作为独立的能力模块，提高主界面的简洁度。

## 🚀 访问路径

```
主界面 → 设置按钮 → 地图与任务 → 扩展与开发 → 跟随模式
```

## 📱 页面功能

### 1. 模式选择
- **手动控制**（默认选中）：通过摇杆手动控制机器人
- **自动跟随**：需要依赖GPS或视觉能力的自动跟随模式

### 2. 跟随控制
- **开始跟随**：启动自动跟随（主按钮，绿色）
- **停止跟随**：停止跟随并返回待机状态（红色按钮）

### 3. 跟随参数
- **跟随距离**：可调节范围 0.5m - 5.0m
- **跟随速度**：慢 / 中 / 快三档
- **目标类型**：人 / 设备

### 4. 状态显示
实时显示当前跟随状态：
- **未启动**：灰色，初始状态
- **跟随中**：绿色，正在跟踪目标
- **目标丢失**：红色，失去跟踪目标

## 🔌 接口集成

### 新增接口类型

```typescript
// 跟随模式配置
export interface FollowModeConfig {
  mode: FollowMode;           // "manual" | "auto"
  distance: number;           // 跟随距离（米）
  speed: FollowSpeed;         // "slow" | "medium" | "fast"
  targetType: TargetType;     // "person" | "device"
}

// 跟随模式回调
export interface FollowModeCallbacks {
  onFollowModeStart?: (config: FollowModeConfig) => void;
  onFollowModeStop?: () => void;
  onFollowModeStatusChange?: (status: FollowStatus) => void;
  onFollowModeConfigChange?: (config: Partial<FollowModeConfig>) => void;
}
```

### 集成示例

```typescript
import { RootApp } from './app';

function MyRobotApp() {
  return (
    <RootApp
      onFollowModeStart={(config) => {
        console.log('开始跟随:', config);
        // 发送指令到机器人
        robotAPI.startFollow(config);
      }}
      onFollowModeStop={() => {
        console.log('停止跟随');
        robotAPI.stopFollow();
      }}
      onFollowModeStatusChange={(status) => {
        console.log('跟随状态变更:', status);
        // 更新UI或发送通知
      }}
    />
  );
}
```

## 🎨 设计特点

- **深色背景**：与主界面一致的黑色背景
- **卡片分区**：功能模块使用半透明卡片分隔
- **主按钮突出**：绿色"开始跟随"按钮醒目
- **红色停止**：红色"停止跟随"按钮警示性强
- **横屏优化**：专为Android横屏设计的布局
- **动画反馈**：流畅的交互动画和状态指示

## 📊 当前状态

✅ **完成的功能**
- 独立的跟随模式页面
- 完整的UI和交互逻辑
- 路由导航系统
- 接口类型定义
- 设置面板入口

🔄 **待接入的功能**
- 真实机器人API调用（需替换console.log）
- WebSocket实时状态更新
- GPS/视觉系统集成
- 目标识别和跟踪算法

## 🛠️ 技术实现

### 路由系统
使用 React Router Data 模式：
```typescript
// 路由配置
const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/follow-mode", element: <FollowModePage /> }
]);
```

### 导航方式
```typescript
import { useNavigate } from 'react-router';

function Component() {
  const navigate = useNavigate();
  
  // 跳转到跟随模式页面
  navigate('/follow-mode');
  
  // 返回主界面
  navigate('/');
}
```

## 📝 使用建议

1. **首次使用**：先在"手动控制"模式下熟悉界面
2. **自动跟随**：确保机器人GPS/视觉系统正常后再使用
3. **安全距离**：建议设置1.5m以上的跟随距离
4. **测试环境**：在开阔环境中测试自动跟随功能
5. **紧急停止**：随时可通过"停止"按钮或主界面急停按钮中断

## 🔗 相关文件

- `/src/app/pages/FollowModePage.tsx` - 跟随模式页面组件
- `/src/app/routes.tsx` - 路由配置
- `/src/app/types/robot-interfaces.ts` - 接口定义（第108-127行）
- `/src/app/components/SettingsPanel.tsx` - 设置面板（含入口）
- `/src/app/RootApp.tsx` - 带路由的根组件
