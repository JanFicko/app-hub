package xyz.janficko.apphub.ui.job

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import kotlinx.android.synthetic.main.item_job.view.*
import xyz.janficko.apphub.R
import xyz.janficko.apphub.model.Job

class JobAdapter(private val jobs: List<Job>, private val callback : (Job) -> Unit) :
    RecyclerView.Adapter<JobAdapter.BuildAdapterViewHolder>() {

    val layoutResId: Int
        get() = R.layout.item_job

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): BuildAdapterViewHolder {
        return BuildAdapterViewHolder(LayoutInflater.from(parent.context).inflate(layoutResId, parent, false))
    }

    override fun onBindViewHolder(holder: BuildAdapterViewHolder, position: Int) {
        holder.bind(jobs[position])
    }

    override fun getItemCount(): Int = jobs.size

    inner class BuildAdapterViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {

        fun bind(job: Job) = with(itemView) {
            tv_app_version.text = job.title

            job.changeLog?.let {
                if (!it.isBlank()) {
                    ll_change_log.visibility = View.VISIBLE
                    tv_change_log.text = it
                }
            }

            setOnClickListener { callback(jobs[adapterPosition]) }
        }

    }

}