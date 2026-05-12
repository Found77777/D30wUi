package com.lingsi.d30wui.domain.state

import com.lingsi.d30wui.data.model.*

data class ControlUiState(
    val robotStatus: RobotStatus = RobotStatus(),
    val connection: ConnectionState = ConnectionState.CONNECTED,
    val mapMode: Boolean = false,
    val settingsOpen: Boolean = false,
    val mapOverlayVisible: Boolean = false,
    val exitDialogOpen: Boolean = false,
    val speedMode: Int = 1,
    val movementMode: Int = 1,
    val posture: String = "standing",
    val selectedAction: String = "标准站立",
    val follow: FollowModeState = FollowModeState(),
    val settings: RobotSettings = RobotSettings(),
    val logs: List<CommandLog> = emptyList()
)
