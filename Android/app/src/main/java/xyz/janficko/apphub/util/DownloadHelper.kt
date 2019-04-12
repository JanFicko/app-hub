package xyz.janficko.apphub.util

import android.app.DownloadManager
import android.content.Context
import android.net.Uri
import android.os.Environment
import android.webkit.URLUtil
import xyz.janficko.apphub.common.Constants
import xyz.janficko.apphub.ui.AppHub
import kotlin.contracts.ExperimentalContracts

@ExperimentalContracts
object DownloadHelper {

    fun downloadFile(artifactName : String, url : String, downloadPassword : String) {
        val context = AppHub.instance

        val uri = Uri.parse(url)
        val request : DownloadManager.Request = DownloadManager.Request(uri)

        request.apply {
            addRequestHeader(Constants.DOWNLOAD_PASSWORD_HEADER, downloadPassword)
            setMimeType("application/vnd.android.package-archive")
            allowScanningByMediaScanner()
            setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, artifactName)
            setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
        }
        val dm = context.getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager

        dm.enqueue(request)
    }

}