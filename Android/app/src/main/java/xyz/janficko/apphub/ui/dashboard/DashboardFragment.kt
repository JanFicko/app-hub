package xyz.janficko.apphub.ui.dashboard

import android.os.Bundle
import android.view.View
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout
import kotlinx.android.synthetic.main.activity_main.*
import kotlinx.android.synthetic.main.fragment_dashboard.*
import kotlinx.android.synthetic.main.fragment_login.*
import org.koin.androidx.viewmodel.ext.sharedViewModel
import org.koin.androidx.viewmodel.ext.viewModel
import xyz.janficko.apphub.R
import xyz.janficko.apphub.common.ErrorCodes
import xyz.janficko.apphub.common.Keys
import xyz.janficko.apphub.model.Project
import xyz.janficko.apphub.ui.base.BaseViewModelFragment
import xyz.janficko.apphub.ui.main.MainViewModel
import xyz.janficko.apphub.util.snack
import kotlin.contracts.ExperimentalContracts

@ExperimentalContracts
class DashboardFragment :
    BaseViewModelFragment<DashboardState, DashboardViewModel>(),
    SwipeRefreshLayout.OnRefreshListener,
    View.OnClickListener {

    override val viewmodel : DashboardViewModel by viewModel()
    private val sharedviewmodel: MainViewModel by sharedViewModel()

    var projectAdapter : ProjectsAdapter? = null

    override val layoutResId: Int = R.layout.fragment_dashboard

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        srl_container_apps.setOnRefreshListener(this)
        baseActivity?.iv_refresh?.setOnClickListener(this)

        baseActivity?.tv_title?.text = getString(R.string.app_name)

        rv_apps.layoutManager = LinearLayoutManager(context)
    }

    override fun processRenderState(renderState: DashboardState) {
        when (renderState) {
            is DashboardState.ShowProjects -> showProjects(renderState.projects)
        }
    }

    override fun showError(errorCode: Int) {
        super.showError(errorCode)

        when (errorCode) {
            ErrorCodes.TOKEN_EXPIRED -> {
                sharedviewmodel.openLoginFragment()
            }
            else -> baseActivity?.showUnknownError()
        }
    }

    override fun onRefresh() {
        viewmodel.getProjects()
        srl_container_apps.isRefreshing = false
    }

    override fun onClick(view: View?) {
        when(view?.id) {
            R.id.iv_refresh -> viewmodel.getProjects()
        }
    }

    private fun showProjects(projects : List<Project>) {
        if (projects.isNotEmpty()) {
            baseActivity?.tv_error?.visibility = View.GONE
            projectAdapter = ProjectsAdapter(projects) {
                sharedviewmodel.projectId = it
                sharedviewmodel.openJobFragment()
            }
            rv_apps.adapter = projectAdapter
        } else {
            projectAdapter?.clearAdapter()

            baseActivity?.tv_error?.visibility = View.VISIBLE
            baseActivity?.tv_error?.text = getString(R.string.error_no_projects)
        }
    }

}