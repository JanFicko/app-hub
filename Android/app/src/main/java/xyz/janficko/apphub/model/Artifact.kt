package xyz.janficko.apphub.model

import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName

/**
Created by Jan Ficko on 28/02/19 for Margento.
 */

data class Artifact(
    @SerializedName("outputhPath")
    @Expose
    val outputhPath : String
)