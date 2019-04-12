package xyz.janficko.apphub.data.remote.response

import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName

/**
Created by Jan Ficko on 05/04/19 for Margento.
 */

data class GetArtifactsResponse(
    @SerializedName("outputs")
    @Expose
    val outputs : List<String>
) : BaseResponse()