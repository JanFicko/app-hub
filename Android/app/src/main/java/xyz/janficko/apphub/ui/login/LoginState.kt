package xyz.janficko.apphub.ui.login

sealed class LoginState {

    class ShowDashboard : LoginState()
    class ShowError(val code : Int) : LoginState()

}