package xyz.janficko.apphub.data.remote.request

import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName

data class GetJobsRequest(
    @SerializedName("projectId")
    @Expose
    val projectId: Int,
    @SerializedName("userId")
    @Expose
    val userId: String
)