package xyz.janficko.apphub.data.remote.request

import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName

data class GetProjectsRequest(
    @SerializedName("userId")
    @Expose
    val userId: String,
    @SerializedName("platform")
    @Expose
    val platform: String = "android"
)