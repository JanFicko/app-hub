package xyz.janficko.apphub.dependency

import org.koin.androidx.viewmodel.dsl.viewModel
import org.koin.dsl.module
import org.koin.experimental.builder.factory
import xyz.janficko.apphub.domain.remote.ProjectUseCase
import xyz.janficko.apphub.domain.remote.UserUseCase
import xyz.janficko.apphub.ui.artifact.ArtifactViewModel
import xyz.janficko.apphub.ui.dashboard.DashboardViewModel
import xyz.janficko.apphub.ui.login.LoginViewModel
import xyz.janficko.apphub.ui.main.MainViewModel
import xyz.janficko.apphub.ui.job.JobViewModel
import kotlin.contracts.ExperimentalContracts

@ExperimentalContracts
val projectsModule = module {

    factory<UserUseCase>()
    factory<ProjectUseCase>()

    viewModel { MainViewModel(get()) }
    viewModel { LoginViewModel(get(), get()) }
    viewModel { DashboardViewModel(get(), get()) }
    viewModel { JobViewModel(get(), get()) }
    viewModel { ArtifactViewModel(get(), get()) }

}