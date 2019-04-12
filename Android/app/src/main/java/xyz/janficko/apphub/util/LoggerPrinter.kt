package xyz.janficko.apphub.util

import android.util.Log
import xyz.janficko.apphub.BuildConfig

object LoggerPrinter {

    private var DO_PRINT_LOG : Boolean = BuildConfig.DEBUG

    fun printVerbose(TAG: String, message: String) {
        if (!DO_PRINT_LOG) return
        Log.v(TAG, message)
    }

    fun printError(TAG: String, message: String) {
        if (!DO_PRINT_LOG) return
        Log.e(TAG, message)
    }

    fun printWarning(TAG: String, message: String) {
        if (!DO_PRINT_LOG) return
        Log.w(TAG, message)
    }

    fun setPrintLog(printLog: Boolean) {
        DO_PRINT_LOG = printLog
    }
}