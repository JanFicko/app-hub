package xyz.janficko.apphub.data.remote.response

import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName
import xyz.janficko.apphub.model.User

open class LoginResponse(
    @SerializedName("token")
    @Expose
    val token: String,
    @SerializedName("user")
    @Expose
    val user: User
) : BaseResponse()