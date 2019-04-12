package xyz.janficko.apphub.model

import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName
import java.util.*

/**
Created by Jan Ficko on 02/04/19 for Margento.
 */

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