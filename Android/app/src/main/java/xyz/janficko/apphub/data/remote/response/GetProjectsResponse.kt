package xyz.janficko.apphub.data.remote.response

import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName
import xyz.janficko.apphub.model.Project

data class GetProjectsResponse(
    @SerializedName("projects")
    @Expose
    val projects : List<Project>
) : BaseResponse()