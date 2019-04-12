package xyz.janficko.apphub.ui.artifact

/**
Created by Jan Ficko on 05/04/19 for Margento.
 */
sealed class ArtifactState {

    class ShowArtifacts(val outputs : List<String>) : ArtifactState()
    class ShowError(val code : Int) : ArtifactState()

}