package xyz.janficko.apphub.ui.artifact

sealed class ArtifactState {

    class ShowArtifacts(val outputs : List<String>) : ArtifactState()

}