package xyz.janficko.apphub.data.remote.request

import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName

/**
Created by Jan Ficko on 03/04/19 for Margento.
 */
data class GetJobsRequest(
    @SerializedName("projectId")
    @Expose
    val projectId: Int,
    @SerializedName("userId")
    @Expose
    val userId: String
)