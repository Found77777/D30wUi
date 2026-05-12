package com.lingsi.d30wui.data.model

data class FollowModeState(
    val mode: String = "manual",
    val status: String = "idle",
    val distance: Float = 2f,
    val speed: String = "medium"
)
