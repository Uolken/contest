package com.uolken.contest.accounts.model.dto.response

import com.uolken.contest.authentication.model.dto.UserInfo
import java.time.Duration

data class SessionResponse(
    val userInfo: UserInfo,
    val jwtExpirationPeriod: Duration,
    val refreshTokenExpirationPeriod: Duration
)
