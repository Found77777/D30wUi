package com.lingsi.d30wui.ui.components
import androidx.compose.runtime.Composable
import androidx.compose.material3.*
import androidx.compose.foundation.layout.Row
@Composable fun ModeGroup(title:String, options:List<String>, selected:Int, onSelect:(Int)->Unit){ Row { Text("$title: "); options.forEachIndexed { i, s -> FilterChip(selected=i==selected,onClick={onSelect(i)},label={Text(s)}) } } }
