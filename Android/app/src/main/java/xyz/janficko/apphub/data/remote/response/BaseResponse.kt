package xyz.janficko.apphub.data.remote.response

import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName

/**
Created by Jan Ficko on 02/04/19 for Margento.
 */

open class BaseResponse{

    @SerializedName("code")
    @Expose
    var code : Int = -1
    @SerializedName("description")
    @Expose
    var description : String? = null

}