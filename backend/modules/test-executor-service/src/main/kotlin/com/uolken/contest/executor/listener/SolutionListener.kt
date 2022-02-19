package com.uolken.contest.executor.listener

import com.uolken.contest.executor.service.TestValidatorService
import com.uolken.contest.solution.model.SubmissionDto
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.stereotype.Component

@Component
class SolutionListener(
    private val testValidatorService: TestValidatorService
) {
    @RabbitListener(queues = ["solution-test"])
    fun listen(submissionDto: SubmissionDto) {
        testValidatorService.executeTests(submissionDto)
    }
}
