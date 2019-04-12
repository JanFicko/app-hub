package xyz.janficko.apphub.ui.base

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import kotlinx.coroutines.*
import org.koin.core.KoinComponent
import retrofit2.HttpException
import xyz.janficko.apphub.common.ErrorCodes
import xyz.janficko.apphub.common.ResponseState
import xyz.janficko.apphub.data.remote.BaseRemoteLoadCallback
import xyz.janficko.apphub.data.remote.response.BaseResponse
import xyz.janficko.apphub.dataholder.SingleLiveData
import xyz.janficko.apphub.ui.AppHub
import xyz.janficko.apphub.util.LoggerPrinter
import java.net.ConnectException
import java.net.UnknownHostException
import kotlin.contracts.ExperimentalContracts
import kotlin.coroutines.CoroutineContext

/**
Created by Jan Ficko on 22/02/19 for Margento.
 */

@ExperimentalContracts
abstract class BaseViewModel<ST> constructor(val appHub : AppHub) : ViewModel(), CoroutineScope, KoinComponent {

    companion object {
        val TAG: String = BaseViewModel::class.java.simpleName
    }

    private lateinit var _screenState: MutableLiveData<ScreenState<ST>>
    private lateinit var _loadingState: MutableLiveData<ScreenState<ST>>

    protected fun postScreenState(screenState : ST) {
        if (!::_screenState.isInitialized) {
            _screenState = MutableLiveData()
        }
        _screenState.postValue(ScreenState.Render(screenState))
    }

    val screenState: LiveData<ScreenState<ST>>
        get() {
            if (!::_screenState.isInitialized) {
                _screenState = MutableLiveData()
            }
            return _screenState
        }

    protected fun postScreenLoader(active: Boolean) {
        if (!::_loadingState.isInitialized) {
            _loadingState = MutableLiveData()
        }
        _loadingState.postValue(ScreenState.Loading(active))
    }

    val loadingState: LiveData<ScreenState<ST>>
        get() {
            if (!::_loadingState.isInitialized) {
                _loadingState = MutableLiveData()
            }
            return _loadingState
        }

    private lateinit var job : Job

    override val coroutineContext : CoroutineContext
        get() {
            if (!::job.isInitialized) {
                job = Job()
            }
            return Dispatchers.Main + job
        }

    val scope : CoroutineScope by lazy {
        CoroutineScope(coroutineContext)
    }

    private val _responseEvent : SingleLiveData<ScreenState<ResponseState>> = SingleLiveData()

    val responseState : SingleLiveData<ScreenState<ResponseState>>
        get() = _responseEvent

    override fun onCleared() {
        super.onCleared()
        if (::job.isInitialized)
            job.cancel()
    }

    @Suppress("UNCHECKED_CAST")
    @ExperimentalContracts
    fun <T : BaseResponse> getDataFromWeb(deferred : Deferred<BaseResponse>, dataSource : BaseRemoteLoadCallback<T>) {
        launch(Dispatchers.IO) {
            try {
                dataSource.onLoadIndicator(true)

                val result = deferred.await() as T

                dataSource.onLoadIndicator(false)

                if (result.code == ErrorCodes.RESPONSE_OK) {
                    dataSource.onSuccess(result)
                } else {
                    dataSource.onError(result.code)
                }
            } catch (e : HttpException) {
                e.message?.let { LoggerPrinter.printError(TAG, it)}

                dataSource.onLoadIndicator(false)
                dataSource.onUnknownError();
            } catch (e : Throwable) {
                e.message?.let { LoggerPrinter.printError(TAG, it)}

                dataSource.onLoadIndicator(false)
                if (e is UnknownHostException) {
                    dataSource.onNoInternet();
                } else if (e is ConnectException) {
                    dataSource.onNoServer();
                } else {
                    dataSource.onUnknownError();
                }
            }
        }
    }

    abstract inner class RemoteRepositoryCallback<T : BaseResponse> : BaseRemoteLoadCallback<T> {

        override fun onError(code: Int) {
            _responseEvent.postValue(ScreenState.Render(ResponseState.ERROR))
        }

        override fun onUnknownError() {
            _responseEvent.postValue(ScreenState.Render(ResponseState.UNKNOWN_ERROR))
        }

        override fun onNoInternet() {
            _responseEvent.postValue(ScreenState.Render(ResponseState.NO_INTERNET))
        }

        override fun onNoServer() {
            _responseEvent.postValue(ScreenState.Render(ResponseState.NO_SERVER))
        }

        override fun onLoadIndicator(active: Boolean) {
            if (active) {
                _responseEvent.postValue(ScreenState.Render(ResponseState.LOADING))
            } else {
                _responseEvent.postValue(ScreenState.Render(ResponseState.NOT_LOADING))
            }
        }

        override fun noToken() {
            _responseEvent.postValue(ScreenState.Render(ResponseState.NO_TOKEN))
        }
    }

}