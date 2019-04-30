package xyz.janficko.apphub.data.remote.response

import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName

open class BaseResponse{

    @SerializedName("code")
    @Expose
    var code : Int = -1
    @SerializedName("description")
    @Expose
    var description : String? = null

}