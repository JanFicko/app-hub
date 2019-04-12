package xyz.janficko.apphub.dependency

import android.content.Context
import android.content.SharedPreferences
import org.koin.android.ext.koin.androidContext
import org.koin.dsl.module
import org.koin.experimental.builder.singleBy
import xyz.janficko.apphub.common.Constants
import xyz.janficko.apphub.data.local.shared_preferences.SharedPreferencesContract
import xyz.janficko.apphub.data.local.shared_preferences.SharedPreferencesStorage
import xyz.janficko.apphub.data.remote.RemoteRepository
import xyz.janficko.apphub.data.remote.RemoteRepositoryContract
import xyz.janficko.apphub.ui.AppHub
import kotlin.contracts.ExperimentalContracts

/**
Created by Jan Ficko on 26/02/19 for Margento.
 */

@ExperimentalContracts
val appModule = module {

    factory { AppHub.instance }

    singleBy<RemoteRepositoryContract, RemoteRepository>()

    singleBy<SharedPreferencesContract, SharedPreferencesStorage>()
    single<SharedPreferences> { androidContext().getSharedPreferences(Constants.SHARED_PREF, Context.MODE_PRIVATE) }

}