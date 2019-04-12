package xyz.janficko.apphub.ui.artifact

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.View
import androidx.recyclerview.widget.LinearLayoutManager
import kotlinx.android.synthetic.main.activity_main.*
import kotlinx.android.synthetic.main.fragment_artifact.*
import org.koin.android.ext.android.inject
import org.koin.androidx.viewmodel.ext.sharedViewModel
import org.koin.androidx.viewmodel.ext.viewModel
import xyz.janficko.apphub.R
import xyz.janficko.apphub.common.ErrorCodes
import xyz.janficko.apphub.data.local.shared_preferences.SharedPreferencesContract
import xyz.janficko.apphub.ui.base.BaseViewModelFragment
import xyz.janficko.apphub.ui.main.MainViewModel
import xyz.janficko.apphub.util.snack
import kotlin.contracts.ExperimentalContracts

/**
Created by Jan Ficko on 28/02/19 for Margento.
 */

@SuppressLint("ValidFragment")
@ExperimentalContracts
class ArtifactFragment :
    BaseViewModelFragment<ArtifactState, ArtifactViewModel>(),
    View.OnClickListener {

    override val viewmodel : ArtifactViewModel by viewModel()
    private val sharedviewmodel: MainViewModel by sharedViewModel()
    private val sharedPreferences: SharedPreferencesContract by inject()

    override val layoutResId: Int
        get() = R.layout.fragment_artifact


    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        viewmodel.showArtifacts(sharedviewmodel.jobId)

        baseActivity?.iv_back?.setOnClickListener(this)

        rv_artifact.layoutManager = LinearLayoutManager(context)
        rv_artifact.setHasFixedSize(true)
    }


    override fun processRenderState(renderState: ArtifactState) {
        when (renderState) {
            is ArtifactState.ShowArtifacts -> showArtifacts(renderState.outputs)
            is ArtifactState.ShowError -> showError(renderState.code)
        }
    }

    private fun showArtifacts(outputs : List<String>) {
        baseActivity?.tv_title?.text = sharedviewmodel.projectName

        if (outputs.size > 0) {
            baseActivity?.tv_error?.visibility = View.GONE
            cl_container_artifacts.visibility = View.VISIBLE

            rv_artifact.visibility = View.VISIBLE
            rv_artifact.adapter = ArtifactAdapter(outputs) {
                viewmodel.downloadApk(sharedviewmodel.jobId, it)
            }
        } else if (outputs.size == 0) {
            baseActivity?.tv_error?.visibility = View.VISIBLE
            baseActivity?.tv_error?.text = getString(R.string.error_no_artifacts)
            cl_container_artifacts.visibility = View.GONE

            rv_artifact.visibility = View.GONE
        }
    }

    private fun showError(code : Int) {
        when (code) {
            ErrorCodes.UNKNOWN_ERROR -> {
                cl_container_artifacts.snack(R.string.error_unknown)
            }
        }
    }

    override fun onClick(view: View?) {
        sharedviewmodel.openVersionFragment()
    }

}