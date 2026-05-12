package com.lingsi.d30wui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.compose.*
import com.lingsi.d30wui.ui.screens.FollowModeScreen
import com.lingsi.d30wui.ui.screens.MainControlScreen

@Composable
fun AppNavGraph(){
    val nav = rememberNavController()
    NavHost(navController = nav, startDestination = Routes.MAIN_CONTROL){
        composable(Routes.MAIN_CONTROL){ MainControlScreen(onNavigateFollow = { nav.navigate(Routes.FOLLOW_MODE) }) }
        composable(Routes.FOLLOW_MODE){ FollowModeScreen(onBack = { nav.popBackStack() }) }
    }
}
