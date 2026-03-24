/**
 * 四足机器人控制接口定义
 * 这些接口用于连接真实的机器人控制系统
 */

// ============================================
// 机器人状态接口
// ============================================

export interface RobotStatus {
  battery: number; // 电池电量 0-100
  speed: number; // 当前速度 m/s
  state: "standby" | "running" | "error"; // 运行状态
  diagnosticStatus: "normal" | "warning" | "error"; // 诊断状态
  diagnosticMessage?: string; // 诊断消息
  temperature?: number; // 温度 °C
  voltage?: number; // 电压 V
}

// 产品信息接口
export interface ProductInfo {
  robotIP: string; // 机器人IP地址
  navIP: string; // 导航IP地址
  mapPath: string; // 地图路径
}

export interface CameraStatus {
  position: "front" | "back" | "side"; // 摄像头位置
  isActive: boolean; // 摄像头是否激活
  resolution?: string; // 分辨率
  fps?: number; // 帧率
  streamUrl?: string; // 视频流URL (RTSP, WebRTC等)
  streamType?: "webrtc" | "rtsp" | "hls" | "mjpeg"; // 流类型
}

// 视频流接口
export interface VideoStreamConfig {
  streamUrl: string; // 视频流地址
  streamType: "webrtc" | "rtsp" | "hls" | "mjpeg"; // 流类型
  autoPlay?: boolean; // 自动播放
  muted?: boolean; // 静音
  latency?: number; // 延迟（毫秒）
}

// ============================================
// 运动控制接口
// ============================================

export interface MovementCommand {
  x: number; // 左右方向 -1 到 1
  y: number; // 前后方向 -1 到 1
  timestamp: number; // 时间戳
}

export interface DirectionCommand {
  x: number; // 旋转方向 -1 到 1
  y: number; // 倾斜方向 -1 到 1（可选）
  timestamp: number; // 时间戳
}

// ============================================
// 模式控制接口
// ============================================

export type SpeedMode = 0 | 1 | 2; // 0=慢速, 1=标准, 2=快速
export type ControlMode = 0 | 1; // 0=手动, 1=自动跟随
export type MovementMode = 0 | 1 | 2; // 0=轻盈, 1=标准, 2=稳定
export type PostureMode = "standing" | "crawling" | "sitting"; // 体态模式

export interface ModeSettings {
  speedMode: SpeedMode;
  controlMode: ControlMode;
  movementMode: MovementMode;
  postureMode: PostureMode;
}

// ============================================
// 动作指令接口
// ============================================

export interface ActionCommand {
  id: string; // 动作ID
  name: string; // 动作名称
  parameters?: Record<string, any>; // 动作参数
  duration?: number; // 执行时长（毫秒）
}

export const PREDEFINED_ACTIONS: ActionCommand[] = [
  { id: "standard", name: "标准站立" },
  { id: "low-walk", name: "低姿态行走" },
  { id: "stable", name: "稳定支撑" },
  { id: "ground", name: "贴地模式" },
  { id: "obstacle", name: "越障模式" },
];

// ============================================
// 地图和导航接口
// ============================================

export interface MapData {
  robotPosition?: { x: number; y: number }; // 机器人位置
  robotHeading?: number; // 机器人朝向（角度）
  pathPoints?: Array<{ x: number; y: number }>; // 路径点
  obstacles?: Array<{ x: number; y: number; radius: number }>; // 障碍物
  boundaries?: Array<{ x: number; y: number }>; // 边界
  waypoints?: Array<{ x: number; y: number; label: string }>; // 航点
}

export interface NavigationCommand {
  targetX: number;
  targetY: number;
  speed?: number;
  avoidObstacles?: boolean;
}

// ============================================
// 跟随模式接口
// ============================================

export type FollowMode = "manual" | "auto";
export type FollowStatus = "idle" | "following" | "target-lost";
export type FollowSpeed = "slow" | "medium" | "fast";
export type TargetType = "person" | "device";

export interface FollowModeConfig {
  mode: FollowMode; // 跟随模式
  distance: number; // 跟随距离（米）
  speed: FollowSpeed; // 跟随速度
  targetType: TargetType; // 目标类型
}

export interface FollowModeCallbacks {
  onFollowModeStart?: (config: FollowModeConfig) => void; // 开始跟随
  onFollowModeStop?: () => void; // 停止跟随
  onFollowModeStatusChange?: (status: FollowStatus) => void; // 状态变更
  onFollowModeConfigChange?: (config: Partial<FollowModeConfig>) => void; // 配置变更
}

// ============================================
// 设置和配置接口
// ============================================

