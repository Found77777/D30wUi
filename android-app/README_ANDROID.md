# Android Mock 工程说明

这是从 React/Figma Make 机器人控制原型迁移出来的 **Android 第一阶段 mock 工程**。

## 如何打开
1. 打开 Android Studio
2. 选择 `Open`
3. 选择目录 `android-app/`
4. 等待 Gradle Sync

## 第一阶段已实现
- Kotlin + Jetpack Compose + MVVM + Navigation Compose + StateFlow
- 页面：`MainControlScreen`、`FollowModeScreen`
- 组件：`SettingsSheet`、`MapOverlay`、`ExitConfirmDialog` 等
- 所有命令进入 `MockRobotCommandRepository`
- 命令日志字段：`commandType/payload/timestamp/result/reason`
- 安全门禁（mock）：
  - 急停始终可点
  - 未连接禁发普通命令
  - 诊断故障禁发普通命令
  - 电量<20 禁止快速模式和越障模式

## 待接入真实接口
- 真实机器人 SDK
- 真实后端 API
- 真实 WebSocket/MQTT
- 真实视频流

## 安全声明
当前工程不会控制真实机器人，仅用于 UI、状态机和交互流程验证。
