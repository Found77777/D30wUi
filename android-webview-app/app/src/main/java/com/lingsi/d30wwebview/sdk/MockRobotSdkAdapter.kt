package com.lingsi.d30wwebview.sdk

import android.util.Log
import com.lingsi.d30wwebview.model.RobotStatus

class MockRobotSdkAdapter : RobotSdkAdapter {
    private val tag = "MockRobotSdk"

    override fun sendMovement(json: String) {
        Log.i(tag, "sendMovement: $json")
    }

    override fun sendDirection(json: String) {
        Log.i(tag, "sendDirection: $json")
    }

    override fun stopMovement(reason: String) {
        Log.i(tag, "stopMovement: $reason")
    }

    override fun emergencyStop() {
        Log.w(tag, "emergencyStop")
    }

    override fun setSpeedMode(mode: Int) {
        Log.i(tag, "setSpeedMode: $mode")
    }

    override fun setMovementMode(mode: Int) {
        Log.i(tag, "setMovementMode: $mode")
    }

    override fun setPosture(posture: String) {
        Log.i(tag, "setPosture: $posture")
    }

    override fun executeAction(json: String) {
        Log.i(tag, "executeAction: $json")
    }

    override fun switchCamera(position: String) {
        Log.i(tag, "switchCamera: $position")
    }

    override fun startFollowMode(json: String) {
        Log.i(tag, "startFollowMode: $json")
    }

    override fun stopFollowMode() {
        Log.i(tag, "stopFollowMode")
    }

    override fun updateFollowConfig(json: String) {
        Log.i(tag, "updateFollowConfig: $json")
    }

    override fun requestRobotStatus(): RobotStatus {
        return RobotStatus()
    }

    override fun requestMapData(): String {
        return "{\"robotPosition\":{\"x\":0,\"y\":0},\"robotHeading\":0}"
    }
}
