package com.lingsi.d30wui

import android.content.pm.ActivityInfo
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import com.lingsi.d30wui.navigation.AppNavGraph
import com.lingsi.d30wui.ui.theme.D30Theme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE
        setContent { D30Theme { AppNavGraph() } }
    }
}
