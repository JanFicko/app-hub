package xyz.janficko.apphub.data.remote.response

import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName
import xyz.janficko.apphub.model.Project

/**
Created by Jan Ficko on 04/04/19 for Margento.
 */

data class GetJobsResponse(
    @SerializedName("project")
    @Expose
    val project : Project
) : BaseResponse()