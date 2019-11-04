package xyz.janficko.apphub.ui.base

import android.os.Bundle
import kotlinx.android.synthetic.main.activity_main.*
import xyz.janficko.apphub.R
import xyz.janficko.apphub.common.ErrorCodes
import xyz.janficko.apphub.common.ResponseState
import xyz.janficko.apphub.util.snack
import kotlin.contracts.ExperimentalContracts

@ExperimentalContracts
abstract class BaseViewModelActivity<ST, VM : BaseViewModel<ST>>: BaseActivity() {

    abstract val viewmodel : VM

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        viewmodel.screenState.observe(::getLifecycle, ::updateUI)
        viewmodel.loadingState.observe(::getLifecycle, ::updateUI)
    }

    abstract fun processRenderState(renderState: ST)

    protected open fun showError(errorCode: Int) {}

    private fun updateUI(screenState: ScreenState<ST>?){
        when (screenState) {
            is ScreenState.Render -> processRenderState(screenState.renderState)
            is ScreenState.Loading -> showLoadingIndicator(screenState.active)
            is ScreenState.GenericErrors -> processErrors(screenState.error)
            is ScreenState.Error -> showError(screenState.error)
        }
    }

    private fun processErrors(error: ResponseState) {
        when (error) {
            ResponseState.NO_INTERNET -> showNoInternet()
            ResponseState.NO_SERVER -> showNoServer()
            ResponseState.UNKNOWN_ERROR -> showUnknownError()
            ResponseState.TOKEN_EXPIRED -> showTokenExpiredError()
            else -> showUnknownError()
        }
    }

}