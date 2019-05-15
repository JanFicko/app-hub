package xyz.janficko.apphub.dependency

import com.google.gson.GsonBuilder
import com.jakewharton.retrofit2.adapter.kotlin.coroutines.CoroutineCallAdapterFactory
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import org.koin.core.inject
import org.koin.dsl.module
import org.koin.java.KoinJavaComponent.inject
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import xyz.janficko.apphub.BuildConfig
import xyz.janficko.apphub.common.Constants
import xyz.janficko.apphub.common.Keys
import xyz.janficko.apphub.data.local.shared_preferences.SharedPreferencesContract
import xyz.janficko.apphub.data.remote.ApiService
import xyz.janficko.apphub.util.ApiLogger
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit

val networkModule = module {

    single{ GsonBuilder().create() }

    single<Interceptor> {
        val logging = HttpLoggingInterceptor(ApiLogger())
        logging.level = HttpLoggingInterceptor.Level.BODY
        logging
    }

    single {
        val sharedPreferences: SharedPreferencesContract = get()

        val httpClient = OkHttpClient.Builder()
        httpClient.connectTimeout(Constants.CONNECTION_TIMEOUT, TimeUnit.SECONDS)
        httpClient.writeTimeout(Constants.CONNECTION_TIMEOUT, TimeUnit.SECONDS)
        httpClient.readTimeout(Constants.CONNECTION_TIMEOUT, TimeUnit.SECONDS)
        httpClient.addInterceptor(get())
        httpClient.addInterceptor { chain ->
            val request = chain
                .request()
                .newBuilder()
                .addHeader("Content-Type", "application/json")
                .addHeader(Constants.DEVICE_INFO_HEADER, Constants.DEVICE_DESCRIPTION)
                .addHeader(Constants.AUTHORIZATION_HEADER, sharedPreferences.getString(Keys.PREF_TOKEN, ""))
                .build()
            chain.proceed(request)
        }
        httpClient.build()
    }

    single {
        Retrofit.Builder().baseUrl(BuildConfig.SERVICE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .addCallAdapterFactory(CoroutineCallAdapterFactory())
            .client(get())
            .callbackExecutor(Executors.newCachedThreadPool())
            .build()
    }

    single {
        (get() as Retrofit).create(ApiService::class.java)
    }

}