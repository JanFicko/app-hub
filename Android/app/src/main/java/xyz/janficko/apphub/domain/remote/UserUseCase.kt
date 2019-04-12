package xyz.janficko.apphub.domain.remote

import kotlinx.coroutines.Deferred
import xyz.janficko.apphub.data.remote.RemoteRepositoryContract
import xyz.janficko.apphub.data.remote.request.LoginRequest
import xyz.janficko.apphub.data.remote.response.LoginResponse

/**
Created by Jan Ficko on 02/04/19 for Margento.
 */

class UserUseCase(remoteRepository: RemoteRepositoryContract) : BaseRemoteUseCase(remoteRepository) {

    fun login(loginRequest: LoginRequest) : Deferred<LoginResponse> {
        return remoteRepository.login(loginRequest)
    }

}