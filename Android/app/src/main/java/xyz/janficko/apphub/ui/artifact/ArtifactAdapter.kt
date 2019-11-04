package xyz.janficko.apphub.ui.artifact

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import kotlinx.android.synthetic.main.item_artifact.view.*
import xyz.janficko.apphub.R

class ArtifactAdapter(private val outputs: List<String>, val callback: (String) -> Unit) : RecyclerView.Adapter<ArtifactAdapter.ArtifactAdapterViewHolder>() {

    val layoutResId: Int = R.layout.item_artifact

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ArtifactAdapterViewHolder {
        return ArtifactAdapterViewHolder(LayoutInflater.from(parent.context).inflate(layoutResId, parent, false))
    }

    override fun onBindViewHolder(holder: ArtifactAdapterViewHolder, position: Int) {
        holder.bind(outputs[position])
    }

    override fun getItemCount(): Int = outputs.size

    inner class ArtifactAdapterViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {

        fun bind(output : String) = with(itemView) {
            tv_artifact_name.text = output

            setOnClickListener { callback(outputs[adapterPosition]) }
        }

    }
}