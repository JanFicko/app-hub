package xyz.janficko.apphub.ui.artifact

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import org.koin.core.inject
import xyz.janficko.apphub.BuildConfig
import xyz.janficko.apphub.common.Constants
import xyz.janficko.apphub.common.Keys
import xyz.janficko.apphub.data.local.shared_preferences.SharedPreferencesContract
import xyz.janficko.apphub.data.remote.request.GetArtifactsRequest
import xyz.janficko.apphub.data.remote.request.GetProjectsRequest
import xyz.janficko.apphub.data.remote.response.GetArtifactsResponse
import xyz.janficko.apphub.data.remote.response.GetProjectsResponse
import xyz.janficko.apphub.domain.remote.ProjectUseCase
import xyz.janficko.apphub.model.User
import xyz.janficko.apphub.ui.AppHub
import xyz.janficko.apphub.ui.base.BaseViewModel
import xyz.janficko.apphub.ui.dashboard.DashboardState
import xyz.janficko.apphub.util.DownloadHelper
import xyz.janficko.apphub.util.LoggerPrinter
import kotlin.contracts.ExperimentalContracts

/**
Created by Jan Ficko on 05/04/19 for Margento.
 */

@ExperimentalContracts
class ArtifactViewModel constructor(
    appHub: AppHub,
    private val projectUseCase: ProjectUseCase
) : BaseViewModel<ArtifactState>(appHub) {

    private val sharedPreferences: SharedPreferencesContract by inject()
    private lateinit var downloadHelper : DownloadHelper

    fun showArtifacts(jobId : Int) {
        getDataFromWeb(
            projectUseCase.getArtifacts(
                sharedPreferences.getString(Keys.PREF_TOKEN, ""),
                GetArtifactsRequest(jobId)
            ),
            object : BaseViewModel<ArtifactState>.RemoteRepositoryCallback<GetArtifactsResponse>() {
                override fun onSuccess(body: GetArtifactsResponse) {
                    postScreenState(ArtifactState.ShowArtifacts(body.outputs))
                }

                override fun onLoadIndicator(active: Boolean) {
                    postScreenLoader(active)
                }

                override fun onError(code: Int) {
                    postScreenState(ArtifactState.ShowArtifacts(ArrayList()))
                }
            }
        )
    }

    fun downloadApk(jobId : Int, output : String) {
        if (!::downloadHelper.isInitialized) {
            downloadHelper = DownloadHelper
        }
        launch(Dispatchers.IO) {

            val splitOutput = output.split("/")

            val user = sharedPreferences.getObject(Keys.PREF_USER, User::class.java)
            val downloadUrl = BuildConfig.SERVICE_URL + Constants.DOWNLOAD_PREFIX + jobId + "/" + user._id + "/" + splitOutput[0]

            downloadHelper.downloadFile(splitOutput[1], downloadUrl, "")

        }
    }

}