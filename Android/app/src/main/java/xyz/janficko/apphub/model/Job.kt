package xyz.janficko.apphub.model

import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName
import java.util.*

data class Job(
    @SerializedName("_id")
    @Expose
    val _id : String,
    @SerializedName("title")
    @Expose
    val title : String,
    @SerializedName("changeLog")
    @Expose
    val changeLog : String? = null,
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
)