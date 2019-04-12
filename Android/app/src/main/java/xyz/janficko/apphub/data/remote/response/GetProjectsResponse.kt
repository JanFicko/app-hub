package xyz.janficko.apphub.data.remote.response

import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName
import xyz.janficko.apphub.model.Project

/**
Created by Jan Ficko on 03/04/19 for Margento.
 */

data class GetProjectsResponse(
    @SerializedName("projects")
    @Expose
    val projects : List<Project>
) : BaseResponse()