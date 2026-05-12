package com.lingsi.d30wui.ui.components
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
@Composable fun JoystickControl(label:String,onSend:(Float,Float)->Unit){ Button(onClick={onSend(0.5f,0.5f)}){ Text(label) } }
