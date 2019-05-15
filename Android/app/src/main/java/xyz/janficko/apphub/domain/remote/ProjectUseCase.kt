package xyz.janficko.apphub.domain.remote

import kotlinx.coroutines.Deferred
import xyz.janficko.apphub.data.remote.RemoteRepositoryContract
import xyz.janficko.apphub.data.remote.request.GetArtifactsRequest
import xyz.janficko.apphub.data.remote.request.GetJobsRequest
import xyz.janficko.apphub.data.remote.request.GetProjectsRequest
import xyz.janficko.apphub.data.remote.response.GetArtifactsResponse
import xyz.janficko.apphub.data.remote.response.GetJobsResponse
import xyz.janficko.apphub.data.remote.response.GetProjectsResponse

class ProjectUseCase(remoteRepository: RemoteRepositoryContract) : BaseRemoteUseCase(remoteRepository) {

    fun getProjects(getProjectsRequest: GetProjectsRequest) : Deferred<GetProjectsResponse> {
        return remoteRepository.getProjects(getProjectsRequest)
    }

    fun getJobs(getJobsRequest: GetJobsRequest) : Deferred<GetJobsResponse> {
        return remoteRepository.getJobs(getJobsRequest)
    }

    fun getArtifacts(getArtifactsRequest: GetArtifactsRequest) : Deferred<GetArtifactsResponse> {
        return remoteRepository.getArtifacts(getArtifactsRequest)
    }

}