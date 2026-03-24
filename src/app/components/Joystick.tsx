import { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface JoystickProps {
  size?: number;
  onChange?: (x: number, y: number) => void;
}

export function Joystick({ size = 120, onChange }: JoystickProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let deltaX = clientX - centerX;
    let deltaY = clientY - centerY;

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = size / 2 - 20;

    if (distance > maxDistance) {
      const angle = Math.atan2(deltaY, deltaX);
      deltaX = Math.cos(angle) * maxDistance;
      deltaY = Math.sin(angle) * maxDistance;
    }

    setPosition({ x: deltaX, y: deltaY });

    // Normalize to -1 to 1
    const normalizedX = deltaX / maxDistance;
    const normalizedY = -deltaY / maxDistance; // Invert Y for typical game controls

    onChange?.(normalizedX, normalizedY);
  };

  const handleStart = (e: React.PointerEvent) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    handleMove(e.clientX, e.clientY);
  };

  const handleEnd = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
    setPosition({ x: 0, y: 0 });
    onChange?.(0, 0);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      handleMove(e.clientX, e.clientY);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative select-none touch-none"
      style={{ width: size, height: size }}
      onPointerDown={handleStart}
      onPointerMove={handlePointerMove}
      onPointerUp={handleEnd}
      onPointerCancel={handleEnd}
    >
      {/* Outer circle */}
      <div
        className="absolute inset-0 rounded-full border-2 border-white/20 bg-black/40 backdrop-blur-sm"
      />

      {/* Inner stick */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-10 h-10 rounded-full bg-white/80 shadow-lg"
        style={{
          x: position.x,
          y: position.y,
          marginLeft: -20,
          marginTop: -20,
        }}
        animate={{
          scale: isDragging ? 1.1 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      />
    </div>
  );
}
