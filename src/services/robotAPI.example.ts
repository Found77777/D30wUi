/**
 * 机器人API集成示例
 * 这是一个模板文件，展示如何接入真实的机器人控制接口
 * 
 * 使用方法：
 * 1. 复制此文件为 robotAPI.ts
 * 2. 替换下面的URL和实现为真实的机器人API
 * 3. 在组件中导入并使用
 */

import {
  FollowModeConfig,
  FollowStatus,
  MovementCommand,
  DirectionCommand,
  ActionCommand,
  RobotStatus,
  MapData,
} from '../app/types/robot-interfaces';

// ============================================
// API 配置
// ============================================

const API_BASE_URL = 'http://your-robot-ip:8080/api'; // 替换为真实的机器人IP
const WS_URL = 'ws://your-robot-ip:9090'; // WebSocket地址

// ============================================
// HTTP API 封装
// ============================================

class RobotAPI {
  private baseUrl: string;
  private ws: WebSocket | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // 通用请求方法
  private async request<T>(
    endpoint: string,
    method: string = 'GET',
    body?: any
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // ============================================
  // 跟随模式 API
  // ============================================

  followMode = {
    /**
     * 启动跟随模式
     */
    start: async (config: FollowModeConfig): Promise<{ success: boolean; error?: string }> => {
      try {
        const response = await this.request('/follow/start', 'POST', config);
        console.log('✅ 跟随模式启动成功:', response);
        return { success: true };
      } catch (error) {
        console.error('❌ 跟随模式启动失败:', error);
        return { success: false, error: String(error) };
      }
    },

    /**
     * 停止跟随模式
     */
    stop: async (): Promise<{ success: boolean; error?: string }> => {
      try {
        const response = await this.request('/follow/stop', 'POST');
        console.log('✅ 跟随模式停止成功:', response);
        return { success: true };
      } catch (error) {
        console.error('❌ 跟随模式停止失败:', error);
        return { success: false, error: String(error) };
      }
    },

    /**
     * 更新跟随参数
     */
    updateConfig: async (config: Partial<FollowModeConfig>): Promise<void> => {
      try {
        await this.request('/follow/config', 'PATCH', config);
        console.log('✅ 跟随参数更新成功:', config);
      } catch (error) {
        console.error('❌ 跟随参数更新失败:', error);
      }
    },

    /**
     * 获取跟随状态
     */
    getStatus: async (): Promise<FollowStatus> => {
      try {
        const response = await this.request<{ status: FollowStatus }>('/follow/status');
        return response.status;
      } catch (error) {
        console.error('❌ 获取跟随状态失败:', error);
        return 'idle';
      }
    },
  };

  // ============================================
  // 运动控制 API
  // ============================================

  movement = {
    /**
     * 发送移动指令
     */
    move: async (command: MovementCommand): Promise<void> => {
      try {
        await this.request('/movement/move', 'POST', command);
      } catch (error) {
        console.error('❌ 移动指令发送失败:', error);
      }
    },

    /**
     * 发送方向指令
     */
    rotate: async (command: DirectionCommand): Promise<void> => {
      try {
        await this.request('/movement/rotate', 'POST', command);
      } catch (error) {
        console.error('❌ 方向指令发送失败:', error);
      }
    },

    /**
     * 紧急停止
     */
    emergencyStop: async (): Promise<void> => {
      try {
        await this.request('/movement/emergency-stop', 'POST');
        console.log('🚨 紧急停止已触发');
      } catch (error) {
        console.error('❌ 紧急停止失败:', error);
      }
    },
  };

  // ============================================
  // 动作控制 API
  // ============================================

  action = {
    /**
     * 执行预定义动作
     */
    execute: async (action: ActionCommand): Promise<void> => {
      try {
        await this.request('/action/execute', 'POST', action);
        console.log('✅ 动作执行成功:', action.name);
      } catch (error) {
        console.error('❌ 动作执行失败:', error);
      }
    },

    /**
     * 获取所有可用动作
     */
    list: async (): Promise<ActionCommand[]> => {
      try {
        return await this.request<ActionCommand[]>('/action/list');
      } catch (error) {
        console.error('❌ 获取动作列表失败:', error);
        return [];
      }
    },
  };

  // ============================================
  // 状态获取 API
  // ============================================

  status = {
    /**
     * 获取机器人状态
     */
    getRobotStatus: async (): Promise<RobotStatus | null> => {
      try {
        return await this.request<RobotStatus>('/status/robot');
      } catch (error) {
        console.error('❌ 获取机器人状态失败:', error);
        return null;
      }
    },

    /**
     * 获取地图数据
     */
    getMapData: async (): Promise<MapData | null> => {
      try {
        return await this.request<MapData>('/status/map');
      } catch (error) {
        console.error('❌ 获取地图数据失败:', error);
        return null;
      }
    },
  };

  // ============================================
  // WebSocket 实时通信
  // ============================================

  /**
   * 连接WebSocket
   */
  connectWebSocket(
    onStatusUpdate?: (status: RobotStatus) => void,
    onMapUpdate?: (data: MapData) => void,
    onFollowStatusUpdate?: (status: FollowStatus) => void
  ): void {
    this.ws = new WebSocket(WS_URL);

    this.ws.onopen = () => {
      console.log('✅ WebSocket连接成功');
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        switch (message.type) {
          case 'status':
            onStatusUpdate?.(message.data);
            break;
          case 'map':
            onMapUpdate?.(message.data);
            break;
          case 'follow-status':
            onFollowStatusUpdate?.(message.data);
            break;
          default:
            console.log('未知消息类型:', message.type);
        }
      } catch (error) {
        console.error('❌ WebSocket消息解析失败:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('❌ WebSocket错误:', error);
    };

    this.ws.onclose = () => {
      console.log('⚠️ WebSocket连接关闭');
    };
  }

  /**
   * 断开WebSocket
   */
  disconnectWebSocket(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      console.log('✅ WebSocket已断开');
    }
  }
}

// ============================================
// 导出单例实例
// ============================================

export const robotAPI = new RobotAPI(API_BASE_URL);

// ============================================
// React Hook 封装（可选）
// ============================================

/**
 * 使用机器人状态的Hook
 * 
 * 使用示例：
 * ```tsx
 * function MyComponent() {
 *   const { status, mapData, followStatus } = useRobotStatus();
 *   
 *   return (
 *     <div>
 *       电量: {status?.battery}%
 *       位置: ({mapData?.robotPosition?.x}, {mapData?.robotPosition?.y})
 *       跟随状态: {followStatus}
 *     </div>
 *   );
 * }
 * ```
 */
export function useRobotStatus() {
  const [status, setStatus] = React.useState<RobotStatus | null>(null);
  const [mapData, setMapData] = React.useState<MapData | null>(null);
  const [followStatus, setFollowStatus] = React.useState<FollowStatus>('idle');

  React.useEffect(() => {
    // 连接WebSocket
    robotAPI.connectWebSocket(
      setStatus,
      setMapData,
      setFollowStatus
    );

    // 初始获取数据
    robotAPI.status.getRobotStatus().then(setStatus);
    robotAPI.status.getMapData().then(setMapData);
    robotAPI.followMode.getStatus().then(setFollowStatus);

    // 清理函数
    return () => {
      robotAPI.disconnectWebSocket();
    };
  }, []);

  return { status, mapData, followStatus };
}

// ============================================
// 使用示例
// ============================================

/*
// 在 FollowModePage.tsx 中使用：

import { robotAPI } from '../../services/robotAPI';

export function FollowModePage() {
  // ... 其他代码

  const handleStartFollow = async () => {
    if (followMode === "auto") {
      const result = await robotAPI.followMode.start({
        mode: followMode,
        distance: followDistance,
        speed: followSpeed,
        targetType: targetType,
      });

      if (result.success) {
        setFollowStatus("following");
      } else {
        alert("启动跟随模式失败：" + result.error);
      }
    }
  };

  const handleStopFollow = async () => {
    const result = await robotAPI.followMode.stop();
    if (result.success) {
      setFollowStatus("idle");
    }
  };

  const handleDistanceChange = (value: number) => {
    setFollowDistance(value);
    robotAPI.followMode.updateConfig({ distance: value });
  };

  // ... 其他代码
}
*/

/*
// 在 App.tsx 中使用：

import { robotAPI, useRobotStatus } from './services/robotAPI';

export default function App() {
  const { status, mapData, followStatus } = useRobotStatus();

  const handleMovement = (command: MovementCommand) => {
    robotAPI.movement.move(command);
  };

  const handleDirection = (command: DirectionCommand) => {
    robotAPI.movement.rotate(command);
  };

  const handleEmergencyStop = () => {
    robotAPI.movement.emergencyStop();
  };

  const handleActionExecute = (action: ActionCommand) => {
    robotAPI.action.execute(action);
  };

  return (
    <div>
      {/* 使用status, mapData等数据渲染UI *\/}
    </div>
  );
}
*/
