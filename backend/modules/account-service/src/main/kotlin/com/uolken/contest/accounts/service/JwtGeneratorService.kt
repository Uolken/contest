package com.uolken.contest.accounts.service

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.uolken.contest.authentication.model.TokenInfo
import com.uolken.contest.authentication.model.dto.UserInfo
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.time.Clock
import java.time.Duration
import java.util.*

interface JwtGeneratorService {
    fun getToken(userInfo: UserInfo): TokenInfo
}


@Service
class JwtGeneratorServiceImpl(
    private val clock: Clock,
    @Value("\${jwt.expiration}")
    private val expiration: Duration,
    private val hmacAlgorithm: Algorithm
): JwtGeneratorService {

    override fun getToken(userInfo: UserInfo): TokenInfo {
        val token = JWT.create()
            .withIssuedAt(Date.from(clock.instant()))
            .withExpiresAt(Date.from(clock.instant().plus(expiration)))
            .withSubject(userInfo.id.toString())
            .withClaim("email", userInfo.email)
            .withClaim("role", userInfo.role.name)
            .withClaim("groupId", userInfo.groupId)

        return TokenInfo(token.sign(hmacAlgorithm), userInfo, expiration)
    }

}
