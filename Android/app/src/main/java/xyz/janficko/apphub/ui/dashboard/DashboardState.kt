package xyz.janficko.apphub.ui.dashboard

import xyz.janficko.apphub.model.Project

sealed class DashboardState {

    class ShowProjects(val projects : List<Project>) : DashboardState()

    class ShowError(val code : Int) : DashboardState()

}