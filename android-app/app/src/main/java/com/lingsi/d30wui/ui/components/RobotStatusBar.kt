package com.lingsi.d30wui.ui.components
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.foundation.layout.*
import com.lingsi.d30wui.data.model.RobotStatus
@Composable fun RobotStatusBar(status: RobotStatus){ Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween){ Text("电池 ${status.battery}%"); Text("速度 %.1f m/s".format(status.speed)); Text("运行 ${status.state}"); Text("诊断 ${status.diagnosticStatus}") } }
