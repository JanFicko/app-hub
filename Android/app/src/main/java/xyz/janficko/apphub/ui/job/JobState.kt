package xyz.janficko.apphub.ui.job

import xyz.janficko.apphub.model.Project

/**
Created by Jan Ficko on 04/04/19 for Margento.
 */
sealed class JobState {

    class ShowJobs(val project : Project) : JobState()

    class ShowError(val code : Int) : JobState()

}