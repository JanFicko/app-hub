package xyz.janficko.apphub.ui.base

import xyz.janficko.apphub.common.ResponseState

sealed class ScreenState <out T> {
    class Loading(val active : Boolean) : ScreenState<Nothing>()
    class Render<T>(val renderState : T) : ScreenState<T>()
    class GenericErrors(val error : ResponseState) : ScreenState<Nothing>()
    class Error(val error : Int) : ScreenState<Nothing>()
}