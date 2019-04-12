package xyz.janficko.apphub.ui.login

/**
Created by Jan Ficko on 02/04/19 for Margento.
 */

sealed class LoginState {

    class ShowDashboard : LoginState()
    class ShowError(val code : Int) : LoginState()

}