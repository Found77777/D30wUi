package com.lingsi.d30wui.ui.components
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.unit.dp
@Composable fun CameraMapBackground(isMap:Boolean){ Surface(tonalElevation = 2.dp){ Text(if(isMap)"地图 Mock 背景" else "摄像头 Mock 背景") } }
