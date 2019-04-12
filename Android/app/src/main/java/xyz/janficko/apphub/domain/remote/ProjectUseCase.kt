package xyz.janficko.apphub.domain.remote

import kotlinx.coroutines.Deferred
import xyz.janficko.apphub.data.remote.RemoteRepositoryContract
import xyz.janficko.apphub.data.remote.request.GetArtifactsRequest
import xyz.janficko.apphub.data.remote.request.GetJobsRequest
import xyz.janficko.apphub.data.remote.request.GetProjectsRequest
import xyz.janficko.apphub.data.remote.response.GetArtifactsResponse
import xyz.janficko.apphub.data.remote.response.GetJobsResponse
import xyz.janficko.apphub.data.remote.response.GetProjectsResponse

/**
Created by Jan Ficko on 02/04/19 for Margento.
 */

class ProjectUseCase(remoteRepository: RemoteRepositoryContract) : BaseRemoteUseCase(remoteRepository) {

    fun getProjects(token: String, getProjectsRequest: GetProjectsRequest) : Deferred<GetProjectsResponse> {
        return remoteRepository.getProjects(token, getProjectsRequest)
    }

    fun getJobs(token: String, getJobsRequest: GetJobsRequest) : Deferred<GetJobsResponse> {
        return remoteRepository.getJobs(token, getJobsRequest)
    }

    fun getArtifacts(token: String, getArtifactsRequest: GetArtifactsRequest) : Deferred<GetArtifactsResponse> {
        return remoteRepository.getArtifacts(token, getArtifactsRequest)
    }

}