package xyz.janficko.apphub.data.remote

import kotlinx.coroutines.Deferred
import org.koin.core.KoinComponent
import org.koin.core.inject
import xyz.janficko.apphub.common.Constants
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

    companion object {
        val TAG : String = RemoteRepository::class.java.simpleName
    }

    override fun login(loginRequest: LoginRequest): Deferred<LoginResponse> {
        return service.login(Constants.DEVICE_DESCRIPTION, loginRequest)
    }

    override fun getProjects(token: String, getProjectsRequest: GetProjectsRequest): Deferred<GetProjectsResponse> {
        return service.getProjects(token, getProjectsRequest)
    }

    override fun getJobs(token: String, getJobsRequest : GetJobsRequest): Deferred<GetJobsResponse> {
        return service.getJobs(token, getJobsRequest)
    }

    override fun getArtifacts(token: String, getArtifactsRequest: GetArtifactsRequest): Deferred<GetArtifactsResponse> {
        return service.getArtifacts(token, getArtifactsRequest)
    }

}