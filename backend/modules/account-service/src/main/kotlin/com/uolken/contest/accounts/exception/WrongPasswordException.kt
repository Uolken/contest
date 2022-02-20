package com.uolken.contest.accounts.exception

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(value= HttpStatus.UNAUTHORIZED, reason="Wrong password")
class WrongPasswordException(val email: String): BusinessException()
