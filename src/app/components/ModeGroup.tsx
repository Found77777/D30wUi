import { motion } from 'motion/react';

interface ModeGroupProps {
  title: string;
  options: string[];
  activeIndex: number;
  onChange: (index: number) => void;
}

export function ModeGroup({ title, options, activeIndex, onChange }: ModeGroupProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="text-[10px] text-white/60 mb-0.5 uppercase tracking-wider">{title}</div>
      <div className="flex gap-1 bg-black/40 backdrop-blur-sm p-1 rounded-lg border border-white/10">
        {options.map((option, index) => (
          <motion.button
            key={option}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(index)}
            className={`
              px-3 py-1.5 rounded-md text-xs transition-all
              ${
                activeIndex === index
                  ? 'bg-white text-black'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }
            `}
          >
            {option}
          </motion.button>
        ))}
      </div>
    </div>
  );
}