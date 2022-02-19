package com.uolken.contest.accounts.repository

import com.uolken.contest.accounts.model.Session
import org.reactivestreams.Publisher
import org.springframework.data.repository.NoRepositoryBean
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.toMono
import java.util.*
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.ConcurrentMap

interface SessionRepository {
    fun findByRefreshToken(refreshToken: String): Mono<Session>
    fun deleteByRefreshToken(refreshToken: String)
    fun save(entity: Session): Mono<Session>
}


@Repository
class SessionRepositoryImpl: SessionRepository {
    private val store: ConcurrentMap<String, Session> = ConcurrentHashMap()

    override fun findByRefreshToken(refreshToken: String): Mono<Session> =
        store[refreshToken].toMono()

    override fun deleteByRefreshToken(refreshToken: String) {
        store.remove(refreshToken)
    }

    override fun save(entity: Session): Mono<Session> {
        store[entity.refreshToken] = entity
        return entity.toMono()
    }


}
