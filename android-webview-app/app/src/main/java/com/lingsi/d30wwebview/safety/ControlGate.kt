package com.lingsi.d30wwebview.safety

class ControlGate {
    var connected: Boolean = true
    var diagnosticError: Boolean = false

    fun allowEmergency(): Boolean = true

    fun allowNormalCommand(): Pair<Boolean, String?> {
        if (!connected) return false to "disconnected"
        if (diagnosticError) return false to "diagnostic_error"
        return true to null
    }
}
