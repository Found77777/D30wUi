import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle } from 'lucide-react';

interface ExitConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ExitConfirmModal({ isOpen, onClose, onConfirm }: ExitConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101]"
          >
            <div className="bg-black/90 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl px-8 py-6 w-[400px]">
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-yellow-500" />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl text-white font-medium text-center mb-3">
                确认退出控制？
              </h2>

              {/* Description */}
              <p className="text-sm text-white/70 text-center mb-6 leading-relaxed">
                退出后将无法继续控制机器人，请确认当前环境安全
              </p>

              {/* Buttons */}
              <div className="flex gap-3">
                {/* Cancel Button */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="flex-1 px-6 py-3 rounded-lg border border-white/30 bg-black/40 text-white text-sm hover:bg-white/10 transition-colors"
                >
                  取消
                </motion.button>

                {/* Confirm Exit Button */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onConfirm}
                  className="flex-1 px-6 py-3 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  确认退出
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}