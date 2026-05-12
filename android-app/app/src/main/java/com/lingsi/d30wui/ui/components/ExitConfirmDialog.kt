package com.lingsi.d30wui.ui.components
import androidx.compose.runtime.Composable
import androidx.compose.material3.*
@Composable fun ExitConfirmDialog(show:Boolean,onDismiss:()->Unit,onConfirm:()->Unit){ if(show) AlertDialog(onDismissRequest=onDismiss,confirmButton={Button(onClick=onConfirm){Text("确认退出")}},dismissButton={Button(onClick=onDismiss){Text("取消")}},title={Text("确认退出控制？")}) }
