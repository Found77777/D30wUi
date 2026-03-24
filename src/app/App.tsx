import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RouterProvider, useNavigate } from "react-router";
import { router } from "./routes";
import { Joystick } from "./components/Joystick";
import { ModeGroup } from "./components/ModeGroup";
import { VerticalActionPicker } from "./components/VerticalActionPicker";
import { SettingsPanel } from "./components/SettingsPanel";
import { MapOverlay } from "./components/MapOverlay";
import { CameraStream } from "./components/CameraStream";
import { MapBackground } from "./components/MapBackground";
import { ExitConfirmModal } from "./components/ExitConfirmModal";
import {
  Settings,
  SwitchCamera,
  Camera,
  Activity,
  AlertCircle,
  Map,
  AlertOctagon,
  Zap,
  Battery,
  Hand,
  X,
} from "lucide-react";
import {
  RobotControlProps,
  RobotStatus,
  MovementCommand,
  DirectionCommand,
  PREDEFINED_ACTIONS,
  CameraStatus,
} from "./types/robot-interfaces";

// ============================================
// 主应用组件
// ============================================

// 导出一个带Router的默认组件
export default function AppWithRouter(props: RobotControlProps = {}) {
  return <RouterProvider router={router} />;
}

// 导出原始的App组件（用于路由内部）
export function MainApp(props: RobotControlProps = {}) {
  const navigate = useNavigate();
  const [speedMode, setSpeedMode] = useState(1);
  const [movementMode, setMovementMode] = useState(1);
  const [cameraPosition, setCameraPosition] = useState<
    "front" | "back"
  >("front");
  const [postureMode, setPostureMode] = useState<
    "standing" | "crawling"
  >("standing");
  const [selectedAction, setSelectedAction] =
    useState("标准站立");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [isMapMode, setIsMapMode] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  // 默认状态值
  const defaultStatus: RobotStatus = {
    battery: 73,
    speed: 0.0,
    state: "standby",
    diagnosticStatus: "normal",
    diagnosticMessage: "正常",
  };

  // 合并传入的状态和默认值
  const robotStatus: RobotStatus = { ...defaultStatus, ...props.status };

  const actions = [
    { id: "standard", name: "标准站立", icon: "🤖" },
    { id: "low-walk", name: "低姿态行走", icon: "🦎" },
    { id: "stable", name: "稳定支撑", icon: "🏔️" },
    { id: "ground", name: "贴地模式", icon: "🐍" },
    { id: "obstacle", name: "越障模式", icon: "🪜" },
  ];

  const handleLeftJoystick = (x: number, y: number) => {
    const command: MovementCommand = {
      x,
      y,
      timestamp: Date.now(),
    };
    props.onMovement?.(command);
  };

  const handleRightJoystick = (x: number, y: number) => {
    const command: DirectionCommand = {
      x,
      y,
      timestamp: Date.now(),
    };
    props.onDirection?.(command);
  };

  const toggleCamera = () => {
    const next = cameraPosition === "front" ? "back" : "front";
    setCameraPosition(next);
    props.onCameraSwitch?.(next);
  };

  const handleActionSelect = (action: (typeof actions)[0]) => {
    setSelectedAction(action.name);
    const actionCommand = PREDEFINED_ACTIONS.find(a => a.id === action.id);
    if (actionCommand) {
      props.onActionSelect?.(actionCommand);
    }
  };

  return (
    <>
    <div className="w-screen h-screen bg-gray-800 flex items-center justify-center p-4">
      {/* Phone Preview Frame */}
      <div className="relative bg-black rounded-2xl shadow-2xl overflow-hidden" style={{ width: '854px', height: '480px' }}>
        {/* Screen Notch/Camera Cutout (optional) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gray-800 rounded-b-lg z-50" />
        
        {/* Main App Content */}
        <div className="relative w-full h-full bg-black overflow-hidden select-none">
      {/* Layer 1: Background (Camera or Map) */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          {!isMapMode ? (
            <motion.div
              key="camera"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <CameraStream 
                cameraStatus={props.cameraStatus}
                onStreamError={(error) => {
                  console.error('Camera stream error:', error);
                }}
                onStreamConnected={() => {
                  console.log('Camera stream connected');
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="map"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              <MapBackground mapData={props.mapData} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Layer 2: Top Status Bar */}
      <div className="absolute top-0 left-0 right-0 bg-black/50 backdrop-blur-md px-4 py-2 flex items-center justify-between border-b border-white/10">
        {/* Left section */}
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <Settings className="w-4 h-4 text-white" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleCamera}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <SwitchCamera className="w-4 h-4 text-white" />
          </motion.button>
        </div>

        {/* Center section */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-white/10 rounded-lg">
            <Camera className="w-3 h-3 text-white" />
            <span className="text-xs text-white">
              {cameraPosition === "front"
                ? "前"
                : "后"}
            </span>
          </div>

          {/* 运行状态 - 图标根据state动态变化 */}
          <div className="flex items-center gap-1.5 px-2 py-1 bg-white/10 rounded-lg">
            {robotStatus.state === "standby" ? (
              <Activity className="w-3 h-3 text-blue-400" />
            ) : robotStatus.state === "running" ? (
              <Activity className="w-3 h-3 text-green-500" />
            ) : (
              <AlertOctagon className="w-3 h-3 text-red-500" />
            )}
            <span className="text-xs text-white">
              {robotStatus.state === "standby"
                ? "待机"
                : robotStatus.state === "running"
                  ? "运行"
                  : "错误"}</span>
          </div>

          {/* 诊断状态 - 图标根据diagnosticStatus动态变化 */}
          <div className="flex items-center gap-1.5 px-2 py-1 bg-white/10 rounded-lg">
            <AlertCircle
              className={`w-3 h-3 ${
                robotStatus.diagnosticStatus === "normal"
                  ? "text-green-500"
                  : robotStatus.diagnosticStatus === "warning"
                    ? "text-yellow-500"
                    : "text-red-500"
              }`}
            />
            <span className="text-xs text-white">
              {robotStatus.diagnosticStatus === "normal"
                ? "正常"
                : robotStatus.diagnosticStatus === "warning"
                  ? "警告"
                  : "故障"}
            </span>
          </div>

          {/* 速度显示 - 添加Zap图标，速度>0时高亮 */}
          <div className="flex items-center gap-1.5 px-2 py-1 bg-white/10 rounded-lg">
            <Zap 
              className={`w-3 h-3 ${
                robotStatus.speed > 0 
                  ? "text-yellow-400" 
                  : "text-white/50"
              }`}
            />
            <span className="text-xs text-white">
              {(robotStatus?.speed ?? 0).toFixed(1)} m/s
            </span>
          </div>

          <div className="px-2 py-1 bg-white/10 rounded-lg">
            <span className="text-xs text-white">
              {selectedAction}
            </span>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Map/Camera Toggle Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMapMode(!isMapMode)}
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
          </motion.button>
          
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-white">
              {robotStatus.battery}%
            </span>
            <div className="relative">
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
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-red-600 hover:bg-red-700 transition-colors relative"
            onClick={() => {
              console.log('🚨 紧急停止触发');
              props.onEmergencyStop?.();
            }}
            title="急停"
          >
            <div className="relative">
              <Hand className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            onClick={() => setIsExitModalOpen(true)}
          >
            <X className="w-3 h-3 text-white" />
          </motion.button>
        </div>
      </div>

      {/* Layer 3a: Mode Control Row */}
      <div className="absolute top-12 left-0 right-0 px-4 flex items-center justify-between">
        <ModeGroup
          title="速度"
          options={["慢速", "标准", "快速"]}
          activeIndex={speedMode}
          onChange={(index) => {
            setSpeedMode(index);
            props.onSpeedModeChange?.(index as 0 | 1 | 2);
          }}
        />

        <ModeGroup
          title="运动模式"
          options={["轻松", "标准", "稳定"]}
          activeIndex={movementMode}
          onChange={(index) => {
            setMovementMode(index);
            props.onMovementModeChange?.(index as 0 | 1 | 2);
          }}
        />
      </div>

      {/* Layer 3b: Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="relative w-full flex items-end justify-between px-12 pb-6">
          {/* Left Section - Movement Joystick */}
          <div className="flex flex-col items-center gap-1 mb-4">
            <Joystick
              size={130}
              onChange={handleLeftJoystick}
            />
            <span className="text-[10px] text-white/60">
              移动
            </span>
          </div>

          {/* Center Section */}
          <div className="flex items-end gap-8">
            {/* Posture Controls */}
            <div className="flex flex-col gap-2 pb-1">
              <div className="text-[10px] text-white/60 mb-0.5 tracking-wider text-center">
                体态
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setPostureMode("standing");
                  props.onPostureChange?.("standing");
                }}
                className={`
                  px-4 py-2 rounded-lg text-xs transition-all border
                  ${
                    postureMode === "standing"
                      ? "bg-white text-black border-white"
                      : "bg-black/40 text-white/70 border-white/20 hover:bg-black/60"
                  }
                `}
              >
                站立
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setPostureMode("crawling");
                  props.onPostureChange?.("crawling");
                }}
                className={`
                  px-4 py-2 rounded-lg text-xs transition-all border
                  ${
                    postureMode === "crawling"
                      ? "bg-white text-black border-white"
                      : "bg-black/40 text-white/70 border-white/20 hover:bg-black/60"
                  }
                `}
              >
                匍匐
              </motion.button>
            </div>

            {/* Action Picker */}
            <div className="flex items-end pb-1">
              <VerticalActionPicker
                actions={actions}
                onSelect={handleActionSelect}
              />
            </div>
          </div>

          {/* Right Section - Direction Joystick */}
          <div className="flex flex-col items-center gap-1 mb-4">
            <Joystick
              size={130}
              onChange={handleRightJoystick}
            />
            <span className="text-[10px] text-white/60">
              方向
            </span>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onMapToggle={setIsMapVisible}
        onAIAssistToggle={props.onAIAssistToggle}
        onAutoCharge={props.onAutoCharge}
        onAutoUndock={props.onAutoUndock}
        onFollowModeClick={() => navigate('/follow-mode')}
        onSDKToggle={props.onSDKToggle}
        onGimbalEnable={props.onGimbalEnable}
        onMapNavigation={props.onMapNavigation}
        onOfflineMapManage={props.onOfflineMapManage}
        onProductInfoUpdate={props.onProductInfoUpdate}
        productInfo={props.productInfo}
      />

      {/* Map Overlay */}
      <MapOverlay 
        isVisible={isMapVisible}
        isMapMode={isMapMode}
        onToggleMapMode={() => setIsMapMode(!isMapMode)}
        mapData={props.mapData}
        onMapUpdate={props.onMapUpdate}
      />
    </div>
    </div>
    </div>
    <ExitConfirmModal
      isOpen={isExitModalOpen}
      onClose={() => setIsExitModalOpen(false)}
      onConfirm={() => {
        setIsExitModalOpen(false);
        props.onExit?.();
      }}
    />
    </>
  );
}