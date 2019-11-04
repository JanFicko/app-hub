package xyz.janficko.apphub.ui.base

import android.content.Context
import kotlinx.android.synthetic.main.activity_main.*
import org.koin.androidx.viewmodel.ext.sharedViewModel
import xyz.janficko.apphub.R
import xyz.janficko.apphub.common.ErrorCodes
import xyz.janficko.apphub.common.ResponseState
import xyz.janficko.apphub.ui.main.MainViewModel
import xyz.janficko.apphub.util.snack
import kotlin.contracts.ExperimentalContracts

@ExperimentalContracts
abstract class BaseViewModelFragment<ST, VM : BaseViewModel<ST>>: BaseFragment() {

    abstract val viewmodel : VM

    override fun onAttach(context: Context) {
        super.onAttach(context)

        viewmodel.screenState.observe(::getLifecycle, ::updateUI)
        viewmodel.loadingState.observe(::getLifecycle, ::updateUI)
    }

    abstract fun processRenderState(renderState: ST)

    protected open fun showError(errorCode: Int) {
        if (errorCode == ErrorCodes.UNKNOWN_ERROR) {
            baseActivity?.showUnknownError()
        }
    }

    private fun updateUI(screenState: ScreenState<ST>?){
        when (screenState) {
            is ScreenState.Render -> processRenderState(screenState.renderState)
            is ScreenState.Loading -> baseActivity?.showLoadingIndicator(screenState.active)
            is ScreenState.GenericErrors -> processErrors(screenState.error)
            is ScreenState.Error -> showError(screenState.error)
        }
    }

    private fun processErrors(error : ResponseState) {
        when (error) {
            ResponseState.NO_INTERNET -> baseActivity?.showNoInternet()
            ResponseState.NO_SERVER -> baseActivity?.showNoServer()
            ResponseState.UNKNOWN_ERROR -> baseActivity?.showUnknownError()
            ResponseState.TOKEN_EXPIRED -> {
                baseActivity?.showTokenExpiredError()

                showError(ErrorCodes.TOKEN_EXPIRED)
            }
            else -> baseActivity?.showUnknownError()
        }
    }

}