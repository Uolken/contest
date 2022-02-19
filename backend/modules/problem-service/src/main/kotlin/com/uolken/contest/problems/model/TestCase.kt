package com.uolken.contest.problems.model

import org.springframework.data.annotation.Id

data class TestCase(
    @Id val id: Long,
    val problemId: Long,
    val input: String,
    val outputs: List<String>
)

