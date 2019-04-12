package xyz.janficko.apphub.model

import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName
import xyz.janficko.apphub.data.remote.response.BaseResponse
import java.util.*

/**
Created by Jan Ficko on 26/02/19 for Margento.
 */

data class Job(
    @SerializedName("_id")
    @Expose
    val _id : String,
    @SerializedName("title")
    @Expose
    val title : String,
    @SerializedName("jobId")
    @Expose
    val jobId : Int,
    @SerializedName("fullDisplayName")
    @Expose
    val fullDisplayName : String,
    @SerializedName("name")
    @Expose
    var name : String,
    @SerializedName("finishTime")
    @Expose
    val finishTime : Date
) : BaseResponse()