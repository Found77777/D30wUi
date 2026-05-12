# 07 架构一致性审查（Architecture Review）

> 审查基线：`docs/01~06` 与当前 React 原型（`src/app/**`）保持一致性。

## Critical Issues

1. **状态域与页面/组件映射不完整（高优先级）**
   - `docs/03` 已提出连接状态、控制权状态、急停状态，但 `docs/01/02/04` 中尚未形成“每个命令都必须引用门禁状态”的闭环。
   - 结果：会出现“有状态定义、无统一执行约束”。

2. **组件存在但缺少对应状态机（高优先级）**
   - `SettingsPanel` 中 `autoCharge/autoUndock/SDK/gimbal/mapNavigation` 属于危险或半危险动作，但文档未明确 `pending/success/failure` 三态。
   - `MapOverlay` / `MapBackground` 使用地图数据，但缺少 `mapDataValidity` 或 `mapSyncState`。
   - `ExitConfirmModal` 仅有显隐态，未定义“退出后控制权释放/会话终止”状态。

3. **状态存在但 UI 呈现未标准化（中高优先级）**
   - `isConnected`、`connectionQuality` 在接口定义存在，但主控制页面尚无统一可见 UI（只在审查建议中提到）。
   - `controlAuthority`（建议态）未对应任何 UI 元素（如“已接管/可控”标识）。
   - `estopState`（建议态）未对应全局锁控 Banner/UI。

4. **控制命令与安全门禁未一一绑定（高优先级）**
   - `onMovement`、`onDirection`、`onPostureChange`、`onActionSelect`、`onSpeedModeChange` 在 `docs/04` 有接口映射，但未逐条标注 `gate conditions`。
   - 结果：命令层容易出现“局部门禁不一致”。

5. **危险操作二次确认策略仍有空白（高优先级）**
   - `onMapNavigation`、`onSDKToggle`、`onAutoUndock`、`onAutoCharge` 已建议确认，但未定义“何时弹窗/何时直接执行”的规则矩阵（例如电量低/诊断warning时）。

6. **React 原型已存在功能在迁移计划中粒度不足（中优先级）**
   - 跟随页中的 `target-lost` 状态与按钮禁用策略在 `docs/06` 提及不够具体。
   - `CameraStream` 多流类型（webrtc/hls/mjpeg/默认video）在迁移计划有方向，但缺少“首期只支持哪一种”的冻结定义。

7. **MVP 冻结边界尚未显式定义（高优先级）**
   - `docs/06` 有阶段划分，但没有“第一阶段必须交付/明确不交付”列表，影响研发排期和验收。

---

## Recommended Fixes

1. **建立统一“命令门禁矩阵”**（建议新增到后续文档版本）
   - 每条命令绑定统一前置：
     - `connected == true`
     - `authority == granted`
     - `estopState != Triggered`
     - `robotState != error`
     - `diagnostic != error`（warning 限制高风险）
     - `battery > threshold`（低电禁止高速/高风险）
   - 输出形态：`CommandGuardPolicy` 表（命令 x 条件 x 失败文案 x 回滚策略）。

2. **为危险命令补齐异步状态机**
   - `Idle -> Pending -> Success/Failure`：
     - `autoCharge/autoUndock`
     - `sdkToggle`
     - `gimbalEnable`
     - `mapNavigation`
     - `follow.start/stop`
   - 失败时必须定义 UI 回滚。

3. **补齐状态到 UI 的可见性映射**
   - 新增统一状态条：连接质量、控制权、急停锁控、诊断级别。
   - 将“建议状态”落实到可见组件（即使 MVP 为 mock 数据）。

4. **完善二次确认规则矩阵**
   - 急停：永不确认，立即执行。
   - 退出：始终确认。
   - 风险操作：按条件确认（例如首次触发、warning/error、低电量）。

5. **迁移计划增加“能力冻结表”**
   - 第一阶段只做 UI+状态+mock 命令闭环。
   - 第二阶段再开放 SDK/WS 真连接。

---

## MVP Scope

> Android 第一阶段 MVP（冻结范围，建议）

1. **页面范围（保留）**
   - 主控制页（含双摇杆、模式组、动作选择、状态显示、急停、退出确认）。
   - 跟随模式页（mode/distance/speed/start-stop/status）。

2. **组件范围（保留）**
   - `Joystick`、`ModeGroup`、`VerticalActionPicker`、`SettingsPanel`（精简版）、`ExitConfirmModal`。
   - `CameraStream` 与 `MapBackground/MapOverlay` 仅做 mock 展示。

3. **状态范围（保留）**
   - `MainControlUiState`：speed/movement/posture/camera/mapMode/selectedAction/status chips。
   - `FollowUiState`：mode/status/distance/speed。
   - `SafetyUiState`：connected/authority/estop/diagnostic/battery gate。

4. **命令范围（mock）**
   - `onMovement/onDirection/onEmergencyStop/onSpeedModeChange/onMovementModeChange/onPostureChange/onActionSelect`。
   - `follow.start/stop/updateConfig` 仅本地模拟 ACK。

5. **安全范围（必须）**
   - 急停立即生效。
   - 命令门禁可运行（即使数据是 mock）。
   - 危险操作确认弹窗可运行。

---

## Deferred Scope

1. **必须等待真实接口明确后再做**
   - 实际底盘控制协议（movement/direction 的频率、ACK、重试策略）。
   - 控制权仲裁协议（多人/多端接管规则）。
   - 急停复位流程（谁可复位、复位条件、超时策略）。
   - 跟随模式真实能力（目标识别源、target-lost 事件上报码）。
   - 视频流最终协议（优先 WebRTC 还是 RTSP/HLS 网关）。
   - 地图数据结构（坐标系、精度、航点/障碍物语义）。

2. **建议后置到第二阶段**
   - 离线地图管理全流程。
   - 建图导航真实任务编排。
   - SDK 开关真实行为与权限隔离。
   - 产品信息远程同步/校验规则。

---

## Product Decisions Needed

1. **设置形态确认**
   - 第一阶段是否固定为 BottomSheet（推荐）还是保留独立设置页入口。

2. **地图与摄像头主视图策略**
   - 是否坚持“主控制页内部模式切换”为唯一主路径；是否允许独立全屏地图导航页。

3. **危险操作确认策略**
   - 以下操作是否“始终确认”还是“条件确认”：
     - 自动充电
     - 自动出桩
     - SDK 开关
     - 建图导航
     - 云台控制

4. **低电量与诊断限制阈值**
   - 低电阈值（如 15%）是否冻结。
   - `diagnostic=warning` 是否限速或仅提示。

5. **控制权产品规则**
   - 控制权是否需要显式申请。
   - 控制权丢失后是否自动回中并停止跟随。

6. **视频流首期支持范围**
   - MVP 是否只支持一种流协议（建议单协议先行），其余显示“暂不支持”。

7. **第一阶段验收标准**
   - 是否以“UI一致 + 状态门禁正确 + mock ACK 可演示”为验收条件。
