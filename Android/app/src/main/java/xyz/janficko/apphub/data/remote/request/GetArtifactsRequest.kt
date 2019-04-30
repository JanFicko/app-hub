package xyz.janficko.apphub.data.remote.request

import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName

data class GetArtifactsRequest(
    @SerializedName("jobId")
    @Expose
    val jobId: Int
)