# Android CI Build（GitHub Actions）

本项目已配置云端 Android Debug 构建流程：
- Workflow 文件：`.github/workflows/android-debug-build.yml`
- Workflow 名称：`Android Debug Build`
- 采用 **wrapperless** 方式（CI 直接安装并使用 Gradle 8.7，不依赖 `./gradlew`）

## 如何手动触发构建
1. 打开 GitHub 仓库页面。
2. 进入 **Actions**。
3. 选择 **Android Debug Build**。
4. 点击 **Run workflow**（`workflow_dispatch`）。

## 如何查看 Build Log
1. 在 Actions 中点进某一次运行记录。
2. 查看 `build-debug` job。
3. 重点关注：
   - `Gradle tasks`
   - `Assemble Debug APK`

## 如何下载 APK Artifact
1. 构建成功后，在该次运行页面底部找到 **Artifacts**。
2. 下载 `d30wui-debug-apk`。
3. 解压后可获得 debug APK（路径来源：`android-app/app/build/outputs/apk/debug/*.apk`）。

## 安全说明
该 APK 是 **mock 控制台**，用于 UI/状态流/命令日志验证，**不会控制真实机器人**。

## CI 失败时优先排查
若 CI 失败，请先查看以下错误类别：
- Gradle 配置错误
- Kotlin 编译错误
- Compose 编译错误

建议优先从失败步骤日志中定位具体报错，再修复构建脚本或依赖版本。
