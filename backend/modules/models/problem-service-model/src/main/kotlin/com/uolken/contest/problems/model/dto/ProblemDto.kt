package com.uolken.contest.problems.model.dto

import com.uolken.contest.problems.model.Example
import java.util.*

data class ProblemDto(
    val id: Long,
    val name: String,
    val text: String,
    val authorId: Long,
    val examples: List<Example>
)
