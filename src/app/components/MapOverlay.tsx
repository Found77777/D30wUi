import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, Minimize2, ZoomIn, ZoomOut, Navigation } from 'lucide-react';
import { useState } from 'react';

interface MapOverlayProps {
  isVisible: boolean;
  isMapMode?: boolean; // 是否处于地图背景模式
  onToggleMapMode?: () => void; // 切换地图/相机背景
  // Map data interface - connect to real-time mapping system
  onMapUpdate?: (data: { position: { x: number; y: number }; heading: number }) => void;
  mapData?: {
    robotPosition?: { x: number; y: number };
    robotHeading?: number;
    pathPoints?: Array<{ x: number; y: number }>;
    obstacles?: Array<{ x: number; y: number; radius: number }>;
  };
}

export function MapOverlay({ isVisible, isMapMode, onToggleMapMode, onMapUpdate, mapData }: MapOverlayProps) {
  const [zoom, setZoom] = useState(1);

  // 如果地图已经是背景模式，则隐藏缩略图
  if (isMapMode) {
    return null;
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 0.5));
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          drag={!isMapMode}
          dragMomentum={false}
          dragElastic={0}
          dragConstraints={{
            top: 16,
            left: 16,
            right: 854 - 208, // 854 is screen width, 208 is map width (w-48 + padding)
            bottom: 480 - 200, // 480 is screen height, adjust for map height
          }}
          initial={{ opacity: 0, x: 600, y: 112 }}
          animate={{ opacity: 1, x: 600, y: 112 }}
          exit={{ opacity: 0 }}
          className={`backdrop-blur-md border border-white/20 rounded-xl overflow-hidden ${
            isMapMode
              ? 'fixed inset-0 z-50 rounded-none border-0 bg-black/95'
              : 'absolute z-30 w-48 h-44 cursor-move bg-black/60'
          }`}
        >
          {/* Map Header */}
          <div className="absolute top-0 left-0 right-0 bg-black/40 backdrop-blur-sm border-b border-white/10 flex items-center justify-between z-10 px-3 py-2">
            <div className="flex items-center gap-2">
              <Navigation className="text-green-400 w-3 h-3" />
              <span className="text-white text-xs">实时地图</span>
            </div>
            <button
              onClick={onToggleMapMode}
              className="rounded hover:bg-white/10 transition-colors p-1"
            >
              <Maximize2 className="text-white w-3 h-3" />
            </button>
          </div>

          {/* Map Content */}
          <div className="w-full h-full flex items-center justify-center relative">
            {/* Grid Background */}
            <div
              className={`absolute inset-0 ${isMapMode ? 'opacity-30' : 'opacity-20'}`}
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
                `,
                backgroundSize: `${40 * zoom}px ${40 * zoom}px`,
              }}
            />

            {/* Robot Position */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute z-10"
              style={{
                transform: `scale(${zoom})`,
              }}
            >
              <div className="relative">
                {/* Robot Marker */}
                <div className={`bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                  isMapMode ? 'w-12 h-12' : 'w-6 h-6'
                }`}>
                  <div className={`bg-white rounded-full ${isMapMode ? 'w-4 h-4' : 'w-2 h-2'}`} />
                </div>
                {/* Direction Indicator */}
                <div className={`absolute left-1/2 -translate-x-1/2 ${
                  isMapMode 
                    ? '-top-6 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-green-500'
                    : '-top-3 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-green-500'
                }`} />
              </div>
            </motion.div>

            {/* Sample Path */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ transform: `scale(${zoom})` }}>
              <motion.path
                d="M 50,50 Q 100,80 150,100 T 250,150"
                stroke={isMapMode ? 'rgba(34, 197, 94, 0.5)' : 'rgba(34, 197, 94, 0.3)'}
                strokeWidth={isMapMode ? '3' : '2'}
                fill="none"
                strokeDasharray="5,5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: 'easeInOut' }}
              />
            </svg>

            {/* Placeholder Text */}
            {!isMapMode && (
              <div className="text-white/20 text-sm">地图区域</div>
            )}
            
            {/* Fullscreen Additional Elements */}
            {isMapMode && (
              <>
                {/* Coordinate Display - Compact, positioned slightly below top controls */}
                <div className="absolute top-28 left-4 bg-black/60 backdrop-blur-sm px-2 py-1.5 rounded-lg border border-white/20">
                  <div className="text-[10px] text-white/80 space-y-0.5">
                    <div className="flex gap-1.5">
                      <span className="text-white/50">X:</span>
                      <span className="font-mono text-green-400">
                        {(mapData?.robotPosition?.x ?? 0).toFixed(2)}m
                      </span>
                    </div>
                    <div className="flex gap-1.5">
                      <span className="text-white/50">Y:</span>
                      <span className="font-mono text-green-400">
                        {(mapData?.robotPosition?.y ?? 0).toFixed(2)}m
                      </span>
                    </div>
                    <div className="flex gap-1.5">
                      <span className="text-white/50">朝向:</span>
                      <span className="font-mono text-green-400">
                        {(mapData?.robotHeading ?? 0).toFixed(1)}°
                      </span>
                    </div>
                  </div>
                </div>

                {/* Distance Scale */}
                <div className="absolute top-16 right-4 bg-black/60 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/20">
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col gap-1">
                      <div className="h-0.5 bg-white" style={{ width: `${50 * zoom}px` }} />
                      <div className="flex justify-between text-[10px] text-white/60">
                        <span>0</span>
                        <span>{(5 / zoom).toFixed(1)}m</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Map Controls */}
          <div className="absolute bottom-3 right-3 flex flex-col gap-2">
            <button
              onClick={handleZoomIn}
              className="p-2 bg-black/60 hover:bg-black/80 rounded-lg border border-white/20 transition-colors"
            >
              <ZoomIn className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 bg-black/60 hover:bg-black/80 rounded-lg border border-white/20 transition-colors"
            >
              <ZoomOut className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Map Info */}
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20">
            <div className="text-[10px] text-white/80">
              <div>缩放: {zoom.toFixed(1)}x</div>
              <div className="text-green-400">定位: 正常</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}