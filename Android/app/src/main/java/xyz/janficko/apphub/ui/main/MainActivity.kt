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
import xyz.janficko.apphub.util.extReplaceFragment
import kotlin.contracts.ExperimentalContracts

@ExperimentalContracts
class MainActivity : BaseViewModelActivity<MainState, MainViewModel>(), View.OnClickListener{

    override val viewmodel: MainViewModel by viewModel()
    private val sharedPreferences: SharedPreferencesContract by inject()

    override val layoutResId: Int = R.layout.activity_main

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        iv_logout.setOnClickListener(this)
    }

    override fun processRenderState(renderState: MainState) {
        tv_error.visibility = View.GONE
        hideKeyboard()
        when (renderState) {
            is MainState.OpenLogin-> openLogin()
            is MainState.OpenDashboard-> openDashboard()
            is MainState.OpenVersion -> openVersion()
            is MainState.OpenArtifacts -> openArtifacts()
        }
    }

    override fun onClick(view: View?) {
        tv_error.visibility = View.GONE
        when (view?.id) {
            R.id.iv_logout -> {
                openLogin()
            }
        }
    }

    override fun onBackPressed() {
        super.onBackPressed()
        finishAffinity()
    }

    override fun showTokenExpiredError() {
        super.showTokenExpiredError()
        openLogin()
    }

    private fun openLogin() {
        sharedPreferences.saveString(Keys.PREF_TOKEN, "")
        sharedPreferences.saveObject(Keys.PREF_USER, "")

        iv_back.visibility = View.GONE
        iv_refresh.visibility = View.GONE
        iv_logout.visibility = View.GONE
        extReplaceFragment(LoginFragment())
    }

    private fun openDashboard() {
        iv_back.visibility = View.GONE
        iv_refresh.visibility = View.VISIBLE
        iv_logout.visibility = View.VISIBLE
        extReplaceFragment(DashboardFragment())
    }

    private fun openVersion() {
        iv_back.visibility = View.VISIBLE
        iv_refresh.visibility = View.GONE
        extReplaceFragment(JobFragment())
    }

    private fun openArtifacts() {
        iv_back.visibility = View.VISIBLE
        iv_refresh.visibility = View.GONE
        extReplaceFragment(ArtifactFragment())
    }

}
