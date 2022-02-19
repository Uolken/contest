package com.uolken.contest.solution.model

import org.bson.types.ObjectId
import org.springframework.data.mongodb.core.mapping.MongoId
import java.time.LocalDateTime

data class Submission(
    @MongoId val id: ObjectId,
    val problemId: Long,
    val submitterId: Long,
    val language: String,
    val code: String,
    val status: SubmissionStatus,
    val submitted: LocalDateTime,
    val executionResult: ExecutionResult? = null
) {
    fun toDto(): SubmissionDto = SubmissionDto(id.toHexString(), problemId, submitterId, language, code, status, submitted, executionResult)
}


