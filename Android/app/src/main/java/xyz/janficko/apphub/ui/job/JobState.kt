package xyz.janficko.apphub.ui.job

import xyz.janficko.apphub.model.Project

sealed class JobState {

    class ShowJobs(val project : Project) : JobState()

}