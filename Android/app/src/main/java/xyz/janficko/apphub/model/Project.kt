package xyz.janficko.apphub.model

import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName

data class Project(
    @SerializedName("_id")
    @Expose
    val _id : String,
    @SerializedName("projectId")
    @Expose
    val projectId : Int,
    @SerializedName("icon")
    @Expose
    val icon : String,
    @SerializedName("name")
    @Expose
    val name : String,
    @SerializedName("path")
    @Expose
    val path : String,
    @SerializedName("platform")
    @Expose
    val platform : String,
    @SerializedName("jobs")
    @Expose
    val jobs : MutableList<Job>
)