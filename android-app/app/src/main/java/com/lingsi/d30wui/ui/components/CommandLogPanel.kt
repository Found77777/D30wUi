package com.lingsi.d30wui.ui.components
import androidx.compose.runtime.Composable
import androidx.compose.foundation.layout.Column
import androidx.compose.material3.Text
import com.lingsi.d30wui.data.model.CommandLog
@Composable fun CommandLogPanel(logs: List<CommandLog>){ Column { Text("命令日志"); logs.take(8).forEach{ Text("${it.commandType} | ${it.result} | ${it.reason ?: "OK"}") } } }
