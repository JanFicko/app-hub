package xyz.janficko.apphub.ui.main

import xyz.janficko.apphub.common.Keys
import xyz.janficko.apphub.data.local.shared_preferences.SharedPreferencesContract
import xyz.janficko.apphub.AppHub
import xyz.janficko.apphub.ui.base.BaseViewModel
import kotlin.contracts.ExperimentalContracts

@ExperimentalContracts
class MainViewModel(
    appHub : AppHub,
    sharedPreferences: SharedPreferencesContract
) : BaseViewModel<MainState>(appHub) {

    var jobId : Int = 0
    var projectName : String = ""
    var projectId : Int = 0

    init {
        if(sharedPreferences.getString(Keys.PREF_TOKEN, "").isNotBlank()) {
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