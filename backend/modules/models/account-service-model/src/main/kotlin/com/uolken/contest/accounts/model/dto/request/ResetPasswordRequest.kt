package com.uolken.contest.accounts.model.dto.request

data class ResetPasswordRequest(
    val password: String,
    val newPassword: String
)
