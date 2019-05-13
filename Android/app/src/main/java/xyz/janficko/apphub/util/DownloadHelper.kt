package xyz.janficko.apphub.util

import android.app.DownloadManager
import android.content.Context
import android.net.Uri
import android.os.Environment
import xyz.janficko.apphub.common.Constants
import xyz.janficko.apphub.ui.AppHub
import kotlin.contracts.ExperimentalContracts

@ExperimentalContracts
object DownloadHelper {

    fun downloadFile(artifactName : String, url : String, token: String) {
        val context = AppHub.instance

        val uri = Uri.parse(url)
        val request : DownloadManager.Request = DownloadManager.Request(uri)

        request.apply {
            addRequestHeader(Constants.AUTHORIZATION_HEADER, token)
            addRequestHeader(Constants.DEVICE_INFO_HEADER, Constants.DEVICE_DESCRIPTION)
            setTitle(artifactName)
            setDescription(artifactName)
            setMimeType("application/vnd.android.package-archive")
            allowScanningByMediaScanner()
            setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, artifactName)
            setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
        }
        val dm = context.getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager

        dm.enqueue(request)
    }

}