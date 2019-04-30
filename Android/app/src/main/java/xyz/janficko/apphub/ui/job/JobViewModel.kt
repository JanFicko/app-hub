package xyz.janficko.apphub.ui.job

import org.koin.core.inject
import xyz.janficko.apphub.common.Keys
import xyz.janficko.apphub.data.local.shared_preferences.SharedPreferencesContract
import xyz.janficko.apphub.data.remote.request.GetJobsRequest
import xyz.janficko.apphub.data.remote.response.GetJobsResponse
import xyz.janficko.apphub.domain.remote.ProjectUseCase
import xyz.janficko.apphub.model.User
import xyz.janficko.apphub.ui.AppHub
import xyz.janficko.apphub.ui.base.BaseViewModel
import kotlin.contracts.ExperimentalContracts

@ExperimentalContracts
class JobViewModel constructor(
    appHub: AppHub,
    private val projectUseCase: ProjectUseCase
) : BaseViewModel<JobState>(appHub) {

    private val sharedPreferences: SharedPreferencesContract by inject()

    fun getJobs(projectId : Int) {
        val user : User = sharedPreferences.getObject(Keys.PREF_USER, User::class.java)

        getDataFromWeb(
            projectUseCase.getJobs(
                sharedPreferences.getString(Keys.PREF_TOKEN, ""),
                GetJobsRequest(
                    projectId,
                    user._id
                )
            ),
            object : BaseViewModel<JobState>.RemoteRepositoryCallback<GetJobsResponse>() {
                override fun onSuccess(body: GetJobsResponse) {
                    postScreenState(JobState.ShowJobs(body.project))
                }

                override fun onLoadIndicator(active: Boolean) {
                    postScreenLoader(active)
                }

                override fun onError(code: Int) {
                    postScreenState(JobState.ShowError(code))
                }
            }
        )
    }

}