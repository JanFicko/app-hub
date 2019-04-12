package xyz.janficko.apphub.ui.dashboard

import xyz.janficko.apphub.model.Project

/**
Created by Jan Ficko on 02/04/19 for Margento.
 */

sealed class DashboardState {

    class ShowProjects(val projects : List<Project>) : DashboardState()

    class ShowError(val code : Int) : DashboardState()

}