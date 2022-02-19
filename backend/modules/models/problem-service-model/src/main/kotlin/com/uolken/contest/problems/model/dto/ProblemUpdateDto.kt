package com.uolken.contest.problems.model.dto

import com.uolken.contest.problems.model.Example

data class ProblemUpdateDto(
    val id: Long,
    val name: String,
    val text: String,
    val examples: List<Example>,
    val inLibrary: Boolean
)
