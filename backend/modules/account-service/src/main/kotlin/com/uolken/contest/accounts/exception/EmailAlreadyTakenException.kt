package com.uolken.contest.accounts.exception

class EmailAlreadyTakenException(
    val email: String
): BusinessException("User with email: $email already exists")