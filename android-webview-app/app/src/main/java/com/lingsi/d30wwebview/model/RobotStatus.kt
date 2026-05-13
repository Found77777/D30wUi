package com.lingsi.d30wwebview.model

data class RobotStatus(
    val battery: Int = 73,
    val speed: Float = 0f,
    val state: String = "standby",
    val diagnosticStatus: String = "normal"
)
