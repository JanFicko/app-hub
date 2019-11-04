package xyz.janficko.apphub.data.remote

import kotlinx.coroutines.Deferred
import org.koin.core.KoinComponent
import org.koin.core.inject
import xyz.janficko.apphub.data.remote.request.GetArtifactsRequest
import xyz.janficko.apphub.data.remote.request.GetJobsRequest
import xyz.janficko.apphub.data.remote.request.GetProjectsRequest
import xyz.janficko.apphub.data.remote.request.LoginRequest
import xyz.janficko.apphub.data.remote.response.GetArtifactsResponse
import xyz.janficko.apphub.data.remote.response.GetJobsResponse
import xyz.janficko.apphub.data.remote.response.GetProjectsResponse
import xyz.janficko.apphub.data.remote.response.LoginResponse

class RemoteRepository : RemoteRepositoryContract, KoinComponent {

    val service : ApiService by inject()

    override fun login(loginRequest: LoginRequest): Deferred<LoginResponse> {
        return service.login(loginRequest)
    }

    override fun getProjects(getProjectsRequest: GetProjectsRequest): Deferred<GetProjectsResponse> {
        return service.getProjects(getProjectsRequest)
    }

    override fun getJobs(getJobsRequest : GetJobsRequest): Deferred<GetJobsResponse> {
        return service.getJobs(getJobsRequest)
    }

    override fun getArtifacts(getArtifactsRequest: GetArtifactsRequest): Deferred<GetArtifactsResponse> {
        return service.getArtifacts(getArtifactsRequest)
    }

}