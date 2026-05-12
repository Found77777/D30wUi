package com.lingsi.d30wui.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable

@Composable
fun D30Theme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        typography = AppTypography,
        content = content
    )
}
