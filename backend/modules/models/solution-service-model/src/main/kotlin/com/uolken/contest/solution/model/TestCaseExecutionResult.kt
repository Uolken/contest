package com.uolken.contest.solution.model

import com.fasterxml.jackson.annotation.JsonIgnore
import com.uolken.contest.problems.model.dto.TestCaseDto

class TestCaseExecutionResult(
    val testCase: TestCaseDto,
    val actualOutput: String,
    val memoryUsage: Long? = null,
    val time: Long? = null
) {
    @get:JsonIgnore
    val isSucceed: Boolean
        get() = testCase.outputs.contains(actualOutput)

    companion object {

    }
}

data class TestExecutionEvent(
    val submitterId: Long,
    val problemId: Long,
    val submissionId: String,
    val type: TestExecutionEventType
) {
    constructor(submission: SubmissionDto, type: TestExecutionEventType):
        this(
            submission.submitterId,
            submission.problemId,
            submission.id,
            type
        )

}

enum class TestExecutionEventType {
    START_EXECUTION,
    TEST_CASE_SUCCEED,
    TEST_CASE_FAILED,
    COMPILATION_FAILED,
    SUBMISSION_PASSED,
    SUBMISSION_FAILED
}
