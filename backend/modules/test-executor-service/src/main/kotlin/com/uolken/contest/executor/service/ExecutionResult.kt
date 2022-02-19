package com.uolken.contest.executor.service

import com.uolken.contest.solution.model.ExecutionErrorDescription
import com.uolken.contest.solution.model.ProblemSolutionFailReason
import com.uolken.contest.solution.model.ExecutionMetrics

class ExecutionResult private constructor(
    val statistic: ExecutionMetrics?,
    val error: ExecutionErrorDescription?
) {
    val testsPassed: Boolean
        get() = statistic != null

    companion object {
        fun succeedExecution(executionMetrics: ExecutionMetrics): ExecutionResult =
            ExecutionResult(executionMetrics, null)

        fun failedExecution(error: ExecutionErrorDescription): ExecutionResult =
            ExecutionResult(null, error)

        fun failedCompilation(errorMessage: String?): ExecutionResult =
            ExecutionResult(
                null,
                ExecutionErrorDescription(ProblemSolutionFailReason.COMPILATION_ERROR, message = errorMessage)
            )
    }
}

