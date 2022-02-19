package com.uolken.contest.accounts.model

import com.uolken.contest.authentication.model.dto.UserInfo
import org.springframework.data.annotation.Id
import java.time.Duration
import java.util.*

data class Session(
    @Id
    val refreshToken: String,
    val userInfo: UserInfo,
    val data: String,
    val expireDate: Date,
    val expirationPeriod: Duration
)
