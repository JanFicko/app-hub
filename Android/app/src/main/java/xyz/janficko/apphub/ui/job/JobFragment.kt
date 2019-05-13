package xyz.janficko.apphub.ui.job

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.View
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout
import kotlinx.android.synthetic.main.activity_main.*
import kotlinx.android.synthetic.main.fragment_job.*
import kotlinx.android.synthetic.main.item_job.*
import org.koin.androidx.viewmodel.ext.sharedViewModel
import org.koin.androidx.viewmodel.ext.viewModel
import xyz.janficko.apphub.R
import xyz.janficko.apphub.common.ErrorCodes
import xyz.janficko.apphub.model.Project
import xyz.janficko.apphub.ui.base.BaseViewModelFragment
import xyz.janficko.apphub.ui.main.MainViewModel
import xyz.janficko.apphub.util.snack
import kotlin.contracts.ExperimentalContracts

@SuppressLint("ValidFragment")
@ExperimentalContracts
class JobFragment :
    BaseViewModelFragment<JobState, JobViewModel>(),
    SwipeRefreshLayout.OnRefreshListener,
    View.OnClickListener {

    override val viewmodel : JobViewModel by viewModel()
    private val sharedviewmodel : MainViewModel by sharedViewModel()

    override val layoutResId: Int
        get() = R.layout.fragment_job

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        viewmodel.getJobs(sharedviewmodel.projectId)

        l_latest_build.setOnClickListener(this)
        baseActivity?.iv_back?.setOnClickListener(this)
        srl_container_versions.setOnRefreshListener(this)

        rv_build.layoutManager = LinearLayoutManager(context)
        rv_build.setHasFixedSize(true)
    }

    override fun processRenderState(renderState: JobState) {
        when (renderState) {
            is JobState.ShowJobs -> showJobs(renderState.project)
            is JobState.ShowError -> showError(renderState.code)
        }
    }

    private fun showJobs(project : Project) {

        val copiedJobs = project.jobs.toMutableList()

        baseActivity?.tv_title?.text = project.name

        if (project.jobs.size > 0) {
            baseActivity?.tv_error?.visibility = View.GONE
            srl_container_versions.visibility = View.VISIBLE

            sharedviewmodel.projectName = project.name
            sharedviewmodel.jobId = copiedJobs[0].jobId

            tv_app_version.text = copiedJobs[0].title

            copiedJobs[0].changeLog?.let {
                if (!it.isBlank()) {
                    ll_change_log.visibility = View.VISIBLE
                    tv_change_log.text = it
                }
            }

            copiedJobs.removeAt(0)

            if (project.jobs.size > 1) {
                tv_old_builds.visibility = View.VISIBLE
                rv_build.visibility = View.VISIBLE
                rv_build.adapter = JobAdapter(copiedJobs) {
                    sharedviewmodel.jobId = it.jobId
                    sharedviewmodel.openArtifactFragment()
                }
            }
        } else if (project.jobs.size == 0) {
            baseActivity?.tv_error?.visibility = View.VISIBLE
            baseActivity?.tv_error?.text = getString(R.string.error_no_versions)
            srl_container_versions.visibility = View.GONE

            tv_old_builds.visibility = View.GONE
            rv_build.visibility = View.GONE
        }
    }

    private fun showError(code : Int) {
        when(code) {
            ErrorCodes.UNKNOWN_ERROR -> {
                srl_container_versions.snack(R.string.error_unknown)
            }
        }
    }

    override fun onRefresh() {
        viewmodel.getJobs(sharedviewmodel.projectId)
        srl_container_versions.isRefreshing = false
    }

    override fun onClick(view: View?) {
        when (view?.id) {
            R.id.iv_back -> sharedviewmodel.openDashboardFragment()
            R.id.l_latest_build -> sharedviewmodel.openArtifactFragment()

        }
    }

}