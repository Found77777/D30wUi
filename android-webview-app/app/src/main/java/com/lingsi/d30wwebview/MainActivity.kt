package com.lingsi.d30wwebview

import android.annotation.SuppressLint
import android.os.Bundle
import android.util.Log
import android.webkit.ConsoleMessage
import android.webkit.WebResourceRequest
import android.webkit.WebResourceError
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity
import com.lingsi.d30wwebview.bridge.AndroidRobotBridge
import com.lingsi.d30wwebview.sdk.MockRobotSdkAdapter
import com.lingsi.d30wwebview.safety.CommandThrottle
import com.lingsi.d30wwebview.safety.CommandWatchdog
import com.lingsi.d30wwebview.safety.ControlGate

class MainActivity : AppCompatActivity() {
    companion object {
        private const val TAG = "MainActivity"
    }

    private lateinit var webView: WebView

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
            override fun onConsoleMessage(consoleMessage: ConsoleMessage?): Boolean {
                val message = consoleMessage?.message().orEmpty()
                val source = consoleMessage?.sourceId().orEmpty()
                val line = consoleMessage?.lineNumber() ?: -1
                Log.d(TAG, "WebView console: $message ($source:$line)")
                return super.onConsoleMessage(consoleMessage)
            }
        }

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url?.toString().orEmpty()
                return !url.startsWith("file:///android_asset/")
            }

            override fun onReceivedError(
                view: WebView?,
                request: WebResourceRequest?,
                error: WebResourceError?
            ) {
                val url = request?.url?.toString().orEmpty()
                val code = error?.errorCode ?: -1
                val description = error?.description?.toString().orEmpty()
                Log.e(TAG, "WebView error: code=$code url=$url desc=$description")
                super.onReceivedError(view, request, error)
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                Log.i(TAG, "WebView page finished: ${url.orEmpty()}")
                super.onPageFinished(view, url)
            }
        }

        val sdk = MockRobotSdkAdapter()
        val gate = ControlGate()
        val throttle = CommandThrottle(10)
        val watchdog = CommandWatchdog(300) { sdk.stopMovement("watchdog_timeout") }
        val bridge = AndroidRobotBridge(webView, sdk, gate, throttle, watchdog)

        webView.addJavascriptInterface(bridge, "AndroidRobot")
        webView.loadUrl("file:///android_asset/webapp/index.html#/")
    }
}
