package com.lingsi.d30wui.ui.components
import androidx.compose.runtime.Composable
import androidx.compose.material3.*
@Composable fun EmergencyStopButton(onClick:()->Unit){ Button(onClick=onClick, colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error)){ Text("急停") } }
