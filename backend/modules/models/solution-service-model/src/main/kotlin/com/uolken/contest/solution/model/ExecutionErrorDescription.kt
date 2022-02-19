package com.uolken.contest.solution.model

data class ExecutionErrorDescription(
    val failReason: ProblemSolutionFailReason,
    val testCaseExecutionResult: TestCaseExecutionResult? = null,
    val message: String? = null
)
