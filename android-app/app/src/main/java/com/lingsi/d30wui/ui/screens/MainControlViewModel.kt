package com.lingsi.d30wui.ui.screens

import androidx.lifecycle.ViewModel
import com.lingsi.d30wui.data.model.*
import com.lingsi.d30wui.data.repository.MockRobotCommandRepository
import com.lingsi.d30wui.domain.command.buildCommandLog
import com.lingsi.d30wui.domain.state.ConnectionState
import com.lingsi.d30wui.domain.state.ControlUiState
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class MainControlViewModel: ViewModel() {
    private val repo = MockRobotCommandRepository()
    private val _ui = MutableStateFlow(ControlUiState())
    val ui: StateFlow<ControlUiState> = _ui.asStateFlow()

    private fun log(type:String,payload:String){
        val l = buildCommandLog(type,payload,_ui.value)
        repo.send(l)
        _ui.value = _ui.value.copy(logs = repo.logs)
    }

    fun toggleMapMode(){ _ui.value = _ui.value.copy(mapMode = !_ui.value.mapMode) }
    fun openSettings(v:Boolean){ _ui.value = _ui.value.copy(settingsOpen = v) }
    fun showMapOverlay(v:Boolean){ _ui.value = _ui.value.copy(mapOverlayVisible = v) }
    fun showExit(v:Boolean){ _ui.value = _ui.value.copy(exitDialogOpen = v) }
    fun move(x:Float,y:Float)=log("movement","x=$x,y=$y")
    fun direction(x:Float,y:Float)=log("direction","x=$x,y=$y")
    fun emergencyStop()=log("emergency_stop","{}")
    fun setSpeedMode(i:Int){ val t= if(i==2) "speed_mode_fast" else "speed_mode"; log(t,"$i"); _ui.value=_ui.value.copy(speedMode=i)}
    fun setMovementMode(i:Int){ log("movement_mode","$i"); _ui.value=_ui.value.copy(movementMode=i)}
    fun setPosture(p:String){ log("posture","$p"); _ui.value=_ui.value.copy(posture=p)}
    fun setAction(a:String){ val t = if(a=="越障模式") "action_obstacle" else "action"; log(t,a); _ui.value=_ui.value.copy(selectedAction=a)}
    fun toggleConnection(){ _ui.value=_ui.value.copy(connection = if(_ui.value.connection==ConnectionState.CONNECTED) ConnectionState.DISCONNECTED else ConnectionState.CONNECTED)}
    fun toggleDiagnostic(){ val next = if(_ui.value.robotStatus.diagnosticStatus=="normal") "error" else "normal"; _ui.value=_ui.value.copy(robotStatus=_ui.value.robotStatus.copy(diagnosticStatus=next)) }
    fun settingsAction(name:String){ log(name, "{}") }
    fun followIntent(type:String,payload:String){ log(type,payload) }
}
