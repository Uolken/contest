package com.uolken.contest.accounts.service

import com.uolken.contest.accounts.model.Session
import com.uolken.contest.accounts.repository.SessionRepository
import com.uolken.contest.authentication.model.dto.UserInfo
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.server.reactive.ServerHttpRequest
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono
import java.time.Clock
import java.time.Duration
import java.util.*

interface SessionService {
    fun createSession(userInfo: UserInfo, request: ServerHttpRequest): Mono<Session>
    fun getSessionByRefreshTokenAndExtendSession(refreshToken: String): Mono<Session>
    fun deleteSession(refreshToken: String)
}

@Service
class SessionServiceImpl(
    private val clock: Clock,
    private val sessionRepository: SessionRepository,
    @Value("\${refresh-token.expiration}")
    private val expirationPeriod: Duration
) : SessionService {
    override fun createSession(userInfo: UserInfo, request: ServerHttpRequest): Mono<Session> {
        return sessionRepository.save(
            Session(
                generateRefreshToken(),
                userInfo,
                extractSessionData(request),
                getExpirationDate(expirationPeriod),
                expirationPeriod
            )
        )
    }

    override fun getSessionByRefreshTokenAndExtendSession(refreshToken: String): Mono<Session> {
        return sessionRepository.findByRefreshToken(refreshToken)
            .flatMap {
                sessionRepository.save(
                    it.copy(
                        expirationPeriod = expirationPeriod,
                        expireDate = getExpirationDate(expirationPeriod)
                    )
                )
            }
    }

    override fun deleteSession(refreshToken: String) {
        sessionRepository.deleteByRefreshToken(refreshToken)
    }

    private fun extractSessionData(request: ServerHttpRequest): String {
        return """IP: ${request.remoteAddress}
User Agent: ${request.headers["User-Agent"]}"""
    }

    private fun generateRefreshToken(): String {
        return UUID.randomUUID().toString()
    }

    private fun getExpirationDate(expirationPeriod: Duration): Date {
        return Date.from(clock.instant().plus(expirationPeriod))
    }
}
