package com.lingsi.d30wwebview.sdk

import com.lingsi.d30wwebview.model.RobotStatus

class RealRobotSdkAdapter : RobotSdkAdapter {
    override fun sendMovement(json: String) = notImplemented()
    override fun sendDirection(json: String) = notImplemented()
    override fun stopMovement(reason: String) = notImplemented()
    override fun emergencyStop() = notImplemented()
    override fun setSpeedMode(mode: Int) = notImplemented()
    override fun setMovementMode(mode: Int) = notImplemented()
    override fun setPosture(posture: String) = notImplemented()
    override fun executeAction(json: String) = notImplemented()
    override fun switchCamera(position: String) = notImplemented()
    override fun startFollowMode(json: String) = notImplemented()
    override fun stopFollowMode() = notImplemented()
    override fun updateFollowConfig(json: String) = notImplemented()
    override fun requestRobotStatus(): RobotStatus = throw UnsupportedOperationException("Phase 1 mock only")
    override fun requestMapData(): String = throw UnsupportedOperationException("Phase 1 mock only")
    private fun notImplemented(): Nothing = throw UnsupportedOperationException("Phase 1 mock only")
}
