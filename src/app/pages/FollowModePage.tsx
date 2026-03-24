import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Play, Square, Target, Gauge, Users } from "lucide-react";
import { motion } from "motion/react";

// 跟随模式类型
type FollowMode = "manual" | "auto";

// 跟随状态类型
type FollowStatus = "idle" | "following" | "target-lost";

// 跟随速度类型
type FollowSpeed = "slow" | "medium" | "fast";

export function FollowModePage() {
  const navigate = useNavigate();
  
  // 状态管理
  const [followMode, setFollowMode] = useState<FollowMode>("manual");
  const [followStatus, setFollowStatus] = useState<FollowStatus>("idle");
  const [followDistance, setFollowDistance] = useState(2); // 单位：米
  const [followSpeed, setFollowSpeed] = useState<FollowSpeed>("medium");

  // 返回主界面
  const handleBack = () => {
    navigate("/");
  };

  // 参数变更处理
  const handleDistanceChange = (value: number) => {
    setFollowDistance(value);
    console.log("📏 跟随距离变更:", value);
    // TODO: robotAPI.followMode.updateConfig({ distance: value });
  };

  const handleSpeedChange = (speed: FollowSpeed) => {
    setFollowSpeed(speed);
    console.log("⚡ 跟随速度变更:", speed);
    // TODO: robotAPI.followMode.updateConfig({ speed });
  };

  // 开始跟随
  const handleStartFollow = () => {
    if (followMode === "auto") {
      setFollowStatus("following");
      console.log("🚀 开始自动跟随", {
        mode: followMode,
        distance: followDistance,
        speed: followSpeed,
      });
      
      // ============================================
      // TODO: 接入真实机器人API
      // ============================================
      // import { robotAPI } from '../services/robotAPI';
      // 
      // robotAPI.followMode.start({
      //   mode: followMode,
      //   distance: followDistance,
      //   speed: followSpeed,
      // }).then(response => {
      //   if (response.success) {
      //     setFollowStatus("following");
      //   } else {
      //     setFollowStatus("idle");
      //     alert("启动跟随模式失败：" + response.error);
      //   }
      // }).catch(error => {
      //   console.error("跟随模式启动错误:", error);
      //   setFollowStatus("idle");
      // });
      // ============================================
    }
  };

  // 停止跟随
  const handleStopFollow = () => {
    setFollowStatus("idle");
    console.log("⏹️ 停止跟随");
    
    // ============================================
    // TODO: 接入真实机器人API
    // ============================================
    // import { robotAPI } from '../services/robotAPI';
    // 
    // robotAPI.followMode.stop().then(response => {
    //   if (response.success) {
    //     setFollowStatus("idle");
    //   }
    // }).catch(error => {
    //   console.error("停止跟随错误:", error);
    // });
    // ============================================
  };

  // 获取状态显示文本和颜色
  const getStatusInfo = () => {
    switch (followStatus) {
      case "idle":
        return { text: "未启动", color: "text-gray-400" };
      case "following":
        return { text: "跟随中", color: "text-green-500" };
      case "target-lost":
        return { text: "目标丢失", color: "text-red-500" };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="w-screen h-screen bg-gray-800 flex items-center justify-center p-4">
      {/* Phone Preview Frame */}
      <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden" style={{ width: '854px', height: '480px' }}>
        {/* Screen Notch/Camera Cutout (optional) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gray-300 rounded-b-lg z-50" />
        
        {/* Main App Content */}
        <div className="relative w-full h-full bg-white overflow-hidden select-none">
          {/* 顶部导航栏 */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-3 bg-gray-100 backdrop-blur-sm border-b border-gray-200 z-10">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs">返回</span>
            </button>
            <h1 className="text-sm font-semibold text-gray-900">跟随模式</h1>
            <div className="w-16" /> {/* 占位元素，保持标题居中 */}
          </div>

          {/* 主内容区域 - 横向滚动 */}
          <div className="absolute top-12 bottom-0 left-0 right-0 overflow-y-auto px-4 py-4">
            <div className="max-w-full mx-auto space-y-4">
              {/* 模块一：模式选择 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-50 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-sm"
              >
                <h2 className="text-sm font-semibold mb-3 flex items-center gap-2 text-gray-900">
                  <Target className="w-4 h-4 text-blue-500" />
                  模式选择
                </h2>
                
                <div className="space-y-3">
                  {/* 手动控制选项 */}
                  <label
                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      followMode === "manual"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="followMode"
                        checked={followMode === "manual"}
                        onChange={() => setFollowMode("manual")}
                        className="w-5 h-5 accent-blue-500"
                      />
                      <div>
                        <div className="font-medium text-gray-900">手动控制</div>
                        <div className="text-xs text-gray-500 mt-1">默认模式，通过摇杆控制移动</div>
                      </div>
                    </div>
                  </label>

                  {/* 自动跟随选项 */}
                  <label
                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      followMode === "auto"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="followMode"
                        checked={followMode === "auto"}
                        onChange={() => setFollowMode("auto")}
                        className="w-5 h-5 accent-blue-500"
                      />
                      <div>
                        <div className="font-medium text-gray-900">自动跟随</div>
                        <div className="text-xs text-gray-500 mt-1">需要依赖GPS或视觉能力</div>
                      </div>
                    </div>
                  </label>
                </div>
              </motion.div>

              {/* 模块二：跟随控制 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-gray-50 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-sm"
              >
                <h2 className="text-sm font-semibold mb-3 flex items-center gap-2 text-gray-900">
                  <Play className="w-4 h-4 text-green-400" />
                  跟随控制
                </h2>

                <div className="flex gap-4">
                  {/* 开始跟随按钮 */}
                  <button
                    onClick={handleStartFollow}
                    disabled={followMode === "manual" || followStatus === "following"}
                    className={`flex-1 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
                      followMode === "manual" || followStatus === "following"
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600 text-white shadow-md"
                    }`}
                  >
                    <Play className="w-5 h-5" />
                    开始跟随
                  </button>

                  {/* 停止跟随按钮 */}
                  <button
                    onClick={handleStopFollow}
                    disabled={followStatus !== "following"}
                    className={`flex-1 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
                      followStatus !== "following"
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600 text-white shadow-md"
                    }`}
                  >
                    <Square className="w-5 h-5" />
                    停止跟随
                  </button>
                </div>
              </motion.div>

              {/* 模块三：跟随参数 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="bg-gray-50 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-sm"
              >
                <h2 className="text-sm font-semibold mb-3 flex items-center gap-2 text-gray-900">
                  <Gauge className="w-4 h-4 text-purple-400" />
                  跟随参数
                </h2>

                <div className="space-y-6">
                  {/* 跟随距离 */}
                  <div>
                    <label className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-700">跟随距离</span>
                      <span className="text-sm font-mono text-blue-600">{followDistance.toFixed(1)} m</span>
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="5"
                      step="0.1"
                      value={followDistance}
                      onChange={(e) => handleDistanceChange(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-500"
                      style={{
                        background: `linear-gradient(to right, rgb(59 130 246) 0%, rgb(59 130 246) ${((followDistance - 0.5) / 4.5) * 100}%, rgb(229 231 235) ${((followDistance - 0.5) / 4.5) * 100}%, rgb(229 231 235) 100%)`,
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0.5m</span>
                      <span>5.0m</span>
                    </div>
                  </div>

                  {/* 跟随速度 */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-3">跟随速度</label>
                    <div className="flex gap-3">
                      {(["slow", "medium", "fast"] as FollowSpeed[]).map((speed) => (
                        <button
                          key={speed}
                          onClick={() => handleSpeedChange(speed)}
                          className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                            followSpeed === speed
                              ? "bg-blue-500 text-white shadow-md"
                              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                          }`}
                        >
                          {speed === "slow" && "慢"}
                          {speed === "medium" && "中"}
                          {speed === "fast" && "快"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* 模块四：状态显示 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="bg-gray-50 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-sm"
              >
                <h2 className="text-sm font-semibold mb-3 text-gray-900">当前状态</h2>

                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className={`text-4xl font-bold mb-2 ${statusInfo.color}`}>
                      {statusInfo.text}
                    </div>
                    {followStatus === "following" && (
                      <div className="flex items-center justify-center gap-2 mt-4">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="w-3 h-3 bg-green-400 rounded-full"
                        />
                        <span className="text-sm text-gray-500">正在跟踪目标</span>
                      </div>
                    )}
                    {followStatus === "target-lost" && (
                      <div className="text-sm text-gray-500 mt-4">
                        请确保目标在可见范围内
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}