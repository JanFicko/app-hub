package xyz.janficko.apphub.data.remote

import xyz.janficko.apphub.data.remote.response.BaseResponse

interface BaseRemoteLoadCallback<R : BaseResponse> {
    fun onSuccess(body: R)
    fun onError(code: Int)
    fun onUnknownError()
    fun onNoInternet()
    fun onNoServer()
    fun onLoadIndicator(active: Boolean)
    fun noToken()
}