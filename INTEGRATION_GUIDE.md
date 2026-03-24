# 四足机器人控制应用 - 接口集成指南

本文档详细说明如何将真实的机器人系统接入到控制应用中。

## 📋 目录

1. [接口概览](#接口概览)
2. [摄像头视频流接入](#摄像头视频流接入)
3. [运动控制接入](#运动控制接入)
4. [状态监控接入](#状态监控接入)
5. [地图导航接入](#地图导航接入)
6. [完整集成示例](#完整集成示例)

---

## 接口概览

所有接口定义位于 `/src/app/types/robot-interfaces.ts` 文件中。

### 核心接口类型

- **RobotStatus**: 机器人状态（电量、速度、温度等）
- **CameraStatus**: 摄像头状态和视频流配置
- **MapData**: 地图和导航数据
- **MovementCommand**: 移动控制指令
- **DirectionCommand**: 方向控制指令
- **ActionCommand**: 动作指令

---

## 摄像头视频流接入

### 支持的视频流类型

1. **MJPEG** - 最简单，推荐用于快速测试
2. **HLS** - HTTP Live Streaming
3. **WebRTC** - 低延迟实时流
4. **RTSP** - 监控摄像头常用协议

### 方式1: MJPEG流（推荐快速开始）

```typescript
import App from './app/App';
import { CameraStatus } from './app/types/robot-interfaces';

const cameraConfig: CameraStatus = {
  position: 'front',
  isActive: true,
  resolution: '1920x1080',
  fps: 30,
  streamUrl: 'http://192.168.1.100:8080/video_feed', // 你的MJPEG流地址
  streamType: 'mjpeg',
};

function MyRobotApp() {
  return <App cameraStatus={cameraConfig} />;
}
```

### 方式2: HLS流

```typescript
// 需要安装 hls.js: npm install hls.js
const cameraConfig: CameraStatus = {
  position: 'front',
  isActive: true,
  streamUrl: 'http://192.168.1.100:8080/stream.m3u8',
  streamType: 'hls',
};
```

### 方式3: WebRTC（低延迟）

```typescript
// WebRTC需要配置信令服务器
const cameraConfig: CameraStatus = {
  position: 'front',
  isActive: true,
  streamType: 'webrtc',
  // WebRTC需要额外的信令服务器配置
};

// 参考 /src/app/types/robot-interfaces.ts 中的示例3
```

### 动态切换摄像头

```typescript
function MyRobotApp() {
  const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>('front');

  const cameraConfig: CameraStatus = {
    position: cameraPosition,
    isActive: true,
    streamUrl: `http://192.168.1.100:8080/${cameraPosition}_camera`,
    streamType: 'mjpeg',
  };

  return (
    <App
      cameraStatus={cameraConfig}
      onCameraSwitch={(position) => {
        setCameraPosition(position);
        // 同时通知机器人切换摄像头
        fetch('http://192.168.1.100:8080/api/camera/switch', {
          method: 'POST',
          body: JSON.stringify({ position }),
        });
      }}
    />
  );
}
```

---

## 运动控制接入

### 摇杆控制

应用提供两个摇杆：
- **左摇杆**: 控制移动（前后左右）
- **右摇杆**: 控制方向（旋转）

### 接收摇杆数据

```typescript
import { MovementCommand, DirectionCommand } from './app/types/robot-interfaces';

function MyRobotApp() {
  const handleMovement = (command: MovementCommand) => {
    // command.x: -1 (左) 到 1 (右)
    // command.y: -1 (后) 到 1 (前)
    // command.timestamp: 时间戳
    
    console.log('移动命令:', command);
    
    // 发送到机器人
    fetch('http://192.168.1.100:8080/api/move', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vx: command.x * maxSpeed, // 转换为实际速度
        vy: command.y * maxSpeed,
      }),
    });
  };

  const handleDirection = (command: DirectionCommand) => {
    // command.x: 旋转角速度
    console.log('方向命令:', command);
    
    // 发送到机器人
    fetch('http://192.168.1.100:8080/api/rotate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        angular_velocity: command.x * maxAngularSpeed,
      }),
    });
  };

  return (
    <App
      onMovement={handleMovement}
      onDirection={handleDirection}
    />
  );
}
```

### WebSocket实时控制（推荐）

```typescript
function MyRobotApp() {
  const wsRef = useRef<WebSocket>();

  useEffect(() => {
    const ws = new WebSocket('ws://192.168.1.100:9090');
    wsRef.current = ws;
    
    return () => ws.close();
  }, []);

  const handleMovement = (command: MovementCommand) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'move',
        data: command,
      }));
    }
  };

  return <App onMovement={handleMovement} />;
}
```

---

## 状态监控接入

### 实时接收机器人状态

```typescript
import { useState, useEffect } from 'react';
import { RobotStatus } from './app/types/robot-interfaces';

