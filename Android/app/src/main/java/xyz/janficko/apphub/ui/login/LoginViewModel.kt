package xyz.janficko.apphub.ui.login

import xyz.janficko.apphub.common.Constants
import xyz.janficko.apphub.common.ErrorCodes
import xyz.janficko.apphub.common.Keys
import xyz.janficko.apphub.data.local.shared_preferences.SharedPreferencesContract
import xyz.janficko.apphub.data.remote.request.LoginRequest
import xyz.janficko.apphub.data.remote.response.LoginResponse
import xyz.janficko.apphub.domain.remote.UserUseCase
import xyz.janficko.apphub.AppHub
import xyz.janficko.apphub.ui.base.BaseViewModel
import xyz.janficko.apphub.util.printVerbose
import kotlin.contracts.ExperimentalContracts

@ExperimentalContracts
class LoginViewModel constructor(
    appHub: AppHub,
    private val userLocalUseCase: UserUseCase,
    private val sharedPreferences: SharedPreferencesContract
) : BaseViewModel<LoginState>(appHub) {

    fun loginUser(email: String, password: String) {
        getDataFromWeb(
            userLocalUseCase.login(LoginRequest(
                email,
                password,
                Constants.DEVICE_DESCRIPTION
            )),
            object : BaseViewModel<LoginState>.RemoteRepositoryCallback<LoginResponse>() {
                override fun onSuccess(body: LoginResponse) {
                    sharedPreferences.saveString(Keys.PREF_TOKEN, "Bearer ${body.token}")
                    sharedPreferences.saveObject(Keys.PREF_USER, body.user)

                    postScreenState(LoginState.ShowDashboard())
                }
            }
        )
    }

}