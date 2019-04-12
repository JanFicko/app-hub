package xyz.janficko.apphub.ui.base

import android.content.Context
import android.os.Bundle
import android.view.View
import android.view.inputmethod.InputMethodManager
import androidx.annotation.LayoutRes
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import kotlinx.android.synthetic.main.activity_main.*
import xyz.janficko.apphub.R
import xyz.janficko.apphub.util.LoggerPrinter
import xyz.janficko.apphub.util.inTransaction
import kotlin.contracts.ExperimentalContracts

/**
Created by Jan Ficko on 22/02/19 for Margento.
 */

@ExperimentalContracts
abstract class BaseViewModelActivity<ST, VM : BaseViewModel<ST>> : AppCompatActivity() {

    protected var TAG = ""
    abstract val viewmodel : VM

    @get: LayoutRes
    protected abstract val layoutResId: Int

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        TAG = javaClass.simpleName
        if (layoutResId != 0) {
            setContentView(layoutResId)
        }
        viewmodel.screenState.observe(::getLifecycle, ::updateUI)
    }

    private fun updateUI(screenState: ScreenState<ST>?){
        when (screenState) {
            is ScreenState.Render -> processRenderState(screenState.renderState)
            is ScreenState.Loading -> showLoadingIndicator(screenState.active)
        }
    }

    abstract fun processRenderState(renderState: ST)

    fun moveToNextFragment(fragment: Fragment) {
        supportFragmentManager.inTransaction {
            replace(R.id.content_container, fragment)
        }
    }

    fun showLoadingIndicator(active: Boolean) {
        if (active) {
            loader.visibility = View.VISIBLE
        } else {
            loader.visibility = View.GONE
        }
    }

    fun hideKeyboard() {
        val imm = this.getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
        imm.hideSoftInputFromWindow(window.decorView.windowToken, 0)
    }

}