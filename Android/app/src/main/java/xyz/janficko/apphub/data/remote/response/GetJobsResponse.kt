package xyz.janficko.apphub.data.remote.response

import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName
import xyz.janficko.apphub.model.Project

data class GetJobsResponse(
    @SerializedName("project")
    @Expose
    val project : Project
) : BaseResponse()