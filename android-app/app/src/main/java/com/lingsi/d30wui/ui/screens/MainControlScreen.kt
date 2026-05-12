package com.lingsi.d30wui.ui.screens
import androidx.compose.runtime.*
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.lingsi.d30wui.ui.components.*

@Composable
fun MainControlScreen(onNavigateFollow:()->Unit){
    val vm: MainControlViewModel = viewModel()
    val ui by vm.ui.collectAsState()
    val actions = listOf("标准站立","低姿态行走","稳定支撑","贴地模式","越障模式")
    Column(Modifier.fillMaxSize().padding(12.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
        RobotStatusBar(ui.robotStatus)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)){
            Button(onClick={vm.toggleConnection()}){Text("连接:${ui.connection}")}
            Button(onClick={vm.toggleDiagnostic()}){Text("诊断:${ui.robotStatus.diagnosticStatus}")}
            Button(onClick={vm.toggleMapMode()}){Text(if(ui.mapMode)"切摄像头" else "切地图")}
            Button(onClick={vm.openSettings(true)}){Text("设置")}
            EmergencyStopButton{vm.emergencyStop()}
            Button(onClick={vm.showExit(true)}){Text("退出")}
            Button(onClick=onNavigateFollow){Text("跟随模式")}
        }
        CameraMapBackground(ui.mapMode)
        MapOverlay(ui.mapOverlayVisible)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            JoystickControl("左摇杆-移动"){x,y-> vm.move(x,y)}
            JoystickControl("右摇杆-方向"){x,y-> vm.direction(x,y)}
        }
        ModeGroup("速度", listOf("慢速","标准","快速"), ui.speedMode, vm::setSpeedMode)
        ModeGroup("运动模式", listOf("轻松","标准","稳定"), ui.movementMode, vm::setMovementMode)
        Row { Button(onClick={vm.setPosture("standing")}){Text("站立")}; Spacer(Modifier.width(8.dp)); Button(onClick={vm.setPosture("crawling")}){Text("匍匐")} }
        ActionPicker(actions, ui.selectedAction, vm::setAction)
        CommandLogPanel(ui.logs)
    }
    SettingsSheet(ui.settingsOpen, ui.settings, onClose={vm.openSettings(false)}, onToggle={vm.settingsAction(it)}, onAction={vm.settingsAction(it)})
    ExitConfirmDialog(ui.exitDialogOpen, onDismiss={vm.showExit(false)}, onConfirm={vm.showExit(false)})
}
