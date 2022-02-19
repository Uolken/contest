package com.uolken.contest.gateway.service

import com.auth0.jwt.JWT
import org.springframework.context.annotation.Lazy
import org.springframework.stereotype.Service
import java.time.Clock
import java.util.*

interface JwtDecoderService {
    fun decodeUserId(token: String?): Long?
}

@Lazy
@Service
class JwtDecoderServiceImpl(
    private val clock: Clock
): JwtDecoderService {
    override fun decodeUserId(token: String?): Long? {
        token ?: return null
        return try {
            val decodedJWT = JWT.decode(token)
            val expired = decodedJWT.expiresAt.before(Date.from(clock.instant()))
            if (expired) return null

            return decodedJWT.subject.toLongOrNull()
        } catch (e: Exception) {
            null
        }
    }
}
