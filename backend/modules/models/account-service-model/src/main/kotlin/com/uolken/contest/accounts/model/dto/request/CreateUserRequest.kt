package com.uolken.contest.accounts.model.dto.request

import com.uolken.contest.authentication.model.UserRole

data class CreateUserRequest(
    val firstName: String,
    val lastName: String,
    val email: String,
    val groupId: Long?,
    val role: UserRole
)
