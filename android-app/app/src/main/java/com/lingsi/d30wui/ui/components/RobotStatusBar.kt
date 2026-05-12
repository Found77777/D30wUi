package com.lingsi.d30wui.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.lingsi.d30wui.data.model.RobotStatus

@Composable
fun RobotStatusBar(status: RobotStatus) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text("电池 ${status.battery}%")
        Text("速度 %.1f m/s".format(status.speed))
    }
}
