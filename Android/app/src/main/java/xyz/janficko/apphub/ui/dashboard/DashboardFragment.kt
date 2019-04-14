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
import xyz.janficko.apphub.model.Project
import xyz.janficko.apphub.ui.base.BaseViewModelFragment
import xyz.janficko.apphub.ui.main.MainViewModel
import xyz.janficko.apphub.util.snack
import kotlin.contracts.ExperimentalContracts

/**
Created by Jan Ficko on 22/02/19 for Margento.
 */

@ExperimentalContracts
class DashboardFragment :
    BaseViewModelFragment<DashboardState, DashboardViewModel>(),
    SwipeRefreshLayout.OnRefreshListener,
    View.OnClickListener {

    override val viewmodel : DashboardViewModel by viewModel()
    private val sharedviewmodel: MainViewModel by sharedViewModel()

    var projectAdapter : ProjectsAdapter? = null

    override val layoutResId: Int
        get() = R.layout.fragment_dashboard

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        srl_container_apps.setOnRefreshListener(this)
        baseActivity?.iv_refresh?.setOnClickListener(this)

        baseActivity?.tv_title?.text = getString(R.string.app_name)

        rv_apps.layoutManager = LinearLayoutManager(context)
        rv_apps.setHasFixedSize(true)
    }

    override fun processRenderState(renderState: DashboardState) {
        when (renderState) {
            is DashboardState.ShowProjects -> showProjects(renderState.projects)
            is DashboardState.ShowError -> showError(renderState.code)
        }
    }

    private fun showProjects(projects : List<Project>) {
        if (projects.size == 0) {
            projectAdapter?.clearAdapter()

            baseActivity?.tv_error?.visibility = View.VISIBLE
            baseActivity?.tv_error?.text = getString(R.string.error_no_projects)
        } else {
            baseActivity?.tv_error?.visibility = View.GONE
            projectAdapter = ProjectsAdapter(projects) {
                sharedviewmodel.projectId = it
                sharedviewmodel.openVersionFragment()
            }
            rv_apps.adapter = projectAdapter
        }
    }

    private fun showError(code : Int) {
        when (code) {
            ErrorCodes.UNKNOWN_ERROR -> srl_container_apps.snack(R.string.error_unknown)
            ErrorCodes.NO_INTERNET -> {
                projectAdapter?.clearAdapter()

                baseActivity?.tv_error?.visibility = View.VISIBLE
                baseActivity?.tv_error?.text = getString(R.string.error_no_internet_connection)
            }
            ErrorCodes.NO_SERVER -> {
                projectAdapter?.clearAdapter()

                baseActivity?.tv_error?.visibility = View.VISIBLE
                baseActivity?.tv_error?.text = getString(R.string.error_no_server_connection)
            }

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

}