package xyz.janficko.apphub.ui.main

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.View
import kotlinx.android.synthetic.main.activity_main.*
import org.koin.android.ext.android.inject
import org.koin.androidx.viewmodel.ext.viewModel
import xyz.janficko.apphub.R
import xyz.janficko.apphub.common.ErrorCodes
import xyz.janficko.apphub.common.Keys
import xyz.janficko.apphub.data.local.shared_preferences.SharedPreferencesContract
import xyz.janficko.apphub.ui.artifact.ArtifactFragment
import xyz.janficko.apphub.ui.base.BaseViewModelActivity
import xyz.janficko.apphub.ui.dashboard.DashboardFragment
import xyz.janficko.apphub.ui.login.LoginFragment
import xyz.janficko.apphub.ui.job.JobFragment
import kotlin.contracts.ExperimentalContracts

/**
Created by Jan Ficko on 21/02/19 for Margento.
 */

@ExperimentalContracts
class MainActivity : BaseViewModelActivity<MainState, MainViewModel>(), View.OnClickListener{

    override val viewmodel: MainViewModel by viewModel()
    private val sharedPreferences: SharedPreferencesContract by inject()

    override val layoutResId: Int
        get() = R.layout.activity_main

    companion object {
        fun start(context: Context) {
            val intent = Intent(context, MainActivity::class.java)
            context.startActivity(intent)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        iv_logout.setOnClickListener(this)
    }

    override fun onBackPressed() {
        super.onBackPressed()
        finishAffinity()
    }

    override fun processRenderState(renderState: MainState) {
        tv_error.visibility = View.GONE
        hideKeyboard()
        when (renderState) {
            is MainState.OpenLogin-> openLogin()
            is MainState.OpenDashboard-> openDashboard()
            is MainState.OpenVersion -> openVersion()
            is MainState.OpenArtifacts -> openArtifacts()
            is MainState.ShowError -> showError(renderState.code)
        }
    }

    override fun onClick(v: View?) {
        tv_error.visibility = View.GONE
        when (v?.id) {
            R.id.iv_logout -> {
                sharedPreferences.saveString(Keys.PREF_TOKEN, "")
                sharedPreferences.saveObject(Keys.PREF_USER, "")
                openLogin()
            }
        }
    }

    private fun openLogin() {
        iv_back.visibility = View.GONE
        iv_refresh.visibility = View.GONE
        iv_logout.visibility = View.GONE
        moveToNextFragment(LoginFragment())
    }

    private fun openDashboard() {
        iv_back.visibility = View.GONE
        iv_refresh.visibility = View.VISIBLE
        iv_logout.visibility = View.VISIBLE
        moveToNextFragment(DashboardFragment())
    }

    private fun openVersion() {
        iv_back.visibility = View.VISIBLE
        iv_refresh.visibility = View.GONE
        moveToNextFragment(JobFragment())
    }

    private fun openArtifacts() {
        iv_back.visibility = View.VISIBLE
        iv_refresh.visibility = View.GONE
        moveToNextFragment(ArtifactFragment())
    }

    private fun showError(code : Int) {
        when (code) {
            ErrorCodes.UNKNOWN_ERROR -> {
                tv_error.visibility = View.VISIBLE
                iv_refresh.visibility = View.GONE
                tv_error.text = getString(R.string.error_no_server_connection)
            }
        }
    }

}
