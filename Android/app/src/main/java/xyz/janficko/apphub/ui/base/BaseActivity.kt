package xyz.janficko.apphub.ui.base

import android.content.Context
import android.os.Bundle
import android.view.View
import android.view.inputmethod.InputMethodManager
import androidx.annotation.LayoutRes
import androidx.appcompat.app.AppCompatActivity
import kotlinx.android.synthetic.main.activity_main.*
import xyz.janficko.apphub.R
import xyz.janficko.apphub.util.snack

abstract class BaseActivity : AppCompatActivity() {

    protected var TAG = ""

    @get: LayoutRes
    protected abstract val layoutResId: Int

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        TAG = javaClass.simpleName
        if (layoutResId != 0) {
            setContentView(layoutResId)
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

    fun showNoInternet() {
        content_container.snack(R.string.error_no_internet_connection)
    }

    fun showNoServer() {
        content_container.snack(R.string.error_no_server_connection)
    }

    fun showUnknownError() {
        content_container.snack(R.string.error_unknown)

        /*tv_error?.visibility = View.VISIBLE
        iv_refresh?.visibility = View.GONE
        tv_error?.text = getString(R.string.error_unknown)*/
    }

    open fun showTokenExpiredError() {
        content_container.snack(R.string.error_token_expired)
    }

}