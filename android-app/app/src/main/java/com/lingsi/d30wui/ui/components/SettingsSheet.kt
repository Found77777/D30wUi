package com.lingsi.d30wui.ui.components
import androidx.compose.runtime.Composable
import androidx.compose.material3.*
import androidx.compose.foundation.layout.Column
import com.lingsi.d30wui.data.model.RobotSettings
@Composable fun SettingsSheet(show:Boolean, settings:RobotSettings, onClose:()->Unit, onToggle:(String)->Unit, onAction:(String)->Unit){ if(show){ Column { Text("设置"); listOf("AI辅助","地图显示","自动充电","自动脱离充电","SDK开关","云台开启","建图导航","离线地图管理").forEach{ Button(onClick={ if(it.contains("充电")||it.contains("导航")||it.contains("管理")) onAction(it) else onToggle(it) }){Text(it)} }; Text("robotIP:${settings.robotIP}"); Text("navIP:${settings.navIP}"); Text("mapPath:${settings.mapPath}"); Button(onClick=onClose){Text("关闭")} } } }
