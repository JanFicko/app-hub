package xyz.janficko.apphub.ui.main


sealed class MainState  {

    class OpenLogin : MainState()
    class OpenDashboard : MainState()
    class OpenVersion : MainState()
    class OpenArtifacts : MainState()

    class ShowError(val code : Int) : MainState()

}