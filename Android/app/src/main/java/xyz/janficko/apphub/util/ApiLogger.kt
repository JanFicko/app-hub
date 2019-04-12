package xyz.janficko.apphub.util

import com.google.gson.GsonBuilder
import com.google.gson.JsonParser
import com.google.gson.JsonSyntaxException
import okhttp3.logging.HttpLoggingInterceptor

class ApiLogger : HttpLoggingInterceptor.Logger {

    companion object {
        fun printMessage(logName: String, message: String) {
            if (message.startsWith("{") || message.startsWith("[")) {
                try {
                    val json = GsonBuilder().setPrettyPrinting().create().toJson(JsonParser().parse(message))
                    LoggerPrinter.printVerbose(logName, json)
                } catch (ex: JsonSyntaxException) {
                    LoggerPrinter.printError(logName, message)
                }
            } else {
                LoggerPrinter.printVerbose(logName, message)

            }
        }
    }

    override fun log(message: String) {
        printMessage(ApiLogger::class.java.simpleName, message)
    }
}