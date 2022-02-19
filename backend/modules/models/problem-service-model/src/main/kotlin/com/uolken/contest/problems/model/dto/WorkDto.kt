package com.uolken.contest.problems.model.dto

import com.uolken.contest.problems.model.WorkType
import java.time.LocalDateTime
import java.util.*

data class WorkDto(
    val id: Long,
    val name: String,
    val type: WorkType,
    val start: LocalDateTime?,
    val end: LocalDateTime?,
    val authorId: Long
)
