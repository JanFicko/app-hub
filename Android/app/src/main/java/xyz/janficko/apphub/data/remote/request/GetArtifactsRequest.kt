package xyz.janficko.apphub.data.remote.request

import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName

/**
Created by Jan Ficko on 05/04/19 for Margento.
 */
data class GetArtifactsRequest(
    @SerializedName("jobId")
    @Expose
    val jobId: Int
)