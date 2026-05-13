package com.lingsi.d30wwebview.safety

import android.os.Handler
import android.os.Looper

class CommandWatchdog(
    private val timeoutMs: Long = 300,
    private val onTimeoutStop: () -> Unit
) {
    private val handler = Handler(Looper.getMainLooper())
    private val runnable = Runnable { onTimeoutStop() }

    fun heartbeat() {
        handler.removeCallbacks(runnable)
        handler.postDelayed(runnable, timeoutMs)
    }

    fun stop() {
        handler.removeCallbacks(runnable)
    }
}
