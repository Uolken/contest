package com.uolken.contest.problems.model.dto

data class TestCaseDto(
    val id: Long,
    val input: String,
    val outputs: List<String>
) {
    constructor(id: Long, input: String, output: String): this(id, input, listOf(output))
}
