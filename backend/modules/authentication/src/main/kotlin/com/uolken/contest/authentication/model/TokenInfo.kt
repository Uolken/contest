package com.uolken.contest.authentication.model

import com.uolken.contest.authentication.model.dto.UserInfo
import java.time.Duration

data class TokenInfo(
    val token: String,
    val userInfo: UserInfo,
    val expirationPeriod: Duration
)
