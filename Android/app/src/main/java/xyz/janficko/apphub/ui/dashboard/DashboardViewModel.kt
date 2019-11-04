package xyz.janficko.apphub.ui.dashboard

import org.koin.core.inject
import xyz.janficko.apphub.common.ErrorCodes
import xyz.janficko.apphub.common.Keys
import xyz.janficko.apphub.data.local.shared_preferences.SharedPreferencesContract
import xyz.janficko.apphub.data.remote.request.GetProjectsRequest
import xyz.janficko.apphub.data.remote.response.GetProjectsResponse
import xyz.janficko.apphub.domain.remote.ProjectUseCase
import xyz.janficko.apphub.model.User
import xyz.janficko.apphub.AppHub
import xyz.janficko.apphub.ui.base.BaseViewModel
import kotlin.contracts.ExperimentalContracts

@ExperimentalContracts
class DashboardViewModel constructor(
    appHub: AppHub,
    private val projectUseCase: ProjectUseCase,
    private val sharedPreferences: SharedPreferencesContract
) : BaseViewModel<DashboardState>(appHub) {

    init {
        getProjects()
    }

    fun getProjects() {
        val user : User = sharedPreferences.getObject(Keys.PREF_USER, User::class.java)

        getDataFromWeb(
            projectUseCase.getProjects(
                GetProjectsRequest(user._id)
            ),
            object : BaseViewModel<DashboardState>.RemoteRepositoryCallback<GetProjectsResponse>() {
                override fun onSuccess(body: GetProjectsResponse) {
                    postScreenState(DashboardState.ShowProjects(body.projects))
                }
            }
        )
    }

}