package xyz.janficko.apphub.ui

import android.app.Application
import org.koin.android.ext.koin.androidContext
import org.koin.android.ext.koin.androidLogger
import org.koin.core.context.startKoin
import org.koin.core.logger.Level
import xyz.janficko.apphub.dependency.appModule
import xyz.janficko.apphub.dependency.networkModule
import xyz.janficko.apphub.dependency.projectsModule
import kotlin.contracts.ExperimentalContracts

@ExperimentalContracts
class AppHub : Application() {

    companion object {
        lateinit var instance : AppHub
    }

    override fun onCreate() {
        super.onCreate()
        startKoin{
            androidContext(this@AppHub)
            androidLogger(Level.DEBUG)
            modules(
                listOf(
                    appModule,
                    networkModule,
                    projectsModule
                )
            )
        }
        instance = this
    }
}