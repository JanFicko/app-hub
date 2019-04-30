package xyz.janficko.apphub.data.remote.response

import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName

data class GetArtifactsResponse(
    @SerializedName("outputs")
    @Expose
    val outputs : List<String>
) : BaseResponse()