package com.uolken.contest.accounts.model.dto.request;

data class SignUpRequest(
    val email: String,
    val firstName: String,
    val lastName: String,
    val password: String,
)
