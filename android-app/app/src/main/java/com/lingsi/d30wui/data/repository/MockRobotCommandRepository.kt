package com.lingsi.d30wui.data.repository

import com.lingsi.d30wui.data.model.CommandLog

class MockRobotCommandRepository : RobotCommandRepository {
    private val _logs = mutableListOf<CommandLog>()
    val logs: List<CommandLog> get() = _logs.toList()
    override fun send(log: CommandLog) { _logs.add(0, log) }
}
