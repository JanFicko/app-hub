package xyz.janficko.apphub.ui.dashboard

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import kotlinx.android.synthetic.main.item_app.view.*
import xyz.janficko.apphub.R
import xyz.janficko.apphub.model.Project

class ProjectsAdapter(private var projects: List<Project>, private val callback : (Int) -> Unit) :
    RecyclerView.Adapter<ProjectsAdapter.AppAdapterViewHolder>() {

    val layoutResId: Int
        get() = R.layout.item_app

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): AppAdapterViewHolder {
        return AppAdapterViewHolder(LayoutInflater.from(parent.context).inflate(layoutResId, parent, false))
    }

    override fun onBindViewHolder(holder: AppAdapterViewHolder, position: Int) {
        holder.bind(projects[position])
    }

    override fun getItemCount(): Int = projects.size

    fun clearAdapter() {
        projects = ArrayList()
        notifyDataSetChanged()
    }

    inner class AppAdapterViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {

        fun bind(project: Project) = with(itemView) {
            tv_app_name.text = project.name

            setOnClickListener { callback(projects[adapterPosition].projectId) }
        }

    }

}