function MyRobotApp() {
  const [status, setStatus] = useState<RobotStatus>({
    battery: 0,
    speed: 0,
    state: 'standby',
    diagnosticStatus: 'normal',
  });

  useEffect(() => {
    const ws = new WebSocket('ws://192.168.1.100:9090');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'telemetry') {
        setStatus({
          battery: data.battery,
          speed: data.speed,
          state: data.state,
          diagnosticStatus: data.diagnosticStatus,
          temperature: data.temperature,
          voltage: data.voltage,
        });
      }
    };

    return () => ws.close();
  }, []);

  return <App status={status} />;
}
```

### 轮询方式（备选）

```typescript
useEffect(() => {
  const interval = setInterval(async () => {
    const response = await fetch('http://192.168.1.100:8080/api/status');
    const data = await response.json();
    setStatus(data);
  }, 1000); // 每秒更新一次

  return () => clearInterval(interval);
}, []);
```

---

## 地图导航接入

### 实时地图数据

```typescript
import { MapData } from './app/types/robot-interfaces';

function MyRobotApp() {
  const [mapData, setMapData] = useState<MapData>({
    robotPosition: { x: 0, y: 0 },
    robotHeading: 0,
    pathPoints: [],
    obstacles: [],
  });

  useEffect(() => {
    const ws = new WebSocket('ws://192.168.1.100:9090');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'map_update') {
        setMapData({
          robotPosition: data.position,
          robotHeading: data.heading,
          pathPoints: data.path,
          obstacles: data.obstacles,
        });
      }
    };

    return () => ws.close();
  }, []);

  return (
    <App
      mapData={mapData}
      onMapUpdate={(data) => {
        // 地图更新回调（如果需要）
        console.log('地图更新:', data);
      }}
    />
  );
}
```

---

## 完整集成示例

### 示例：完整的机器人控制应用

```typescript
import { useState, useEffect, useRef } from 'react';
import App from './app/App';
import {
  RobotStatus,
  CameraStatus,
  MapData,
  MovementCommand,
  DirectionCommand,
  ActionCommand,
} from './app/types/robot-interfaces';

const ROBOT_IP = '192.168.1.100';
const ROBOT_WS_PORT = 9090;
const ROBOT_HTTP_PORT = 8080;

