package xyz.janficko.apphub.ui.dashboard

import org.koin.androidx.viewmodel.ext.sharedViewModel
import org.koin.androidx.viewmodel.ext.viewModel
import org.koin.core.KoinComponent
import org.koin.core.inject
import xyz.janficko.apphub.common.ErrorCodes
import xyz.janficko.apphub.common.Keys
import xyz.janficko.apphub.data.local.shared_preferences.SharedPreferencesContract
import xyz.janficko.apphub.data.remote.request.GetProjectsRequest
import xyz.janficko.apphub.data.remote.response.GetProjectsResponse
import xyz.janficko.apphub.domain.remote.ProjectUseCase
import xyz.janficko.apphub.model.User
import xyz.janficko.apphub.ui.AppHub
import xyz.janficko.apphub.ui.base.BaseViewModel
import xyz.janficko.apphub.ui.login.LoginState
import xyz.janficko.apphub.ui.main.MainState
import xyz.janficko.apphub.ui.main.MainViewModel
import xyz.janficko.apphub.util.LoggerPrinter
import kotlin.contracts.ExperimentalContracts

/**
Created by Jan Ficko on 02/04/19 for Margento.
 */

@ExperimentalContracts
class DashboardViewModel constructor(
    appHub: AppHub,
    private val projectUseCase: ProjectUseCase
) : BaseViewModel<DashboardState>(appHub) {

    private val sharedPreferences: SharedPreferencesContract by inject()

    init {
        getProjects()
    }

    fun getProjects() {
        val user : User = sharedPreferences.getObject(Keys.PREF_USER, User::class.java)

        getDataFromWeb(
            projectUseCase.getProjects(
                sharedPreferences.getString(Keys.PREF_TOKEN, ""),
                GetProjectsRequest(user._id)
            ),
            object : BaseViewModel<DashboardState>.RemoteRepositoryCallback<GetProjectsResponse>() {
                override fun onSuccess(body: GetProjectsResponse) {
                    postScreenState(DashboardState.ShowProjects(body.projects))
                }

                override fun onLoadIndicator(active: Boolean) {
                    postScreenLoader(active)
                }

                override fun onError(code: Int) {
                    postScreenState(DashboardState.ShowError(code))
                }

                override fun onNoInternet() {
                    postScreenState(DashboardState.ShowError(ErrorCodes.NO_INTERNET))
                }

                override fun onNoServer() {
                    postScreenState(DashboardState.ShowError(ErrorCodes.NO_SERVER))
                }

                override fun onUnknownError() {
                    postScreenState(DashboardState.ShowError(ErrorCodes.UNKNOWN_ERROR))
                }
            }
        )
    }

}