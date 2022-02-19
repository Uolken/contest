package com.uolken.contest.authentication.service

import com.auth0.jwt.JWT
import com.uolken.contest.authentication.model.CustomUserAuthentication
import com.uolken.contest.authentication.model.UserRole
import com.uolken.contest.authentication.model.dto.UserInfo
import org.springframework.context.annotation.Lazy
import org.springframework.stereotype.Service
import java.time.Clock
import java.util.*

interface JwtDecoderService {
    fun decode(token: String?): CustomUserAuthentication?
}

@Lazy
@Service
class JwtDecoderServiceImpl(
    private val clock: Clock
) : JwtDecoderService {
    override fun decode(token: String?): CustomUserAuthentication? {
        token ?: return null
        return try {
            val decodedJWT = JWT.decode(token)

            val userInfo = UserInfo(
                decodedJWT.subject.toLong(),
                decodedJWT.getClaim("email").asString(),
                UserRole.valueOf(decodedJWT.getClaim("role").asString()),
                decodedJWT.getClaim("groupId")?.asLong(),
            )

            val expired = decodedJWT.expiresAt.before(Date.from(clock.instant()))
            CustomUserAuthentication(userInfo, expired, token)
        } catch (e: Exception) {
            null
        }
    }
}
