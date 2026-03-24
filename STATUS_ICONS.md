# 📊 状态图标动态效果参考

## 🎨 顶部状态栏图标变化说明

### 1. 🏃 运行状态 (status.state)

| 状态值 | 图标 | 颜色 | 文字显示 | 说明 |
|--------|------|------|---------|------|
| `"standby"` | Activity | 🔵 蓝色 (#60A5FA) | 待机 | 机器人处于待命状态 |
| `"running"` | Activity | 🟢 绿色 (#22C55E) | 运行 | 机器人正在执行任务 |
| `"error"` | AlertOctagon | 🔴 红色 (#EF4444) | 错误 | 机器人发生错误 |

**代码实现:**
```typescript
{robotStatus.state === "standby" ? (
  <Activity className="w-3 h-3 text-blue-400" />
) : robotStatus.state === "running" ? (
  <Activity className="w-3 h-3 text-green-500" />
) : (
  <AlertOctagon className="w-3 h-3 text-red-500" />
)}
```

---

### 2. ⚠️ 诊断状态 (status.diagnosticStatus)

| 状态值 | 图标 | 颜色 | 文字显示 | 说明 |
|--------|------|------|---------|------|
| `"normal"` | AlertCircle | 🟢 绿色 (#22C55E) | 正常 | 系统一切正常 |
| `"warning"` | AlertCircle | 🟡 黄色 (#EAB308) | 警告 | 系统有警告信息 |
| `"error"` | AlertCircle | 🔴 红色 (#EF4444) | 故障 | 系统出现故障 |

**代码实现:**
```typescript
<AlertCircle
  className={`w-3 h-3 ${
    robotStatus.diagnosticStatus === "normal"
      ? "text-green-500"
      : robotStatus.diagnosticStatus === "warning"
        ? "text-yellow-500"
        : "text-red-500"
  }`}
/>
```

---

### 3. ⚡ 速度显示 (status.speed)

| 条件 | 图标 | 颜色 | 效果 | 说明 |
|------|------|------|------|------|
| `speed > 0` | Zap | 🟡 黄色 (#FBBF24) | 高亮 | 机器人正在移动 |
| `speed === 0` | Zap | ⚪ 半透明白色 (white/50) | 暗淡 | 机器人静止 |

**代码实现:**
```typescript
<Zap 
  className={`w-3 h-3 ${
    robotStatus.speed > 0 
      ? "text-yellow-400" 
      : "text-white/50"
  }`}
/>
<span>{robotStatus.speed.toFixed(1)} m/s</span>
```

---

### 4. 🔋 电量显示 (status.battery)

| 条件 | 图标 | 颜色 | 填充条 | 说明 |
|------|------|------|--------|------|
| `battery > 20` | Battery | 🟢 绿色 (#22C55E) | 按百分比填充 | 电量充足 |
| `battery ≤ 20` | Battery | 🔴 红色 (#EF4444) | 按百分比填充 | 电量低，需充电 |

**代码实现:**
```typescript
<Battery
  className={`w-5 h-5 ${
    robotStatus.battery > 20
      ? "text-green-500"
      : "text-red-500"
  }`}
/>
<div
  className="absolute top-1 left-1 h-1.5 bg-current rounded-sm transition-all"
  style={{
    width: `${(robotStatus.battery / 100) * 12}px`,
  }}
/>
```

**动态效果:**
- 填充条宽度根据电量百分比实时变化
- 电量≤20%时整个图标变红色
- 支持平滑过渡动画 (`transition-all`)

---

### 5. 🗺️ 地图/摄像头切换按钮

| 模式 | 图标 | 背景色 | 说明 |
|------|------|--------|------|
| 地图模式 | Camera | 🟢 绿色 (bg-green-600) | 点击切换回摄像头 |
| 摄像头模式 | Map | ⚪ 半透明白色 (bg-white/10) | 点击切换到地图 |

**代码实现:**
```typescript
<button
  className={`p-2 rounded-full transition-colors ${
    isMapMode
      ? 'bg-green-600 hover:bg-green-700'
      : 'bg-white/10 hover:bg-white/20'
  }`}
>
  {isMapMode ? (
    <Camera className="w-4 h-4 text-white" />
  ) : (
    <Map className="w-4 h-4 text-white" />
  )}
</button>
```

---

## 🎯 测试场景

### 场景1：正常运行
```typescript
const status = {
  state: "running",
  diagnosticStatus: "normal",
  speed: 1.5,
  battery: 85
};
```
**效果:**
- 运行状态: 🟢 绿色 Activity + "运行"
- 诊断状态: 🟢 绿色 AlertCircle + "正常"
- 速度: 🟡 黄色 Zap + "1.5 m/s"
- 电量: 🟢 绿色 Battery + 85% 填充条

---

### 场景2：低电量警告
```typescript
const status = {
  state: "standby",
  diagnosticStatus: "warning",
  speed: 0,
  battery: 15
};
```
**效果:**
- 运行状态: 🔵 蓝色 Activity + "待机"
- 诊断状态: 🟡 黄色 AlertCircle + "警告"
- 速度: ⚪ 半透明 Zap + "0.0 m/s"
- 电量: 🔴 红色 Battery + 15% 填充条

---

### 场景3：错误状态
```typescript
const status = {
  state: "error",
  diagnosticStatus: "error",
  speed: 0,
  battery: 50
};
```
**效果:**
- 运行状态: 🔴 红色 AlertOctagon + "错误"
- 诊断状态: 🔴 红色 AlertCircle + "故障"
- 速度: ⚪ 半透明 Zap + "0.0 m/s"
- 电量: 🟢 绿色 Battery + 50% 填充条

---

## 📋 图标库引用

所有图标来自 **lucide-react** 包：

```typescript
import {
  Activity,        // 运行状态
  AlertCircle,     // 诊断状态
  AlertOctagon,    // 错误状态
  Zap,            // 速度
  Battery,        // 电量
  Camera,         // 摄像头
  Map,            // 地图
  Settings,       // 设置
  SwitchCamera,   // 切换摄像头
  Hand,           // 急停
  X,              // 退出
} from "lucide-react";
```

---

## 🔄 实时更新机制

### WebSocket数据推送示例
```typescript
const ws = new WebSocket('ws://192.168.144.3:9090');

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  
  if (message.type === 'telemetry') {
    setRobotStatus({
      state: message.state,              // "standby" | "running" | "error"
      diagnosticStatus: message.diagnostic, // "normal" | "warning" | "error"
      speed: message.speed,               // 实时速度 (m/s)
      battery: message.battery,           // 实时电量 (0-100)
    });
  }
};
```

### 图标自动更新
当通过 `setRobotStatus` 更新状态时，所有图标会**自动响应**：
- 颜色立即变化
- 文字同步更新
- 填充条平滑过渡
- 无需手动刷新

---

## ✅ 总结

### 动态图标统计
| 图标类型 | 变化状态数 | 颜色数 | 实时更新 |
|---------|-----------|-------|---------|
| 运行状态 | 3种 | 3色 | ✅ |
| 诊断状态 | 3种 | 3色 | ✅ |
| 速度显示 | 2种 | 2色 | ✅ |
| 电量显示 | 2种 | 2色 + 动态填充 | ✅ |
| 地图切换 | 2种 | 2色 | ✅ |

### 特点
✅ 所有图标都有对应的状态变化  
✅ 颜色符合直觉（绿=正常，黄=警告，红=错误/低电）  
✅ 支持实时数据驱动更新  
✅ 平滑的过渡动画效果  
✅ 完全可通过Props控制

---

**文档版本**: V1.0  
**更新日期**: 2026-03-24  
**验证状态**: ✅ 已验证
