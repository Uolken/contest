package com.uolken.contest.solution

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(value= HttpStatus.FORBIDDEN, reason="Permission denied")
class PermissionDeniedException: RuntimeException() {
}
