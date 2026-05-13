# Android WebView Hybrid 方案

本目录新增 `android-webview-app/`，用于承载：

- React UI（WebView 加载本地 assets/index.html）
- Android JavaScript Bridge（`AndroidRobot`）
- Android SDK Adapter（第一阶段 `MockRobotSdkAdapter`）

## 第一阶段说明

- 使用 `MockRobotSdkAdapter`。
- 所有 Bridge 命令只写 Android Log。
- 不连接真实机器人。
- 不控制真实机器人。

## 如何接入真实 SDK（第二阶段）

1. 保持 Bridge 接口不变。
2. 将 `MockRobotSdkAdapter` 替换为 `RealRobotSdkAdapter`。
3. 在 `ControlGate/Throttle/Watchdog` 规则不变前提下，对接真实 SDK 实现。
4. 保留 `evaluateJavascript` 的状态/结果回传协议，确保前端无感升级。
