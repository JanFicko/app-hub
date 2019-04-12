package xyz.janficko.apphub.ui.base

/**
Created by Jan Ficko on 22/02/19 for Margento.
 */
sealed class ScreenState <out T> {
    class Loading(val active : Boolean) : ScreenState<Nothing>()
    class Render<T>(val renderState : T) : ScreenState<T>()
}