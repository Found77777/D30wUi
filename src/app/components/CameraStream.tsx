import { useEffect, useRef, useState } from 'react';
import { CameraStatus } from '../types/robot-interfaces';
import { Camera, WifiOff, AlertCircle } from 'lucide-react';

interface CameraStreamProps {
  cameraStatus?: CameraStatus;
  // 支持直接传入视频元素引用（用于WebRTC等高级用法）
  videoRef?: React.RefObject<HTMLVideoElement>;
  // 或传入图片URL（用于MJPEG流）
  imageUrl?: string;
  // 连接状态回调
  onStreamError?: (error: Error) => void;
  onStreamConnected?: () => void;
}

export function CameraStream({
  cameraStatus,
  videoRef: externalVideoRef,
  imageUrl,
  onStreamError,
  onStreamConnected,
}: CameraStreamProps) {
  const internalVideoRef = useRef<HTMLVideoElement>(null);
  const videoRef = externalVideoRef || internalVideoRef;
  const [streamState, setStreamState] = useState<'connecting' | 'connected' | 'error' | 'disconnected'>('disconnected');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (!cameraStatus?.streamUrl || !cameraStatus.isActive) {
      setStreamState('disconnected');
      return;
    }

    setStreamState('connecting');

    // 根据流类型处理视频流
    const setupStream = async () => {
      try {
        const video = videoRef.current;
        if (!video) return;

        switch (cameraStatus.streamType) {
          case 'hls':
            // HLS流处理（需要hls.js库）
            // 示例代码 - 实际使用时需要安装hls.js
            /*
            if (Hls.isSupported()) {
              const hls = new Hls();
              hls.loadSource(cameraStatus.streamUrl);
              hls.attachMedia(video);
              hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play();
                setStreamState('connected');
                onStreamConnected?.();
              });
            }
            */
            setErrorMessage('HLS流需要安装hls.js库');
            setStreamState('error');
            break;

          case 'webrtc':
            // WebRTC流处理
            // 实际使用时需要配置WebRTC连接
            setErrorMessage('WebRTC流需要配置信令服务器');
            setStreamState('error');
            break;

          case 'mjpeg':
            // MJPEG流可以直接作为img src使用
            // 不使用video标签
            setStreamState('connected');
            onStreamConnected?.();
            break;

          default:
            // 默认尝试作为video源
            video.src = cameraStatus.streamUrl;
            video.onloadedmetadata = () => {
              video.play();
              setStreamState('connected');
              onStreamConnected?.();
            };
            video.onerror = (e) => {
              setErrorMessage('视频流加载失败');
              setStreamState('error');
              onStreamError?.(new Error('Video load error'));
            };
        }
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : '未知错误');
        setStreamState('error');
        onStreamError?.(error as Error);
      }
    };

    setupStream();

    // 清理函数
    return () => {
      const video = videoRef.current;
      if (video && video.src) {
        video.pause();
        video.src = '';
      }
    };
  }, [cameraStatus?.streamUrl, cameraStatus?.isActive, cameraStatus?.streamType]);

  // 渲染视频流或占位符
  const renderContent = () => {
    // 如果是MJPEG流，使用img标签
    if (cameraStatus?.streamType === 'mjpeg' && cameraStatus?.streamUrl) {
      return (
        <img
          src={imageUrl || cameraStatus.streamUrl}
          alt="Camera Stream"
          className="w-full h-full object-cover"
          onError={() => {
            setStreamState('error');
            setErrorMessage('图像加载失败');
          }}
          onLoad={() => {
            setStreamState('connected');
            onStreamConnected?.();
          }}
        />
      );
    }

    // 对于其他流类型，使用video标签
    if (cameraStatus?.streamUrl && cameraStatus?.isActive) {
      return (
        <video
          ref={videoRef as React.RefObject<HTMLVideoElement>}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      );
    }

    // 显示状态信息
    return (
      <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center gap-4">
        {streamState === 'connecting' && (
          <>
            <Camera className="w-16 h-16 text-white/20 animate-pulse" />
            <div className="text-white/40 text-lg">连接中...</div>
          </>
        )}
        
        {streamState === 'error' && (
          <>
            <AlertCircle className="w-16 h-16 text-red-500/50" />
            <div className="text-red-500/70 text-sm">视频流错误</div>
            {errorMessage && (
              <div className="text-red-500/50 text-xs max-w-md text-center px-4">
                {errorMessage}
              </div>
            )}
          </>
        )}
        
        {streamState === 'disconnected' && (
          <>
            <WifiOff className="w-16 h-16 text-white/20" />
            <div className="text-white/40 text-lg">摄像头未连接</div>
            <div className="text-white/20 text-xs">
              {cameraStatus ? '等待视频流...' : '请配置摄像头'}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {renderContent()}
      
      {/* 视频流状态指示器 */}
      {streamState === 'connected' && cameraStatus && (
        <div className="absolute top-4 left-4 flex flex-col gap-1">
          {/* 录制指示灯 */}
          <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-xs text-white/80">LIVE</span>
          </div>
          
          {/* 视频信息 */}
          {(cameraStatus.resolution || cameraStatus.fps) && (
            <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg">
              <span className="text-[10px] text-white/60">
                {cameraStatus.resolution || '1080p'} @ {cameraStatus.fps || 30}fps
              </span>
            </div>
          )}
        </div>
      )}

      {/* 十字准星（可选） */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="relative w-24 h-24">
          {/* 外圈 */}
          <div className="absolute inset-0 border-2 border-red-500/20 rounded-xl" />
          {/* 中心点 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-red-500/40 rounded-full" />
          {/* 十字线 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-full bg-gradient-to-b from-transparent via-red-500/20 to-transparent" />
        </div>
      </div>
    </div>
  );
}
