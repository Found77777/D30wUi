# 01 页面清单（Page Map）

> 基于当前 React 原型代码整理；本文件不引入 Android 代码实现，仅给出迁移映射建议。

## 页面总览

| 页面名称 | 页面目的 | React 文件 | 未来 Compose Screen 文件名（建议） |
|---|---|---|---|
| 主控制页 | 实时遥控机器人：移动、方向、模式切换、动作选择、状态监控、急停 | `src/app/App.tsx`（`MainApp`） | `MainControlScreen.kt` |
| 跟随模式页 | 配置并启动/停止自动跟随，调参并查看跟随状态 | `src/app/pages/FollowModePage.tsx` | `FollowModeScreen.kt` |

---

## 1) 主控制页（MainApp）

- **页面名称**：主控制页
- **页面目的**：作为机器人实时控制中枢，提供双摇杆控制、速度/运动模式切换、体态切换、动作选择、摄像头与地图显示切换、设置入口、急停与退出。
- **当前 React 文件位置**：`src/app/App.tsx` 中 `MainApp`。
- **用户入口**：路由 `/`（`src/app/routes.tsx`）。
- **用户可执行操作**：
  - 左摇杆发送移动向量（`onMovement`）。
  - 右摇杆发送方向向量（`onDirection`）。
  - 切换前/后摄像头（`onCameraSwitch`）。
  - 切换速度模式（`onSpeedModeChange`）。
  - 切换运动模式（`onMovementModeChange`）。
  - 切换体态（`onPostureChange`）。
  - 选择动作（`onActionSelect`）。
  - 打开设置侧栏（`SettingsPanel`）。
  - 切换地图/摄像头背景模式（本地状态 `isMapMode`）。
  - 触发急停（`onEmergencyStop`）。
  - 打开退出确认弹窗并退出（`onExit`）。
- **页面跳转去向**：
  - 通过设置面板中的“跟随模式”跳转至 `/follow-mode`。
- **页面需要展示的数据**：
  - 机器人状态 `RobotStatus`：电量、速度、运行状态、诊断状态。
  - 摄像头状态 `CameraStatus`：位置、连接、流参数。
  - 地图数据 `MapData`：位置、朝向、路径等。
  - 当前选中动作、速度模式、运动模式、体态模式。
- **异常状态**：
  - 摄像头断流/连接失败（`CameraStream` 内显示 error/disconnected）。
  - 机器人状态异常（`state=error`）和诊断故障（`diagnosticStatus=error`）仅展示，未限制操作。
  - 地图数据缺失时以默认值展示（坐标回退 0）。
- **安全限制（现状与建议）**：
  - 现状：急停可直接触发，符合高优先级安全动作要求。
  - 现状缺失：未对“未连接/控制权丢失/低电量/诊断故障”做命令禁发。
  - **建议增加**：在控制命令发送前增加统一 `canSendControl` 判定。
- **对应未来 Android Compose Screen 文件名**：`MainControlScreen.kt`。

---

## 2) 跟随模式页（FollowModePage）

- **页面名称**：跟随模式页
- **页面目的**：配置跟随模式（手动/自动）、跟随距离、跟随速度，并启动/停止跟随。
- **当前 React 文件位置**：`src/app/pages/FollowModePage.tsx`。
- **用户入口**：主控制页 → 设置面板 → “跟随模式”。
- **用户可执行操作**：
  - 切换模式（manual/auto）。
  - 调整跟随距离（0.5m~5m）。
  - 切换跟随速度（slow/medium/fast）。
  - 开始跟随（仅 auto 可点）。
  - 停止跟随（仅 following 可点）。
  - 返回主控制页。
- **页面跳转去向**：返回 `/`。
- **页面需要展示的数据**：
  - `followMode`、`followStatus`、`followDistance`、`followSpeed`。
- **异常状态**：
  - 当前仅本地状态与 TODO 注释，未处理 API 失败细节 UI。
  - “目标丢失”状态类型已定义，但当前仅依赖本地状态切换，未接实时事件。
- **安全限制（现状与建议）**：
  - 现状：通过按钮 `disabled` 控制避免非法点击。
  - **建议增加**：若主连接断开或控制权丢失，强制停止跟随并弹提示。
- **对应未来 Android Compose Screen 文件名**：`FollowModeScreen.kt`。

---

## 重点识别结论

### A. 设置面板：独立页面还是 BottomSheet？

- 当前是**左侧滑入面板**（桌面横屏原型）并包含多模块与表单编辑。
- Android 迁移建议：
  - 主控制场景下，优先用 **ModalBottomSheet + 分段 Tab 内容**（基础功能 / 地图与任务）。
  - 若后续配置项继续膨胀（含大量表单校验、日志、权限说明），再升级为独立 `SettingsScreen`。
- 结论：**第一阶段建议 BottomSheet；信息架构保持可升维为独立页面。**

### B. 地图/摄像头：内部模式还是独立页面？

- 当前代码已经表达为主控制页内的**背景模式切换**（`isMapMode`）+ 可选地图浮层（`isMapVisible`）。
- 控制场景下需要“低切换成本 + 持续可控摇杆”的体验。
- 结论：
  - **主路径**：保留为主控制页内部模式切换（Camera/Map）。
  - **补充路径**：可新增“全屏地图导航页”用于航点任务编辑（非实时手动驾驶主路径）。
