package com.uolken.contest.accounts.model.dto

import com.uolken.contest.authentication.model.UserRole
import java.util.*

data class UserDto(
    var id: Long,
    val email: String,
    val firstName: String,
    val lastName: String,
    val role: UserRole,
    val groupId: Long?
)

