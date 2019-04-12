package xyz.janficko.apphub.ui.main

import xyz.janficko.apphub.model.Job

/**
Created by Jan Ficko on 27/02/19 for Margento.
 */
sealed class MainState  {

    class OpenLogin : MainState()
    class OpenDashboard : MainState()
    class OpenVersion : MainState()
    class OpenArtifacts : MainState()

    class ShowError(val code : Int) : MainState()

}