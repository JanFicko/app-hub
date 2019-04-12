package xyz.janficko.apphub.domain.remote

import xyz.janficko.apphub.data.remote.RemoteRepositoryContract

abstract class BaseRemoteUseCase(protected val remoteRepository: RemoteRepositoryContract)