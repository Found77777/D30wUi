package com.lingsi.d30wui.ui.screens
import androidx.compose.runtime.*
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel

@Composable
fun FollowModeScreen(onBack:()->Unit){
    val vm: MainControlViewModel = viewModel()
    val ui by vm.ui.collectAsState()
    var mode by remember { mutableStateOf(ui.follow.mode) }
    var status by remember { mutableStateOf(ui.follow.status) }
    var distance by remember { mutableStateOf(ui.follow.distance) }
    var speed by remember { mutableStateOf(ui.follow.speed) }
    Column(Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Button(onClick=onBack){ Text("返回主控制页") }
        Row{ Text("模式:"); FilterChip(selected=mode=="manual",onClick={mode="manual"},label={Text("手动")}); FilterChip(selected=mode=="auto",onClick={mode="auto"},label={Text("自动")}) }
        Button(onClick={ status="following"; vm.followIntent("follow_start","mode=$mode,distance=$distance,speed=$speed") }, enabled = mode=="auto" && status!="following"){ Text("开始跟随") }
        Button(onClick={ status="idle"; vm.followIntent("follow_stop","{}") }, enabled = status=="following"){ Text("停止跟随") }
        Text("跟随距离: %.1f m".format(distance)); Slider(value=distance,onValueChange={distance=it; vm.followIntent("follow_update_config","distance=$it")},valueRange=0.5f..5f)
        Row{ listOf("slow" to "慢","medium" to "中","fast" to "快").forEach{ (k,v)-> FilterChip(selected=speed==k,onClick={speed=k; vm.followIntent("follow_update_config","speed=$k")},label={Text(v)}) } }
        Text("当前跟随状态: "+ when(status){"idle"->"未启动";"following"->"跟随中";else->"目标丢失"})
    }
}
