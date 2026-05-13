# React/Figma Make 视觉素材来源清单

> 扫描范围：`src/` 下 React 代码与样式文件（不含 `node_modules`）。

## 1) 使用到的 lucide-react 图标

按代码扫描结果（`import { ... } from "lucide-react"`）汇总，当前项目使用了以下图标名：

- Activity
- AlertCircle
- AlertOctagon
- AlertTriangle
- ArrowLeft
- ArrowRight
- Battery
- Camera
- CheckIcon
- ChevronDown
- ChevronDownIcon
- ChevronLeft
- ChevronLeftIcon
- ChevronRight
- ChevronRightIcon
- ChevronUpIcon
- CircleIcon
- FolderOpen
- Gauge
- GripVerticalIcon
- Hand
- Info
- Map
- MapPin
- Maximize2
- Minimize2
- MinusIcon
- Monitor
- MoreHorizontal
- MoreHorizontalIcon
- Navigation
- PanelLeftIcon
- Play
- Radio
- SearchIcon
- Server
- Settings
- Square
- SwitchCamera
- Target
- Users
- Video
- WifiOff
- X
- XIcon
- Zap
- ZoomIn
- ZoomOut

说明：以上包含业务页面与 `src/app/components/ui/*` 组件中的图标引用。

---

## 2) 使用到的 MUI icons

- 未发现 `@mui/icons-material` 的实际 import 引用。
- 结论：**当前 React 代码未使用 MUI icons**。

---

## 3) 是否存在 inline svg

- **存在**。
- 主要位置：
  - `src/app/components/MapOverlay.tsx`：使用 `<svg>` 直接绘制路径/轨迹。
  - `src/app/components/MapBackground.tsx`：使用 `<svg>` 直接绘制地图点位与连线。
  - `src/app/components/figma/ImageWithFallback.tsx`：内置 `data:image/svg+xml;base64,...` 作为图片加载失败占位图。

---

## 4) 是否存在本地图片 assets

- 扫描结果：仓库内未发现被 React 代码直接引用的本地图片文件（如 `.png/.jpg/.svg/.webp`）。
- `CameraStream` 中 `<img>` 用于加载外部流地址（如 MJPEG URL），不是本地静态素材。
- 结论：**当前 UI 基本无本地图片资产依赖**。

---

## 5) 哪些按钮/背景是 CSS 生成

以下视觉元素由 CSS / Tailwind 类 / inline style 直接生成，而非图片素材：

### 背景类
- 主界面与卡片背景：大量使用纯色、透明度、圆角、边框、阴影（如 `bg-black/90`、`bg-white/10`、`rounded-*`、`shadow-*`）。
- 毛玻璃效果：`backdrop-blur-*`。
- 地图网格背景：
  - `MapOverlay.tsx` 与 `MapBackground.tsx` 中使用 `linear-gradient` 叠加实现网格。
- 跟随页面滑条轨道填充：
  - `FollowModePage.tsx` 里使用动态 `linear-gradient(...)` 生成进度色带。
- 选择器遮罩：
  - `VerticalActionPicker.tsx` 使用 `bg-gradient-to-b` / `bg-gradient-to-t` 生成上下渐隐遮罩。

### 按钮类
- 普通按钮、状态按钮、开关按钮、确认按钮等几乎全部使用 Tailwind 原子类（颜色、边框、悬停态、禁用态）生成。
- 典型包括：
  - 顶部圆形 icon 按钮（设置、切换摄像头）；
  - 跟随模式开始/停止按钮；
  - 设置面板 Tab 按钮、折叠头部、功能入口按钮；
  - 退出确认弹窗按钮。

结论：**按钮与背景绝大多数是代码绘制（CSS 生成）**。

---

## 6) 哪些素材需要从 Figma Design 导出 SVG/PNG

基于当前代码结构，以下项目**如果希望严格还原品牌视觉**，可能需要从 Figma 导出：

1. **品牌级 Logo / 特殊插画 / 非标准图标**
   - 目前代码未见这类资产；若设计稿有，应导出（推荐 SVG）。
2. **复杂纹理背景或摄影内容**
   - 当前背景为 CSS 渐变与纯色；若 Figma 有真实纹理图或照片背景，需导出 PNG/WebP。
3. **产品/设备示意图（若设计稿存在）**
   - 当前未接入，后续若补充此类视觉，建议导出 SVG（矢量）或高分辨率 PNG。

当前仓库现状：**没有“必须立即导出”的显式图片缺口**，因为页面核心元素都已用代码实现或用 lucide 图标替代。

---

## 7) 哪些素材不需要导出，可以用代码复现

可继续用代码复现（无需导出图片）的素材：

- 所有 `lucide-react` 图标（直接组件化使用）。
- 纯色/透明/圆角/描边/阴影类容器与按钮。
- 毛玻璃背景（`backdrop-blur` + 半透明层）。
- 地图网格与简化几何图形（`linear-gradient` + inline `<svg>`）。
- 进度条/滑条的动态颜色填充（`linear-gradient`）。
- 开关、状态灯、警示圆形底托等基础几何 UI。

结论：当前项目属于“**代码生成视觉优先**”的实现风格，仅在引入品牌插画、照片、复杂定制图形时才需要 Figma 导出位图/矢量资源。
