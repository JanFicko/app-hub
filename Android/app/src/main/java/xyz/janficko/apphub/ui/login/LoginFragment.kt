package xyz.janficko.apphub.ui.login

import android.os.Bundle
import android.view.View
import kotlinx.android.synthetic.main.activity_main.*
import kotlinx.android.synthetic.main.fragment_login.*
import org.koin.androidx.viewmodel.ext.sharedViewModel
import org.koin.androidx.viewmodel.ext.viewModel
import xyz.janficko.apphub.BuildConfig
import xyz.janficko.apphub.R
import xyz.janficko.apphub.common.ErrorCodes
import xyz.janficko.apphub.ui.base.BaseViewModelFragment
import xyz.janficko.apphub.ui.main.MainViewModel
import xyz.janficko.apphub.util.isValidEmail
import xyz.janficko.apphub.util.printVerbose
import xyz.janficko.apphub.util.snack
import kotlin.contracts.ExperimentalContracts

@ExperimentalContracts
class LoginFragment :
    BaseViewModelFragment<LoginState, LoginViewModel>(),
    View.OnClickListener {

    override val viewmodel: LoginViewModel by viewModel()
    private val sharedviewmodel: MainViewModel by sharedViewModel()

    override val layoutResId: Int = R.layout.fragment_login

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        bt_login.setOnClickListener(this)

        baseActivity?.tv_title?.text = getString(R.string.app_name)
        tv_app_version.text = BuildConfig.VERSION_NAME
    }

    override fun processRenderState(renderState: LoginState) {
        when(renderState) {
            is LoginState.ShowDashboard -> sharedviewmodel.openDashboardFragment()
        }
    }

    override fun showError(errorCode: Int) {
        super.showError(errorCode)

        when (errorCode) {
            ErrorCodes.ERROR_WRONG_PASSWORD -> v_login.snack(R.string.error_wrong_password)
            else -> baseActivity?.showUnknownError()
        }
    }

    override fun onClick(view: View?) {
        when(view?.id) {
            R.id.bt_login -> {
                if (et_email.text.isNotEmpty() && et_password.text.isNotEmpty()) {
                    if (et_email.text.toString().isValidEmail()) {
                        viewmodel.loginUser(et_email.text.toString(), et_password.text.toString())
                    } else {
                        v_login.snack(R.string.error_not_correct_email)
                    }

                } else {
                    v_login.snack(R.string.error_fields_empty)
                }
            }
        }
    }

}