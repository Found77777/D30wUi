package com.lingsi.d30wwebview.model

data class RobotCommand(
    val type: String,
    val payload: String,
    val timestamp: Long = System.currentTimeMillis()
)
