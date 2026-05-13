package com.lingsi.d30wwebview.safety

class CommandThrottle(private val hz: Int = 10) {
    private val minIntervalMs = 1000L / hz
    private var lastTs: Long = 0
    fun allow(now: Long = System.currentTimeMillis()): Boolean {
        if (now - lastTs < minIntervalMs) return false
        lastTs = now
        return true
    }
}
