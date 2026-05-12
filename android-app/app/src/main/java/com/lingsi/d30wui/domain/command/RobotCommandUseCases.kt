package com.lingsi.d30wui.domain.command

import com.lingsi.d30wui.data.model.*
import com.lingsi.d30wui.domain.state.ControlUiState

fun buildCommandLog(type: String, payload: String, state: ControlUiState): CommandLog {
    val blockedReason = when {
        type != "emergency_stop" && state.connection.name == "DISCONNECTED" -> "未连接"
        type != "emergency_stop" && state.robotStatus.diagnosticStatus == "error" -> "诊断故障"
        type == "speed_mode_fast" && state.robotStatus.battery < 20 -> "低电量禁止快速模式"
        type == "action_obstacle" && state.robotStatus.battery < 20 -> "低电量禁止越障模式"
        else -> null
    }
    return CommandLog(type, payload, System.currentTimeMillis(), if (blockedReason == null) CommandResult.MOCK_SENT else CommandResult.BLOCKED, blockedReason)
}
