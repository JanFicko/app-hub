package xyz.janficko.apphub.ui.artifact

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import org.koin.core.inject
import xyz.janficko.apphub.BuildConfig
import xyz.janficko.apphub.common.Constants
import xyz.janficko.apphub.common.ErrorCodes
import xyz.janficko.apphub.common.Keys
import xyz.janficko.apphub.data.local.shared_preferences.SharedPreferencesContract
import xyz.janficko.apphub.data.remote.request.GetArtifactsRequest
import xyz.janficko.apphub.data.remote.response.GetArtifactsResponse
import xyz.janficko.apphub.domain.remote.ProjectUseCase
import xyz.janficko.apphub.model.User
import xyz.janficko.apphub.AppHub
import xyz.janficko.apphub.ui.base.BaseViewModel
import xyz.janficko.apphub.util.downloadFile
import kotlin.contracts.ExperimentalContracts

@ExperimentalContracts
class ArtifactViewModel constructor(
    appHub: AppHub,
    private val projectUseCase: ProjectUseCase
) : BaseViewModel<ArtifactState>(appHub) {

    private val sharedPreferences: SharedPreferencesContract by inject()

    fun showArtifacts(jobId : Int) {
        getDataFromWeb(
            projectUseCase.getArtifacts(
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

                override fun noToken() {
                    postScreenState(ArtifactState.ShowError(ErrorCodes.TOKEN_EXPIRED))
                }
            }
        )
    }

    fun downloadApk(jobId : Int, output : String) {
        launch(Dispatchers.IO) {

            val splitOutput = output.split("/")

            val user = sharedPreferences.getObject(Keys.PREF_USER, User::class.java)
            val downloadUrl = BuildConfig.SERVICE_URL + Constants.DOWNLOAD_PREFIX + jobId + "/" + user._id + "/" + splitOutput[0]

            downloadFile(splitOutput[1], downloadUrl, sharedPreferences.getString(Keys.PREF_TOKEN, ""))

        }
    }

}