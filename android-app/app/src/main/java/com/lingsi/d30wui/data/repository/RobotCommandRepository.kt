package com.lingsi.d30wui.data.repository

import com.lingsi.d30wui.data.model.CommandLog

interface RobotCommandRepository {
    fun send(log: CommandLog)
}