export interface RobotSettings {
  aiAssistEnabled: boolean; // AI辅助开关
  mapEnabled: boolean; // 地图功能开关
  autoChargeEnabled: boolean; // 自动充电开关
  maxSpeed?: number; // 最大速度限制
  obstacleAvoidance?: boolean; // 避障功能
  soundEnabled?: boolean; // 声音开关
}

// ============================================
// 主控制接口
// ============================================

export interface RobotControlCallbacks {
  // 系统控制
  onPowerToggle?: () => void; // 电源开关
  onEmergencyStop?: () => void; // 紧急停止
  onExit?: () => void; // 退出应用

  // 摄像头控制
  onCameraSwitch?: (position: "front" | "back") => void; // 切换摄像头
  onCameraToggle?: (enabled: boolean) => void; // 开关摄像头

  // 模式控制
  onSpeedModeChange?: (mode: SpeedMode) => void; // 速度模式变更
  onControlModeChange?: (mode: ControlMode) => void; // 控制方式变更
  onMovementModeChange?: (mode: MovementMode) => void; // 运动模式变更
  onPostureChange?: (posture: PostureMode) => void; // 体态变更

  // 运动控制
  onMovement?: (command: MovementCommand) => void; // 移动控制
  onDirection?: (command: DirectionCommand) => void; // 方向控制
  onFollowToggle?: (isFollowing: boolean) => void; // 跟随模式开关

  // 动作控制
  onActionSelect?: (action: ActionCommand) => void; // 选择动作
  onActionExecute?: (actionId: string) => void; // 执行动作

  // 地图和导航
  onMapUpdate?: (data: MapData) => void; // 地图数据更新
  onNavigationStart?: (command: NavigationCommand) => void; // 开始导航
  onNavigationStop?: () => void; // 停止导航

  // 设置
  onSettingsChange?: (settings: Partial<RobotSettings>) => void; // 设置变更
  onAIAssistToggle?: (enabled: boolean) => void; // AI辅助开关
  onMapToggle?: (enabled: boolean) => void; // 地图开关
  onAutoCharge?: () => void; // 自动充电
  onAutoUndock?: () => void; // 自动脱离充电
  onSDKToggle?: (enabled: boolean) => void; // SDK开关
  onGimbalEnable?: () => void; // 开启云台
  onMapNavigation?: () => void; // 建图导航
  onOfflineMapManage?: () => void; // 离线地图管理
  onProductInfoUpdate?: (info: { robotIP?: string; navIP?: string; mapPath?: string }) => void; // 产品信息更新
}

// ============================================
// 主应用Props
// ============================================

export interface RobotControlProps extends RobotControlCallbacks {
  // 初始状态
  status?: RobotStatus;
  cameraStatus?: CameraStatus;
  mapData?: MapData;
  settings?: RobotSettings;
  productInfo?: ProductInfo; // 产品信息（IP地址等）

  // 连接状态
  isConnected?: boolean;
  connectionQuality?: "excellent" | "good" | "poor" | "disconnected";
}

// ============================================
// WebSocket消息接口（用于实时通信）
// ============================================

export interface WebSocketMessage {
  type: "command" | "status" | "telemetry" | "error";
  timestamp: number;
  data: any;
}

export interface TelemetryData {
  battery: number;
  speed: number;
  position: { x: number; y: number };
  heading: number;
  temperature: number;
  voltage: number;
}

// ============================================
// 使用示例
// ============================================

