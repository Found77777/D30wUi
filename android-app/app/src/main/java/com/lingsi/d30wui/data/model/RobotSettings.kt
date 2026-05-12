package com.lingsi.d30wui.data.model

data class RobotSettings(
    val aiAssist: Boolean = false,
    val mapVisible: Boolean = false,
    val sdkEnabled: Boolean = false,
    val gimbalEnabled: Boolean = false,
    val robotIP: String = "192.168.144.3",
    val navIP: String = "192.168.144.3",
    val mapPath: String = "/home/jetson/linx/data/map"
)
