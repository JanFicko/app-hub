package xyz.janficko.apphub.util

import android.util.Log
import com.google.gson.GsonBuilder
import com.google.gson.JsonParser
import com.google.gson.JsonSyntaxException
import okhttp3.logging.HttpLoggingInterceptor
import xyz.janficko.apphub.BuildConfig

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

class ApiLogger : HttpLoggingInterceptor.Logger {

    companion object {
        fun printMessage(logName: String, message: String) {
            if (message.startsWith("{") || message.startsWith("[")) {
                try {
                    val json = GsonBuilder().setPrettyPrinting().create().toJson(JsonParser().parse(message))
                    printVerbose(logName, json)
                } catch (ex: JsonSyntaxException) {
                    printError(logName, message)
                }
            } else {
                printVerbose(logName, message)
            }
        }
    }

    override fun log(message: String) {
        printMessage(ApiLogger::class.java.simpleName, message)
    }
}