package com.uolken.contest.accounts.exception

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(value= HttpStatus.UNAUTHORIZED, reason="User with this email and password was not found")
class InvalidCredentialsException(val email: String): BusinessException()
