package xyz.janficko.apphub.ui.main

import org.koin.core.inject
import xyz.janficko.apphub.common.Keys
import xyz.janficko.apphub.data.local.shared_preferences.SharedPreferencesContract
import xyz.janficko.apphub.AppHub
import xyz.janficko.apphub.ui.base.BaseViewModel
import kotlin.contracts.ExperimentalContracts

@ExperimentalContracts
class MainViewModel(
    appHub : AppHub
) : BaseViewModel<MainState>(appHub) {

    private val sharedPreferences: SharedPreferencesContract by inject()

    var jobId : Int = 0
    var projectName : String = ""
    var projectId : Int = 0

    init {
        val token = sharedPreferences.getString(Keys.PREF_TOKEN, "")

        if(!token.isEmpty()) {
            openDashboardFragment()
        } else {
            openLoginFragment()
        }
    }

    fun openLoginFragment() {
        postScreenState(MainState.OpenLogin())
    }

    fun openDashboardFragment() {
        postScreenState(MainState.OpenDashboard())
    }

    fun openJobFragment() {
        postScreenState(MainState.OpenVersion())
    }

    fun openArtifactFragment() {
        postScreenState(MainState.OpenArtifacts())
    }

}