package xyz.janficko.apphub.data.remote

import kotlinx.coroutines.Deferred
import retrofit2.http.*
import xyz.janficko.apphub.data.remote.request.GetArtifactsRequest
import xyz.janficko.apphub.data.remote.request.GetJobsRequest
import xyz.janficko.apphub.data.remote.request.GetProjectsRequest
import xyz.janficko.apphub.data.remote.request.LoginRequest
import xyz.janficko.apphub.data.remote.response.GetArtifactsResponse
import xyz.janficko.apphub.data.remote.response.GetJobsResponse
import xyz.janficko.apphub.data.remote.response.GetProjectsResponse
import xyz.janficko.apphub.data.remote.response.LoginResponse

interface ApiService {

    @POST("api/users/login")
    fun login(@Body loginRequest: LoginRequest) : Deferred<LoginResponse>

    @POST("api/projects")
    fun getProjects(@Body getProjectsRequest: GetProjectsRequest) : Deferred<GetProjectsResponse>

    @POST("api/projects/jobs")
    fun getJobs(@Body getJobsRequest: GetJobsRequest) : Deferred<GetJobsResponse>

    @POST("api/projects/androidArtifacts")
    fun getArtifacts(@Body getArtifactsRequest: GetArtifactsRequest) : Deferred<GetArtifactsResponse>

}