package com.lingsi.d30wwebview.sdk

import com.lingsi.d30wwebview.model.RobotStatus

interface RobotSdkAdapter {
    fun sendMovement(json: String)
    fun sendDirection(json: String)
    fun stopMovement(reason: String)
    fun emergencyStop()
    fun setSpeedMode(mode: Int)
    fun setMovementMode(mode: Int)
    fun setPosture(posture: String)
    fun executeAction(json: String)
    fun switchCamera(position: String)
    fun startFollowMode(json: String)
    fun stopFollowMode()
    fun updateFollowConfig(json: String)
    fun requestRobotStatus(): RobotStatus
    fun requestMapData(): String
}
