import { motion } from 'motion/react';
import { Navigation, ZoomIn, ZoomOut } from 'lucide-react';
import { useState } from 'react';

interface MapBackgroundProps {
  mapData?: {
    robotPosition?: { x: number; y: number };
    robotHeading?: number;
    pathPoints?: Array<{ x: number; y: number }>;
    obstacles?: Array<{ x: number; y: number; radius: number }>;
  };
}

export function MapBackground({ mapData }: MapBackgroundProps) {
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 0.5));
  };

  return (
    <div className="w-full h-full relative bg-black z-0">
      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-30"
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
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
        style={{
          transform: `translate(-50%, -50%) scale(${zoom})`,
        }}
      >
        <div className="relative">
          {/* Robot Marker */}
          <div className="w-12 h-12 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full" />
          </div>
          {/* Direction Indicator */}
          <div 
            className="absolute -top-6 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-green-500"
            style={{
              transform: `translateX(-50%) rotate(${mapData?.robotHeading ?? 0}deg)`,
            }}
          />
        </div>
      </motion.div>

      {/* Sample Path */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ transform: `scale(${zoom})` }}>
        <motion.path
          d="M 50,50 Q 100,80 150,100 T 250,150"
          stroke="rgba(34, 197, 94, 0.5)"
          strokeWidth="3"
          fill="none"
          strokeDasharray="5,5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
      </svg>

      {/* Coordinate Display - Compact, positioned slightly below top controls */}
      <div className="absolute top-28 left-4 bg-black/60 backdrop-blur-sm px-2 py-1.5 rounded-lg border border-white/20 z-20">
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

      {/* Distance Scale - Top Right */}
      <div className="absolute top-16 right-4 bg-black/60 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/20 z-20">
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

      {/* Zoom Controls - Left Side, middle bottom */}
      <div className="absolute bottom-48 left-4 flex flex-col gap-2 z-20">
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

      {/* Map Info - Right Side, lower position */}
      <div className="absolute bottom-48 right-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20 z-20">
        <div className="text-[10px] text-white/80">
          <div>缩放: {zoom.toFixed(1)}x</div>
          <div className="text-green-400">定位: 正常</div>
        </div>
      </div>
    </div>
  );
}