package com.lingsi.d30wwebview

import android.annotation.SuppressLint
import android.os.Bundle
import android.util.Log
import android.webkit.ConsoleMessage
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity
import com.lingsi.d30wwebview.bridge.AndroidRobotBridge
import com.lingsi.d30wwebview.sdk.MockRobotSdkAdapter
import com.lingsi.d30wwebview.safety.CommandThrottle
import com.lingsi.d30wwebview.safety.CommandWatchdog
import com.lingsi.d30wwebview.safety.ControlGate

class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView
    private val tag = "WebViewHost"

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        webView = WebView(this)
        setContentView(webView)

        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
        webView.settings.allowFileAccess = true
        webView.settings.allowContentAccess = false

        webView.webChromeClient = object : WebChromeClient() {
            override fun onConsoleMessage(consoleMessage: ConsoleMessage): Boolean {
                Log.d(tag, "console: ${consoleMessage.message()} @${consoleMessage.lineNumber()} ${consoleMessage.sourceId()}")
                return true
            }
        }

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url?.toString().orEmpty()
                return !url.startsWith("file:///android_asset/")
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                Log.i(tag, "onPageFinished: $url")
                super.onPageFinished(view, url)
            }

            override fun onReceivedError(
                view: WebView?,
                request: WebResourceRequest?,
                error: WebResourceError?
            ) {
                Log.e(tag, "onReceivedError: url=${request?.url} code=${error?.errorCode} desc=${error?.description}")
                super.onReceivedError(view, request, error)
            }
        }

        val sdk = MockRobotSdkAdapter()
        val gate = ControlGate()
        val throttle = CommandThrottle(10)
        val watchdog = CommandWatchdog(300) { sdk.stopMovement("watchdog_timeout") }
        val bridge = AndroidRobotBridge(webView, sdk, gate, throttle, watchdog)

        webView.addJavascriptInterface(bridge, "AndroidRobot")
        // Load hash route entry for file:// WebView compatibility
        webView.loadUrl("file:///android_asset/webapp/index.html#/")
    }
}
