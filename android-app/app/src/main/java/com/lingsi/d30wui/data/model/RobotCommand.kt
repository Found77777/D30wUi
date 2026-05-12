package com.lingsi.d30wui.data.model

enum class CommandResult { MOCK_SENT, BLOCKED, FAILED }

data class CommandLog(
    val commandType: String,
    val payload: String,
    val timestamp: Long,
    val result: CommandResult,
    val reason: String? = null
)
