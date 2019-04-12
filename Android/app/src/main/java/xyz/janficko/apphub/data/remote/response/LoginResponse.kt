package xyz.janficko.apphub.data.remote.response

import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName
import xyz.janficko.apphub.model.User

/**
Created by Jan Ficko on 02/04/19 for Margento.
 */

open class LoginResponse(
    @SerializedName("token")
    @Expose
    val token: String,
    @SerializedName("user")
    @Expose
    val user: User
) : BaseResponse()