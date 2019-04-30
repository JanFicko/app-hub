package xyz.janficko.apphub.model

import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName

data class Artifact(
    @SerializedName("outputhPath")
    @Expose
    val outputhPath : String
)