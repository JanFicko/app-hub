package xyz.janficko.apphub.common

import android.os.Build

object Constants {
    val DEVICE_DESCRIPTION = "Android " + Build.VERSION.SDK_INT + "/" + Build.MANUFACTURER + " " + Build.MODEL

    const val SPLASH_WAIT_SECONDS : Long = 1
    const val CONNECTION_TIMEOUT : Long = 10

    const val SHARED_PREF = "SHARED_PREFERENCES"

    const val DOWNLOAD_PREFIX = "api/projects/download/"
    const val DOWNLOAD_PASSWORD_HEADER = "DownloadPassword"
}