function RobotControlApp() {
  // 状态管理
  const [robotStatus, setRobotStatus] = useState<RobotStatus>({
    battery: 0,
    speed: 0,
    state: 'standby',
    diagnosticStatus: 'normal',
  });

  const [cameraStatus, setCameraStatus] = useState<CameraStatus>({
    position: 'front',
    isActive: true,
    resolution: '1920x1080',
    fps: 30,
    streamUrl: `http://${ROBOT_IP}:${ROBOT_HTTP_PORT}/video_feed`,
    streamType: 'mjpeg',
  });

  const [mapData, setMapData] = useState<MapData>({
    robotPosition: { x: 0, y: 0 },
    robotHeading: 0,
    pathPoints: [],
    obstacles: [],
  });

  // WebSocket连接
  const wsRef = useRef<WebSocket>();

  useEffect(() => {
    const ws = new WebSocket(`ws://${ROBOT_IP}:${ROBOT_WS_PORT}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket已连接');
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case 'telemetry':
          setRobotStatus({
            battery: message.data.battery,
            speed: message.data.speed,
            state: message.data.state,
            diagnosticStatus: message.data.diagnosticStatus,
            temperature: message.data.temperature,
            voltage: message.data.voltage,
          });
          break;

        case 'map_update':
          setMapData({
            robotPosition: message.data.position,
            robotHeading: message.data.heading,
            pathPoints: message.data.path,
            obstacles: message.data.obstacles,
          });
          break;

        case 'camera_update':
          setCameraStatus((prev) => ({
            ...prev,
            ...message.data,
          }));
          break;
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket错误:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket已断开');
      // 可以在这里实现重连逻辑
    };

    return () => {
      ws.close();
    };
  }, []);

  // 发送命令到机器人
  const sendCommand = (type: string, data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type,
          timestamp: Date.now(),
          data,
        })
      );
    } else {
      console.warn('WebSocket未连接');
    }
  };

  // 控制回调函数
  const handleMovement = (command: MovementCommand) => {
    sendCommand('move', {
      vx: command.x,
      vy: command.y,
    });
  };

  const handleDirection = (command: DirectionCommand) => {
    sendCommand('rotate', {
      angular_velocity: command.x,
    });
  };

  const handleActionSelect = (action: ActionCommand) => {
    sendCommand('action', {
      action_id: action.id,
      parameters: action.parameters,
    });
  };

  const handleCameraSwitch = (position: 'front' | 'back') => {
    setCameraStatus((prev) => ({
      ...prev,
      position,
      streamUrl: `http://${ROBOT_IP}:${ROBOT_HTTP_PORT}/${position}_camera`,
    }));
    sendCommand('camera_switch', { position });
  };

  const handleSpeedModeChange = (mode: 0 | 1 | 2) => {
    sendCommand('speed_mode', { mode });
  };

  const handlePostureChange = (posture: string) => {
    sendCommand('posture', { posture });
  };

  const handleFollowToggle = (isFollowing: boolean) => {
    sendCommand('follow', { enabled: isFollowing });
  };

  const handlePowerToggle = () => {
    sendCommand('power', { action: 'toggle' });
  };

  const handleExit = () => {
    if (confirm('确定要退出控制吗？')) {
      sendCommand('disconnect', {});
      // 关闭应用或返回主页
    }
  };

  return (
    <App
      // 状态
      status={robotStatus}
      cameraStatus={cameraStatus}
      mapData={mapData}
      // 控制回调
      onMovement={handleMovement}
      onDirection={handleDirection}
      onActionSelect={handleActionSelect}
      onCameraSwitch={handleCameraSwitch}
      onSpeedModeChange={handleSpeedModeChange}
      onPostureChange={handlePostureChange}
      onFollowToggle={handleFollowToggle}
      onPowerToggle={handlePowerToggle}
      onExit={handleExit}
    />
  );
}

export default RobotControlApp;
```

---

## 🔧 调试技巧

### 1. 检查WebSocket连接

```typescript
ws.onopen = () => console.log('✅ WebSocket已连接');
ws.onerror = (e) => console.error('❌ WebSocket错误:', e);
ws.onclose = () => console.log('⚠️ WebSocket已断开');
```

### 2. 监控所有命令

```typescript
const handleMovement = (command: MovementCommand) => {
  console.log('📡 发送移动命令:', command);
  sendCommand('move', command);
};
```

### 3. 测试摄像头流

```typescript
// 测试MJPEG流是否可访问
fetch('http://192.168.1.100:8080/video_feed')
  .then(() => console.log('✅ 摄像头流可访问'))
  .catch(() => console.error('❌ 摄像头流无法访问'));
```

---

## 📚 更多示例

更多详细示例请查看 `/src/app/types/robot-interfaces.ts` 文件中的注释部分。

---

## 🆘 常见问题

### Q: 视频流显示黑屏？
A: 检查 `streamUrl` 是否正确，确认摄像头服务是否运行。

### Q: 控制指令无响应？
A: 检查WebSocket连接状态，确认机器人服务端是否正常接收消息。

### Q: 如何实现断线重连？
A: 参考完整示例中的WebSocket `onclose` 事件，添加定时重连逻辑。

---

## 📞 技术支持

如需更多帮助，请参考：
- 接口定义文件: `/src/app/types/robot-interfaces.ts`
- 摄像头组件: `/src/app/components/CameraStream.tsx`
- 地图组件: `/src/app/components/MapOverlay.tsx`
