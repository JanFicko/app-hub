package xyz.janficko.apphub.data.remote.request

import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName

/**
Created by Jan Ficko on 03/04/19 for Margento.
 */
data class GetProjectsRequest(
    @SerializedName("userId")
    @Expose
    val userId: String,
    @SerializedName("platform")
    @Expose
    val platform: String = "android"
)