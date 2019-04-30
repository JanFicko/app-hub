package xyz.janficko.apphub.model

import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName
import java.util.*

class User(
    @SerializedName("_id")
    @Expose
    val _id : String,
    @SerializedName("email")
    @Expose
    val email : String,
    @SerializedName("isAdmin")
    @Expose
    val isAdmin : Boolean,
    @SerializedName("isBanned")
    @Expose
    val isBanned : Boolean,
    @SerializedName("registerTime")
    @Expose
    val registerTime : Date
)