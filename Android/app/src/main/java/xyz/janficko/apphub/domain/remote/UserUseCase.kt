package xyz.janficko.apphub.domain.remote

import kotlinx.coroutines.Deferred
import xyz.janficko.apphub.data.remote.RemoteRepositoryContract
import xyz.janficko.apphub.data.remote.request.LoginRequest
import xyz.janficko.apphub.data.remote.response.LoginResponse

class UserUseCase(remoteRepository: RemoteRepositoryContract) : BaseRemoteUseCase(remoteRepository) {

    fun login(loginRequest: LoginRequest) : Deferred<LoginResponse> {
        return remoteRepository.login(loginRequest)
    }

}