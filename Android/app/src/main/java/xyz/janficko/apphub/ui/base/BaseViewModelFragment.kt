package xyz.janficko.apphub.ui.base

import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.annotation.LayoutRes
import androidx.fragment.app.Fragment
import kotlinx.android.synthetic.main.activity_main.*
import xyz.janficko.apphub.ui.main.MainActivity
import xyz.janficko.apphub.util.LoggerPrinter
import kotlin.contracts.ExperimentalContracts

/**
Created by Jan Ficko on 22/02/19 for Margento.
 */

@ExperimentalContracts
abstract class BaseViewModelFragment<ST, VM : BaseViewModel<ST>> : Fragment() {

    protected var TAG = ""
    abstract val viewmodel : VM
    protected var baseActivity: BaseViewModelActivity<*, *>? = null

    @get: LayoutRes
    protected abstract val layoutResId: Int

    override fun onAttach(context: Context) {
        super.onAttach(context)
        TAG = javaClass.simpleName
        baseActivity = context as BaseViewModelActivity<*, *>?
        viewmodel.screenState.observe(::getLifecycle, ::updateUI)
        viewmodel.loadingState.observe(::getLifecycle, ::updateUI)
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(layoutResId, container, false)
    }

    private fun updateUI(screenState: ScreenState<ST>?){
        when (screenState) {
            is ScreenState.Render -> processRenderState(screenState.renderState)
            is ScreenState.Loading -> baseActivity?.showLoadingIndicator(screenState.active)
        }
    }

    abstract fun processRenderState(renderState: ST)

}