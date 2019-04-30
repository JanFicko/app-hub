package xyz.janficko.apphub.common

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