package xyz.janficko.apphub.ui.job

import org.koin.core.inject
import xyz.janficko.apphub.common.ErrorCodes
import xyz.janficko.apphub.common.Keys
import xyz.janficko.apphub.data.local.shared_preferences.SharedPreferencesContract
import xyz.janficko.apphub.data.remote.request.GetJobsRequest
import xyz.janficko.apphub.data.remote.response.GetJobsResponse
import xyz.janficko.apphub.domain.remote.ProjectUseCase
import xyz.janficko.apphub.model.User
import xyz.janficko.apphub.AppHub
import xyz.janficko.apphub.ui.base.BaseViewModel
import kotlin.contracts.ExperimentalContracts

@ExperimentalContracts
class JobViewModel constructor(
    appHub: AppHub,
    private val projectUseCase: ProjectUseCase,
    private val sharedPreferences: SharedPreferencesContract
) : BaseViewModel<JobState>(appHub) {

    fun getJobs(projectId : Int) {
        val user : User = sharedPreferences.getObject(Keys.PREF_USER, User::class.java)

        getDataFromWeb(
            projectUseCase.getJobs(
                GetJobsRequest(
                    projectId,
                    user._id
                )
            ),
            object : BaseViewModel<JobState>.RemoteRepositoryCallback<GetJobsResponse>() {
                override fun onSuccess(body: GetJobsResponse) {
                    postScreenState(JobState.ShowJobs(body.project))
                }
            }
        )
    }

}