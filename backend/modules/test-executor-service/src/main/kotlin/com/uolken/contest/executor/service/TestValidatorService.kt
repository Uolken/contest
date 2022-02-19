package com.uolken.contest.executor.service

import com.uolken.contest.solution.model.ExecutionErrorDescription
import com.uolken.contest.solution.model.ProblemSolutionFailReason
import com.uolken.contest.executor.service.integration.ProblemIntegrationService
import com.uolken.contest.executor.service.integration.SolutionIntegrationService
import com.uolken.contest.solution.model.SubmissionDto
import org.springframework.stereotype.Service
import reactor.kotlin.core.publisher.toMono

interface TestValidatorService {
    fun executeTests(submission: SubmissionDto)
}

@Service
class TestValidatorServiceImpl(
    private val problemIntegrationService: ProblemIntegrationService,
    private val solutionIntegrationService: SolutionIntegrationService,
    private val cLanguageCodeExecutorServiceImpl: CLanguageCodeExecutorServiceImpl
): TestValidatorService {

    override fun executeTests(submission: SubmissionDto) {
        val testCases = problemIntegrationService.getTestCases(submission.problemId)
        val executionResult = when (submission.language) {
            "c" -> cLanguageCodeExecutorServiceImpl.execute(
                submission,
                testCases
            )
            else -> ExecutionResult.failedExecution(
                ExecutionErrorDescription(
                    ProblemSolutionFailReason.COMPILATION_ERROR,
                    message = "Language not supported"
                )
            ).toMono()
        }

        solutionIntegrationService.updateSubmissionStatus(submission.id, executionResult)
    }

}
