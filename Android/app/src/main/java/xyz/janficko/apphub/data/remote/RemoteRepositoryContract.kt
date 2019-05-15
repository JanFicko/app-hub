package xyz.janficko.apphub.data.remote

import kotlinx.coroutines.Deferred
import xyz.janficko.apphub.data.remote.request.GetArtifactsRequest
import xyz.janficko.apphub.data.remote.request.GetJobsRequest
import xyz.janficko.apphub.data.remote.request.GetProjectsRequest
import xyz.janficko.apphub.data.remote.request.LoginRequest
import xyz.janficko.apphub.data.remote.response.GetArtifactsResponse
import xyz.janficko.apphub.data.remote.response.GetJobsResponse
import xyz.janficko.apphub.data.remote.response.GetProjectsResponse
import xyz.janficko.apphub.data.remote.response.LoginResponse

interface RemoteRepositoryContract {

    fun login(loginRequest: LoginRequest) : Deferred<LoginResponse>

    fun getProjects(getProjectsRequest: GetProjectsRequest) : Deferred<GetProjectsResponse>

    fun getJobs(getJobsRequest : GetJobsRequest) : Deferred<GetJobsResponse>

    fun getArtifacts(getArtifactsRequest: GetArtifactsRequest) : Deferred<GetArtifactsResponse>

}