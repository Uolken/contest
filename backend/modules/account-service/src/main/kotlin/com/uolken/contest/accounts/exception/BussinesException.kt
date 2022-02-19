package com.uolken.contest.accounts.exception

open class BusinessException(
    message: String? = null,
    cause: Throwable? = null,
): RuntimeException(message, cause)