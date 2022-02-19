package com.uolken.contest.executor.service

import com.uolken.contest.problems.model.dto.TestCaseDto
import com.uolken.contest.common.maxOfNullable
import com.uolken.contest.solution.model.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

interface CodeExecutorService {
    fun execute(submission: SubmissionDto, cases: Flux<TestCaseDto>): Mono<ExecutionResult>

}

class ExecutionResultAccumulator(
    var maxMemoryUsage: Long? = null,
    var maxTime: Long? = null,
    var error: ExecutionErrorDescription? = null
) {
    fun update(testCaseResult: TestCaseExecutionResult): ExecutionResultAccumulator {
        if (error != null) return this
        if (!testCaseResult.isSucceed) {
            error = ExecutionErrorDescription(
                ProblemSolutionFailReason.INCORRECT_OUTPUT,
                testCaseResult
            )
        }
        maxMemoryUsage = maxOfNullable(maxMemoryUsage, testCaseResult.memoryUsage)
        maxTime = maxOfNullable(maxTime, testCaseResult.time)
        return this
    }

    fun toExecutionResult(): ExecutionResult =
        if (error != null) ExecutionResult.failedExecution(error!!)
        else ExecutionResult.succeedExecution(ExecutionMetrics(maxMemoryUsage ?: 0, maxTime ?: 0))
}

