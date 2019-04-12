package xyz.janficko.apphub.ui.login

import org.koin.core.inject
import xyz.janficko.apphub.common.Constants
import xyz.janficko.apphub.common.Keys
import xyz.janficko.apphub.data.local.shared_preferences.SharedPreferencesContract
import xyz.janficko.apphub.data.remote.request.LoginRequest
import xyz.janficko.apphub.data.remote.response.LoginResponse
import xyz.janficko.apphub.domain.remote.UserUseCase
import xyz.janficko.apphub.ui.AppHub
import xyz.janficko.apphub.ui.base.BaseViewModel
import kotlin.contracts.ExperimentalContracts

/**
Created by Jan Ficko on 02/04/19 for Margento.
 */

@ExperimentalContracts
class LoginViewModel constructor(
    appHub: AppHub,
    private val userLocalUseCase: UserUseCase
) : BaseViewModel<LoginState>(appHub) {

    private val sharedPreferences: SharedPreferencesContract by inject()

    fun loginUser(email: String, password: String) {

        getDataFromWeb(
            userLocalUseCase.login(LoginRequest(
                email,
                password,
                Constants.DEVICE_DESCRIPTION
            )),
            object : BaseViewModel<LoginState>.RemoteRepositoryCallback<LoginResponse>() {
                override fun onSuccess(body: LoginResponse) {
                    sharedPreferences.saveString(Keys.PREF_TOKEN, "Bearer " + body.token)
                    sharedPreferences.saveObject(Keys.PREF_USER, body.user)

                    postScreenState(LoginState.ShowDashboard())
                }

                override fun onLoadIndicator(active: Boolean) {
                    postScreenLoader(active)
                }

                override fun onError(code: Int) {
                    postScreenState(LoginState.ShowError(code))
                }
            }
        )
    }

}