/*
// 示例 1: 基本使用 - 不带视频流
// ============================================

import App from './app/App';

const robotCallbacks: RobotControlCallbacks = {
  onMovement: (command) => {
    console.log('移动命令:', command);
    // 发送移动指令到机器人
    // websocket.send({ type: 'move', data: command });
  },
  
  onActionSelect: (action) => {
    console.log('选择动作:', action);
    // 发送动作指令
    // robotAPI.executeAction(action.id, action.parameters);
  },
  
  onPowerToggle: () => {
    console.log('电源切换');
    // 控制电源
  }
};

<App {...robotCallbacks} />


// 示例 2: 带状态更新的完整应用
// ============================================

import { useState, useEffect } from 'react';
import App from './app/App';
import { RobotStatus, MapData, CameraStatus } from './app/types/robot-interfaces';

function RobotControlApp() {
  const [robotStatus, setRobotStatus] = useState<RobotStatus>({
    battery: 85,
    speed: 0,
    state: 'standby',
    diagnosticStatus: 'normal',
    temperature: 35,
    voltage: 24.5,
  });

  const [mapData, setMapData] = useState<MapData>({
    robotPosition: { x: 0, y: 0 },
    robotHeading: 0,
    pathPoints: [],
    obstacles: [],
  });

  const [cameraStatus, setCameraStatus] = useState<CameraStatus>({
    position: 'front',
    isActive: true,
    resolution: '1920x1080',
    fps: 30,
    streamUrl: 'http://your-robot-ip:8080/stream', // 替换为真实的流地址
    streamType: 'mjpeg', // 或 'webrtc', 'hls', 'rtsp'
  });

  // WebSocket连接示例
  useEffect(() => {
    const ws = new WebSocket('ws://your-robot-ip:9090');
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      switch (message.type) {
        case 'status':
          setRobotStatus(message.data);
          break;
        case 'map':
          setMapData(message.data);
          break;
        case 'camera':
          setCameraStatus(message.data);
          break;
      }
    };

    return () => ws.close();
  }, []);

  return (
    <App
      status={robotStatus}
      mapData={mapData}
      cameraStatus={cameraStatus}
      onMovement={(command) => {
        // 发送移动指令
        fetch('http://your-robot-ip:8080/api/move', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(command),
        });
      }}
      onDirection={(command) => {
        // 发送方向指令
        fetch('http://your-robot-ip:8080/api/direction', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(command),
        });
      }}
      onActionSelect={(action) => {
        // 执行动作
        fetch('http://your-robot-ip:8080/api/action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ actionId: action.id }),
        });
      }}
      onCameraSwitch={(position) => {
        // 切换摄像头
        setCameraStatus(prev => ({ ...prev, position }));
        fetch('http://your-robot-ip:8080/api/camera/switch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ position }),
        });
      }}
    />
  );
}


// 示例 3: WebRTC 视频流集成
// ============================================

import { useRef, useEffect } from 'react';

function WebRTCRobotControl() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    // 创建WebRTC连接
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    pc.ontrack = (event) => {
      if (videoRef.current && event.streams[0]) {
        videoRef.current.srcObject = event.streams[0];
      }
    };

    // 连接到信令服务器获取offer/answer
    // ... WebRTC信令逻辑

    peerConnection.current = pc;

    return () => pc.close();
  }, []);

  const cameraStatus: CameraStatus = {
    position: 'front',
    isActive: true,
    resolution: '1920x1080',
    fps: 30,
    streamType: 'webrtc',
  };

  return (
    <App
      cameraStatus={cameraStatus}
      // 将videoRef传递给CameraStream组件使用
      // 注意：需要修改App组件以支持传递videoRef
    />
  );
}


// 示例 4: MJPEG 视频流（最简单的方式）
// ============================================

function MJPEGRobotControl() {
  const cameraStatus: CameraStatus = {
    position: 'front',
    isActive: true,
    resolution: '1280x720',
    fps: 25,
    streamUrl: 'http://your-robot-ip:8080/video_feed', // MJPEG流地址
    streamType: 'mjpeg',
  };

  return (
    <App
      cameraStatus={cameraStatus}
      onMovement={(command) => {
        // 控制移动
        console.log('移动:', command);
      }}
    />
  );
}


// 示例 5: 完整的机器人控制类
// ============================================

class RobotController {
  private ws: WebSocket;
  private statusCallback?: (status: RobotStatus) => void;
  private mapCallback?: (data: MapData) => void;

  constructor(robotIp: string) {
    this.ws = new WebSocket(`ws://${robotIp}:9090`);
    this.setupWebSocket();
  }

  private setupWebSocket() {
    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'telemetry') {
        this.statusCallback?.({
          battery: msg.data.battery,
          speed: msg.data.speed,
          state: msg.data.state,
          diagnosticStatus: msg.data.diagnosticStatus,
          temperature: msg.data.temperature,
          voltage: msg.data.voltage,
        });
      }
    };
  }

  move(command: MovementCommand) {
    this.ws.send(JSON.stringify({
      type: 'command',
      action: 'move',
      data: command,
    }));
  }

  rotate(command: DirectionCommand) {
    this.ws.send(JSON.stringify({
      type: 'command',
      action: 'rotate',
      data: command,
    }));
  }

  executeAction(action: ActionCommand) {
    this.ws.send(JSON.stringify({
      type: 'command',
      action: 'execute',
      data: action,
    }));
  }

  onStatusUpdate(callback: (status: RobotStatus) => void) {
    this.statusCallback = callback;
  }

  onMapUpdate(callback: (data: MapData) => void) {
    this.mapCallback = callback;
  }
}

// 使用控制器
const robot = new RobotController('192.168.1.100');

function ControlApp() {
  const [status, setStatus] = useState<RobotStatus>();
  
  useEffect(() => {
    robot.onStatusUpdate(setStatus);
  }, []);

  return (
    <App
      status={status}
      onMovement={(cmd) => robot.move(cmd)}
      onDirection={(cmd) => robot.rotate(cmd)}
      onActionSelect={(action) => robot.executeAction(action)}
    />
  );
}
*/