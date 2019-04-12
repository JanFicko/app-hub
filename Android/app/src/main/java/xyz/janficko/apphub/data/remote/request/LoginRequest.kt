package xyz.janficko.apphub.data.remote.request

import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName

/**
Created by Jan Ficko on 02/04/19 for Margento.
 */
data class LoginRequest(
    @SerializedName("email")
    @Expose
    val email: String,
    @SerializedName("password")
    @Expose
    val password: String,
    @SerializedName("device")
    @Expose
    val device: String
)