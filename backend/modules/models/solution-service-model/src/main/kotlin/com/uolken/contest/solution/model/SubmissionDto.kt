package com.uolken.contest.solution.model

import java.time.LocalDateTime

data class SubmissionDto(
    val id: String,
    val problemId: Long,
    val submitterId: Long,
    val language: String,
    val code: String,
    val status: SubmissionStatus,
    val submitted: LocalDateTime,
    val executionResult: ExecutionResult? = null
)

