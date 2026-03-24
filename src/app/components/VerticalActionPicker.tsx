import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'motion/react';

interface ActionItem {
  id: string;
  name: string;
  icon: string;
}

interface VerticalActionPickerProps {
  actions: ActionItem[];
  onSelect?: (action: ActionItem) => void;
}

export function VerticalActionPicker({
  actions,
  onSelect,
}: VerticalActionPickerProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<number>();
  
  const itemHeight = 55; // Smaller for mobile
  const visibleCount = 3;
  const containerHeight = itemHeight * visibleCount;
  const sidePadding = itemHeight;

  const clamp = (num: number, min: number, max: number) =>
    Math.min(Math.max(num, min), max);

  const scrollToIndex = (index: number, smooth = true) => {
    const container = containerRef.current;
    if (!container) return;

    container.scrollTo({
      top: index * itemHeight,
      behavior: smooth ? 'smooth' : 'auto',
    });
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      scrollToIndex(selectedIndex, false);
      onSelect?.(actions[selectedIndex]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEnterEdit = () => {
    setIsExpanded(true);
    requestAnimationFrame(() => {
      scrollToIndex(selectedIndex, false);
    });
  };

  const handleLockSelection = () => {
    setIsExpanded(false);
    onSelect?.(actions[selectedIndex]);
  };

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const index = clamp(
      Math.round(container.scrollTop / itemHeight),
      0,
      actions.length - 1
    );

    if (index !== selectedIndex) {
      setSelectedIndex(index);
    }

    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = window.setTimeout(() => {
      scrollToIndex(index, true);
    }, 80);
  };

  const selectedAction = actions[selectedIndex];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-[10px] text-white/60 tracking-wider">
        动作
      </div>

      <AnimatePresence mode="wait">
        {!isExpanded ? (
          // Locked state
          <motion.button
            key="locked"
            initial={{ opacity: 0.85, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.85, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            onClick={handleEnterEdit}
            className="group relative w-32 rounded-2xl border border-white/12 bg-black/45 px-3 py-3 backdrop-blur-md"
          >
            <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/6 px-2 py-2 transition-all group-hover:bg-white/[0.08]">
              <div className="mb-1 text-2xl leading-none">
                {selectedAction.icon}
              </div>
              <div className="text-xs font-semibold text-white">
                {selectedAction.name}
              </div>
            </div>

            <div className="mt-2 text-center text-[9px] text-white/45">
              点击更改
            </div>
          </motion.button>
        ) : (
          // Edit state
          <motion.div
            key="editing"
            initial={{ opacity: 0.85, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.85, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="relative"
          >
            <div
              className="relative overflow-hidden rounded-2xl border border-white/12 bg-black/40 backdrop-blur-md"
              style={{
                width: 140,
                height: containerHeight,
              }}
            >
              {/* Selection indicator */}
              <div
                className="pointer-events-none absolute left-2 right-2 z-20 rounded-xl border border-white/10 bg-white/5"
                style={{
                  top: `calc(50% - ${itemHeight / 2}px)`,
                  height: itemHeight,
                }}
              />

              {/* Gradient masks */}
              <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-12 bg-gradient-to-b from-black via-black/70 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-12 bg-gradient-to-t from-black via-black/70 to-transparent" />

              <div
                ref={containerRef}
                onScroll={handleScroll}
                className="h-full overflow-y-auto no-scrollbar snap-y snap-mandatory"
                style={{
                  paddingTop: sidePadding,
                  paddingBottom: sidePadding,
                }}
              >
                {actions.map((action, index) => {
                  const distance = Math.abs(index - selectedIndex);
                  const scale =
                    distance === 0 ? 1 : distance === 1 ? 0.85 : 0.7;
                  const opacity =
                    distance === 0 ? 1 : distance === 1 ? 0.5 : 0.2;

                  return (
                    <div
                      key={action.id}
                      className="snap-center flex items-center justify-center"
                      style={{ height: itemHeight }}
                    >
                      <motion.div
                        animate={{ scale, opacity }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className={`flex w-[110px] flex-col items-center justify-center rounded-xl px-2 py-1 text-center ${
                          index === selectedIndex
                            ? 'text-white'
                            : 'text-white/60'
                        }`}
                      >
                        <div className="mb-1 text-xl leading-none">
                          {action.icon}
                        </div>
                        <div className="text-[11px] font-semibold">
                          {action.name}
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Confirm button */}
            <button
              onClick={handleLockSelection}
              className="mt-2 w-full rounded-lg border border-white/12 bg-white text-black px-3 py-2 text-[10px] font-medium hover:bg-white/90 transition-colors"
            >
              确认
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
