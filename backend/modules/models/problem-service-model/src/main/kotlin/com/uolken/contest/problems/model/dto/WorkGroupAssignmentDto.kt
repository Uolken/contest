package com.uolken.contest.problems.model.dto

import com.uolken.contest.problems.model.WorkType
import java.time.LocalDateTime

data class WorkGroupAssignmentDto(
    val workId: Long,
    val groupId: Long,
    val type: WorkType,
    val start: LocalDateTime?,
    val end: LocalDateTime?,
)

data class AssignmentId(val workId: Long, val groupId: Long) {
    fun toQueryString() = "(${workId},${groupId})"
}
