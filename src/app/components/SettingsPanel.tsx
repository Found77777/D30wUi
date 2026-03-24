import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Map, Zap, MapPin, FolderOpen, Info, ChevronRight, Radio, Video, Server, ChevronDown, Monitor } from 'lucide-react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onAIAssistToggle?: (enabled: boolean) => void;
  onMapToggle?: (enabled: boolean) => void;
  onAutoCharge?: () => void;
  onAutoUndock?: () => void;
  onMapNavigation?: () => void;
  onOfflineMapManage?: () => void;
  onFollowModeClick?: () => void;
  onSDKToggle?: (enabled: boolean) => void; // SDK开关
  onGimbalEnable?: () => void; // 开启云台
  onProductInfoUpdate?: (info: { robotIP?: string; navIP?: string; mapPath?: string }) => void; // 产品信息更新
  // 初始产品信息
  productInfo?: {
    robotIP?: string;
    navIP?: string;
    mapPath?: string;
  };
}

export function SettingsPanel({
  isOpen,
  onClose,
  onAIAssistToggle,
  onMapToggle,
  onAutoCharge,
  onAutoUndock,
  onMapNavigation,
  onOfflineMapManage,
  onFollowModeClick,
  onSDKToggle,
  onGimbalEnable,
  onProductInfoUpdate,
  productInfo,
}: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'map'>('basic');
  const [aiAssist, setAiAssist] = useState(false);
  const [mapEnabled, setMapEnabled] = useState(false);
  const [sdkEnabled, setSDKEnabled] = useState(false);
  const [gimbalEnabled, setGimbalEnabled] = useState(false);
  const [isProductInfoExpanded, setIsProductInfoExpanded] = useState(false);
  
  // 产品信息状态 - 使用props传入的初始值或默认值
  const [robotIP, setRobotIP] = useState(productInfo?.robotIP || '192.168.144.3');
  const [navIP, setNavIP] = useState(productInfo?.navIP || '192.168.144.3');
  const [mapPath] = useState(productInfo?.mapPath || '/home/jetson/linx/data/map');

  const handleAIToggle = () => {
    const newValue = !aiAssist;
    setAiAssist(newValue);
    onAIAssistToggle?.(newValue);
  };

  const handleMapToggle = () => {
    const newValue = !mapEnabled;
    setMapEnabled(newValue);
    onMapToggle?.(newValue);
  };

  const handleFollowModeClick = () => {
    onFollowModeClick?.(); // 调用父组件传递的导航函数
  };

  const handleSDKToggle = () => {
    const newValue = !sdkEnabled;
    setSDKEnabled(newValue);
    onSDKToggle?.(newValue);
  };
  
  const handleGimbalToggle = () => {
    const newValue = !gimbalEnabled;
    setGimbalEnabled(newValue);
    console.log('📹 云台控制:', newValue ? '开启' : '关闭');
    // 调用真实API
    onGimbalEnable?.();
  };
  
  // 处理IP地址更新
  const handleRobotIPChange = (value: string) => {
    setRobotIP(value);
    onProductInfoUpdate?.({ robotIP: value });
    console.log('🤖 机器人IP更新:', value);
  };
  
  const handleNavIPChange = (value: string) => {
    setNavIP(value);
    onProductInfoUpdate?.({ navIP: value });
    console.log('🧭 导航IP更新:', value);
  };

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
            className="absolute inset-0 bg-black/20 backdrop-blur-sm z-40"
          />

          {/* Settings Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute left-0 top-0 bottom-0 w-[30%] bg-black/90 backdrop-blur-xl border-r border-white/10 z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <h2 className="text-white font-semibold text-sm">设置</h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Tab Switcher */}
            <div className="px-4 py-3">
              <div className="flex gap-1 bg-white/5 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('basic')}
                  className={`flex-1 px-3 py-1.5 rounded-md text-xs transition-all ${
                    activeTab === 'basic'
                      ? 'bg-white text-black'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  基础功能
                </button>
                <button
                  onClick={() => setActiveTab('map')}
                  className={`flex-1 px-3 py-1.5 rounded-md text-xs transition-all ${
                    activeTab === 'map'
                      ? 'bg-white text-black'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  地图与任务
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-4 pb-4 space-y-4">
              {activeTab === 'basic' ? (
                <>
                  {/* AI Assist Module */}
                  <div className="space-y-2">
                    <h3 className="text-xs text-white/60 font-medium mb-2">智能辅助</h3>
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-blue-400" />
                          <span className="text-sm text-white">AI辅助</span>
                        </div>
                        <button
                          onClick={handleAIToggle}
                          className={`relative w-11 h-6 rounded-full transition-colors ${
                            aiAssist ? 'bg-green-500' : 'bg-white/20'
                          }`}
                        >
                          <motion.div
                            animate={{ x: aiAssist ? 20 : 2 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className="absolute top-1 w-4 h-4 bg-white rounded-full"
                          />
                        </button>
                      </div>
                      <p className="text-[10px] text-white/50 mt-2">
                        开启后提供智能控制优化
                      </p>
                    </div>
                  </div>

                  {/* Charging Controls Module */}
                  <div className="space-y-2">
                    <h3 className="text-xs text-white/60 font-medium mb-2">充电控制</h3>
                    <div className="space-y-2">
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={onAutoCharge}
                        className="w-full bg-white/10 hover:bg-white/15 text-white px-4 py-3 rounded-lg text-sm font-medium border border-white/10 transition-colors"
                      >
                        自主充电
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={onAutoUndock}
                        className="w-full bg-white/10 hover:bg-white/15 text-white px-4 py-3 rounded-lg text-sm font-medium border border-white/10 transition-colors"
                      >
                        自主出桩
                      </motion.button>
                    </div>
                  </div>

                  {/* Product Info Module - Collapsible */}
                  <div className="space-y-2">
                    <h3 className="text-xs text-white/60 font-medium mb-2">产品信息</h3>
                    <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                      {/* Header - Clickable */}
                      <button
                        onClick={() => setIsProductInfoExpanded(!isProductInfoExpanded)}
                        className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Server className="w-4 h-4 text-orange-400" />
                          <span className="text-sm text-white">设备IP</span>
                        </div>
                        <motion.div
                          animate={{ rotate: isProductInfoExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-4 h-4 text-white/50" />
                        </motion.div>
                      </button>

                      {/* Expandable Content */}
                      <AnimatePresence>
                        {isProductInfoExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-white/10"
                          >
                            <div className="p-3 space-y-3">
                              {/* 机器人IP */}
                              <div className="flex items-center justify-between gap-3">
                                <label className="text-xs text-white/50 flex-shrink-0">机器人IP</label>
                                <input
                                  type="text"
                                  value={robotIP}
                                  onChange={(e) => handleRobotIPChange(e.target.value)}
                                  className="bg-white/10 text-white text-xs px-2 py-1.5 rounded border border-white/20 focus:border-blue-400/50 focus:outline-none transition-colors flex-1 min-w-0 text-right font-mono"
                                  placeholder="192.168.144.3"
                                />
                              </div>

                              {/* 导航IP */}
                              <div className="flex items-center justify-between gap-3">
                                <label className="text-xs text-white/50 flex-shrink-0">机器人导航IP</label>
                                <input
                                  type="text"
                                  value={navIP}
                                  onChange={(e) => handleNavIPChange(e.target.value)}
                                  className="bg-white/10 text-white text-xs px-2 py-1.5 rounded border border-white/20 focus:border-blue-400/50 focus:outline-none transition-colors flex-1 min-w-0 text-right font-mono"
                                  placeholder="192.168.144.3"
                                />
                              </div>

                              {/* 地图路径 */}
                              <div className="flex items-center justify-between gap-3">
                                <label className="text-xs text-white/50 flex-shrink-0">地图路径</label>
                                <div className="bg-white/5 text-white/70 text-xs px-2 py-1.5 rounded border border-white/10 flex-1 min-w-0 text-right font-mono truncate">
                                  {mapPath}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Map Display Module */}
                  <div className="space-y-2">
                    <h3 className="text-xs text-white/60 font-medium mb-2">地图控制</h3>
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Map className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-white">地图显示</span>
                        </div>
                        <button
                          onClick={handleMapToggle}
                          className={`relative w-11 h-6 rounded-full transition-colors ${
                            mapEnabled ? 'bg-green-500' : 'bg-white/20'
                          }`}
                        >
                          <motion.div
                            animate={{ x: mapEnabled ? 20 : 2 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className="absolute top-1 w-4 h-4 bg-white rounded-full"
                          />
                        </button>
                      </div>
                      <p className="text-[10px] text-white/50 mt-2">
                        打开后右侧显示地图
                      </p>
                    </div>
                  </div>

                  {/* Map Management Module */}
                  <div className="space-y-2">
                    <h3 className="text-xs text-white/60 font-medium mb-2">地图管理</h3>
                    <div className="space-y-2">
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={onMapNavigation}
                        className="w-full bg-white/10 hover:bg-white/15 text-white px-4 py-3 rounded-lg text-sm font-medium border border-white/10 transition-colors flex items-center justify-center gap-2"
                      >
                        <MapPin className="w-4 h-4" />
                        建图导航
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={onOfflineMapManage}
                        className="w-full bg-white/10 hover:bg-white/15 text-white px-4 py-3 rounded-lg text-sm font-medium border border-white/10 transition-colors flex items-center justify-center gap-2"
                      >
                        <FolderOpen className="w-4 h-4" />
                        离线地图管理
                      </motion.button>
                    </div>
                  </div>

                  {/* Extensions & Development Module - Unified List Style */}
                  <div className="space-y-2">
                    <h3 className="text-xs text-white/60 font-medium mb-2">扩展与开发</h3>
                    <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                      {/* Follow Mode - List Item with Navigation (First) */}
                      <button
                        onClick={handleFollowModeClick}
                        className="w-full p-4 border-b border-white/10 hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Radio className="w-4 h-4 text-blue-400" />
                            <div className="text-left">
                              <div className="text-sm text-white font-medium">跟随模式</div>
                              <div className="text-[10px] text-white/50 mt-0.5">
                                配置自动跟随功能
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-white/50 flex-shrink-0" />
                        </div>
                      </button>

                      {/* Gimbal Control - List Item with Toggle (Second) */}
                      <div className="p-4 border-b border-white/10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Video className="w-4 h-4 text-cyan-400" />
                            <div>
                              <div className="text-sm text-white font-medium">云台控制</div>
                              <div className="text-[10px] text-white/50 mt-0.5">
                                开启或关闭云台
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={handleGimbalToggle}
                            className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
                              gimbalEnabled ? 'bg-green-500' : 'bg-white/20'
                            }`}
                          >
                            <motion.div
                              animate={{ x: gimbalEnabled ? 20 : 2 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                              className="absolute top-1 w-4 h-4 bg-white rounded-full"
                            />
                          </button>
                        </div>
                      </div>

                      {/* SDK Toggle - List Item (Last) */}
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Monitor className="w-4 h-4 text-purple-400" />
                            <div>
                              <div className="text-sm text-white font-medium">SDK</div>
                              <div className="text-[10px] text-white/50 mt-0.5">
                                开启SDK调试模式
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={handleSDKToggle}
                            className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
                              sdkEnabled ? 'bg-green-500' : 'bg-white/20'
                            }`}
                          >
                            <motion.div
                              animate={{ x: sdkEnabled ? 20 : 2 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                              className="absolute top-1 w-4 h-4 bg-white rounded-full"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* System Info */}
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-white/40">
                  <Info className="w-3 h-3" />
                  <span className="text-xs">版本 V2.0.3</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}