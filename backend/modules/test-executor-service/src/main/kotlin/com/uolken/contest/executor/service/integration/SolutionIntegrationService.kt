package com.uolken.contest.executor.service.integration

import com.uolken.contest.executor.service.ExecutionResult
import org.springframework.amqp.core.AmqpTemplate
import org.springframework.http.HttpMethod
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.reactive.function.client.body
import reactor.core.publisher.Mono

interface SolutionIntegrationService {
    fun updateSubmissionStatus(submissionId: String, executionResult: Mono<ExecutionResult>)
}

@Service
class SolutionIntegrationServiceImpl(
    private val webClient: WebClient.Builder,
    private val template: AmqpTemplate
): SolutionIntegrationService {
    override fun updateSubmissionStatus(submissionId: String, executionResult: Mono<ExecutionResult>) {
//        template.convertAndSend("test-result", submissionId.toString(), executionResult)
        webClient.build()
            .method(HttpMethod.POST)
            .uri("http://solution-service/submissions/${submissionId}")
            .body(executionResult)
            .retrieve()
            .toBodilessEntity()
            .subscribe { println(it.statusCode) }
    }
}
