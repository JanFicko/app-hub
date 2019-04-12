package xyz.janficko.apphub.common

/**
Created by Jan Ficko on 22/02/19 for Margento.
 */

enum class ResponseState {
    LOADING,
    NOT_LOADING,
    ERROR,
    SUCCESS,
    UNKNOWN_ERROR,
    NO_INTERNET,
    NO_SERVER,
    NO_TOKEN
}