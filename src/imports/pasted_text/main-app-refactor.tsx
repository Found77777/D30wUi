请直接修改当前代码，目标是：减少写死数据，避免 UI 在未接入真实数据时“假装正常”。

--------------------------------
一、修改目标
--------------------------------

当前代码整体结构保留不变，只做以下优化：

1. 不要把默认状态写成“正常运行中”的假数据
2. 保留 props.status 覆盖默认值的机制
3. UI 显示时继续保持安全兜底
4. 不改动现有页面布局和交互逻辑

--------------------------------
二、需要修改的具体内容
--------------------------------

【1】修改 MainApp 中 defaultStatus

当前问题：
defaultStatus 里写死了：
- battery: 73
- speed: 0.0
- state: "standby"
- diagnosticStatus: "normal"
- diagnosticMessage: "正常"

这会导致在没有真实数据时，界面看起来像“设备正常在线”，不符合产品逻辑。

请改为更真实的“未连接/未知”默认状态，例如：

- battery: 0
- speed: 0
- state: "idle" 或保留现有类型允许的默认空闲状态
- diagnosticStatus: "unknown"（如果类型不支持，就扩展类型）
- diagnosticMessage: "未连接"

如果当前 RobotStatus 类型不支持 "unknown" 或 "idle"，请同步修改类型定义，确保代码类型正确。

--------------------------------

【2】保留默认值与 props.status 合并逻辑

请保留这种模式：

const robotStatus = { ...defaultStatus, ...props.status };

不要改回 props.status || defaultStatus 的写法。

--------------------------------

【3】所有状态显示增加安全兜底

请检查以下字段显示是否有 undefined 风险，并补充兜底：

- speed
- battery
- state
- diagnosticStatus
- diagnosticMessage

例如：
- speed 显示用 (robotStatus.speed ?? 0).toFixed(1)
- battery 显示用 robotStatus.battery ?? 0

确保不会因为 props.status 字段不完整而报错。

--------------------------------

【4】动作列表不要彻底写死在组件内部

当前 actions 数组写在 MainApp 里。

请改成：
- 优先使用 props.actions（如果有）
- 没传时再用默认动作列表

例如：
const actions = props.actions ?? DEFAULT_ACTIONS

如果当前接口里没有 actions 字段，请补充到 RobotControlProps 类型中。

--------------------------------

【5】相机默认值也改成可配置

当前 cameraPosition 默认写死为 "front"

请改为：
- 优先使用 props.defaultCamera
- 没传时再默认 "front"

如果 RobotControlProps 中没有 defaultCamera，请补充类型。

--------------------------------

【6】体态默认值也改成可配置

当前 postureMode 默认写死为 "standing"

请改为：
- 优先使用 props.defaultPosture
- 没传时再默认 "standing"

如果 RobotControlProps 中没有 defaultPosture，请补充类型。

--------------------------------
三、不要修改的内容
--------------------------------

以下内容不要改：
- 页面布局
- 路由结构
- 组件引用关系
- SettingsPanel / MapOverlay / ExitConfirmModal 交互逻辑
- 主界面视觉样式

--------------------------------
四、输出要求
--------------------------------

请直接修改代码，并确保：
- TypeScript 无报错
- 现有页面可正常运行
- 所有新增字段类型定义完整
- 不引入新的运行时错误