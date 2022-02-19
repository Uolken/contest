package com.uolken.contest.problems.model.dto

import com.uolken.contest.problems.model.WorkType
import java.time.OffsetDateTime

data class WorkUpdateDto(
    val id: Long?,
    val name: String,
    val type: WorkType,
    val start: OffsetDateTime?,
    val end: OffsetDateTime?,
    val problemIds: List<Long>
)

data class WorkAssignmentDto(
    val workId: Long?,
    val groupId: Long?,
    val type: WorkType,
    val start: OffsetDateTime?,
    val end: OffsetDateTime?,
)
