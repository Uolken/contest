package com.uolken.contest.authentication.model.dto

import com.uolken.contest.authentication.model.UserRole
import java.util.*

data class UserInfo(
    val id: Long,
    val email: String,
    val role: UserRole,
    val groupId: Long?
)
