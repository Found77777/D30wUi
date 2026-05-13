# React WebView Android CI Build

本项目提供 GitHub Actions workflow：
- `.github/workflows/android-webview-build.yml`
- 名称：`React WebView Android Build`

## 构建流程
1. 使用 Node.js 20
2. 执行 `npm install`
3. 执行 `npm run build` 生成 React/Vite `dist/`
4. 清空并重建 `android-webview-app/app/src/main/assets/webapp/`
5. 将 `dist/` 全量复制到 `assets/webapp/`
6. 使用 JDK 17 + Gradle 8.7（wrapperless）
7. 执行：
   - `gradle -p android-webview-app tasks --no-daemon`
   - `gradle -p android-webview-app assembleDebug --no-daemon`
8. 上传 APK artifact

## Artifact 下载
- 名称：`d30wui-webview-debug-apk`
- 在 GitHub Actions 的对应运行页面下载。

## 安全说明（第一阶段）
- APK 采用 **React WebView + Android Bridge** 方案。
- 第一阶段仅使用 `MockRobotSdkAdapter`。
- 不接入真实机器人 SDK，不会控制真实机器人。
