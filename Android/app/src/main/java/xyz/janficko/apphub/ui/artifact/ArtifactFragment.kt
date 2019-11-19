package xyz.janficko.apphub.ui.artifact

import android.annotation.SuppressLint
import android.app.DownloadManager
import android.os.Bundle
import android.view.View
import androidx.recyclerview.widget.LinearLayoutManager
import kotlinx.android.synthetic.main.activity_main.*
import kotlinx.android.synthetic.main.fragment_artifact.*
import org.koin.androidx.viewmodel.ext.sharedViewModel
import org.koin.androidx.viewmodel.ext.viewModel
import xyz.janficko.apphub.R
import xyz.janficko.apphub.common.ErrorCodes
import xyz.janficko.apphub.ui.base.BaseViewModelFragment
import xyz.janficko.apphub.ui.main.MainViewModel
import kotlin.contracts.ExperimentalContracts
import android.content.Intent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.IntentFilter
import android.os.Environment
import java.io.File
import android.net.Uri
import android.os.Build
import androidx.core.content.FileProvider.getUriForFile
import xyz.janficko.apphub.BuildConfig

@SuppressLint("ValidFragment")
@ExperimentalContracts
class ArtifactFragment :
    BaseViewModelFragment<ArtifactState, ArtifactViewModel>(),
    View.OnClickListener {

    override val viewmodel : ArtifactViewModel by viewModel()
    private val sharedviewmodel: MainViewModel by sharedViewModel()

    private lateinit var artifactName: String

    override val layoutResId: Int = R.layout.fragment_artifact

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        viewmodel.showArtifacts(sharedviewmodel.jobId)

        baseActivity?.iv_back?.setOnClickListener(this)

        rv_artifact.layoutManager = LinearLayoutManager(context)

        baseActivity?.registerReceiver(onComplete, IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE))
    }

    override fun onDestroy() {
        super.onDestroy()

        baseActivity?.unregisterReceiver(onComplete);
    }

    override fun processRenderState(renderState: ArtifactState) {
        when (renderState) {
            is ArtifactState.ShowArtifacts -> showArtifacts(renderState.outputs)
        }
    }

    override fun showError(errorCode: Int) {
        super.showError(errorCode)

        when (errorCode) {
            ErrorCodes.TOKEN_EXPIRED -> {
                sharedviewmodel.openLoginFragment()
            }
            else -> baseActivity?.showUnknownError()
        }
    }

    override fun onClick(view: View?) {
        sharedviewmodel.openJobFragment()
    }

    private fun showArtifacts(outputs : List<String>) {
        baseActivity?.tv_title?.text = sharedviewmodel.projectName

        if (outputs.isNotEmpty()) {
            baseActivity?.tv_error?.visibility = View.GONE
            cl_container_artifacts.visibility = View.VISIBLE

            rv_artifact.visibility = View.VISIBLE
            rv_artifact.adapter = ArtifactAdapter(outputs) {

                artifactName = it.split("/")[1]
                viewmodel.downloadApk(sharedviewmodel.jobId, it)
            }
        } else {
            baseActivity?.tv_error?.visibility = View.VISIBLE
            baseActivity?.tv_error?.text = getString(R.string.error_no_artifacts)
            cl_container_artifacts.visibility = View.GONE

            rv_artifact.visibility = View.GONE
        }
    }

    private var onComplete: BroadcastReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            context?.let {
                val toInstall = File(Environment.DIRECTORY_DOWNLOADS, artifactName)
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                    val newFile = File(Environment.getExternalStorageDirectory(), "${Environment.DIRECTORY_DOWNLOADS}/$artifactName")
                    val apkUri = getUriForFile(it, BuildConfig.APPLICATION_ID + ".provider", newFile)
                    val intent = Intent(Intent.ACTION_INSTALL_PACKAGE)
                    intent.data = apkUri
                    intent.flags = Intent.FLAG_GRANT_READ_URI_PERMISSION
                    it.startActivity(intent)
                } else {
                    val apkUri = Uri.fromFile(toInstall)
                    val intent = Intent(Intent.ACTION_VIEW)
                    intent.setDataAndType(apkUri, "application/vnd.android.package-archive")
                    intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
                    it.startActivity(intent)
                }
            }


        }

    }

}