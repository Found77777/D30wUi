package com.lingsi.d30wui.ui.components
import androidx.compose.runtime.Composable
import androidx.compose.material3.*
import androidx.compose.foundation.layout.Column
@Composable fun ActionPicker(actions:List<String>, selected:String, onSelect:(String)->Unit){ Column { Text("动作:$selected"); actions.forEach{ Button(onClick={onSelect(it)}){Text(it)} } } }
