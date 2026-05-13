package com.lingsi.d30wwebview.bridge

import android.util.Log
import android.webkit.JavascriptInterface
import android.webkit.WebView
import com.lingsi.d30wwebview.model.CommandResult
import com.lingsi.d30wwebview.sdk.RobotSdkAdapter
import com.lingsi.d30wwebview.safety.CommandThrottle
import com.lingsi.d30wwebview.safety.CommandWatchdog
import com.lingsi.d30wwebview.safety.ControlGate

class AndroidRobotBridge(
    private val webView: WebView,
    private val sdk: RobotSdkAdapter,
    private val gate: ControlGate,
    private val throttle: CommandThrottle,
    private val watchdog: CommandWatchdog
) {
    private val tag = "AndroidRobotBridge"

    private fun emit(type: String, result: CommandResult, reason: String? = null) {
        val json = "{\"event\":\"commandResult\",\"type\":\"$type\",\"result\":\"$result\",\"reason\":${if (reason == null) "null" else "\"$reason\""}}"
        webView.post { webView.evaluateJavascript("window.__onAndroidEvent && window.__onAndroidEvent('$json')", null) }
    }

    private fun guard(type: String, block: () -> Unit) {
        val (ok, reason) = gate.allowNormalCommand()
        if (!ok) {
            Log.w(tag, "$type blocked: $reason")
            emit(type, CommandResult.BLOCKED, reason)
            return
        }
        block()
        emit(type, CommandResult.SENT)
    }

    @JavascriptInterface fun sendMovement(json: String) {
        if (!throttle.allow()) return
        guard("sendMovement") { sdk.sendMovement(json); watchdog.heartbeat() }
    }
    @JavascriptInterface fun sendDirection(json: String) {
        if (!throttle.allow()) return
        guard("sendDirection") { sdk.sendDirection(json); watchdog.heartbeat() }
    }
    @JavascriptInterface fun stopMovement(reason: String) { guard("stopMovement") { sdk.stopMovement(reason); watchdog.stop() } }
    @JavascriptInterface fun emergencyStop() {
        if (!gate.allowEmergency()) { emit("emergencyStop", CommandResult.BLOCKED, "gate_denied"); return }
        sdk.emergencyStop(); watchdog.stop(); emit("emergencyStop", CommandResult.SENT)
    }
    @JavascriptInterface fun setSpeedMode(mode: Int) = guard("setSpeedMode") { sdk.setSpeedMode(mode) }
    @JavascriptInterface fun setMovementMode(mode: Int) = guard("setMovementMode") { sdk.setMovementMode(mode) }
    @JavascriptInterface fun setPosture(posture: String) = guard("setPosture") { sdk.setPosture(posture) }
    @JavascriptInterface fun executeAction(json: String) = guard("executeAction") { sdk.executeAction(json) }
    @JavascriptInterface fun switchCamera(position: String) = guard("switchCamera") { sdk.switchCamera(position) }
    @JavascriptInterface fun startFollowMode(json: String) = guard("startFollowMode") { sdk.startFollowMode(json) }
    @JavascriptInterface fun stopFollowMode() = guard("stopFollowMode") { sdk.stopFollowMode() }
    @JavascriptInterface fun updateFollowConfig(json: String) = guard("updateFollowConfig") { sdk.updateFollowConfig(json) }
    @JavascriptInterface fun requestRobotStatus() {
        val s = sdk.requestRobotStatus()
        val json = "{\"event\":\"status\",\"data\":{\"battery\":${s.battery},\"speed\":${s.speed},\"state\":\"${s.state}\",\"diagnosticStatus\":\"${s.diagnosticStatus}\"}}"
        webView.post { webView.evaluateJavascript("window.__onAndroidEvent && window.__onAndroidEvent('$json')", null) }
    }
    @JavascriptInterface fun requestMapData() {
        val data = sdk.requestMapData()
        val json = "{\"event\":\"mapData\",\"data\":$data}"
        webView.post { webView.evaluateJavascript("window.__onAndroidEvent && window.__onAndroidEvent('$json')", null) }
    }
}
