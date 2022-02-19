package com.uolken.contest.executor.service.integration

import com.uolken.contest.problems.model.dto.TestCaseDto
import org.springframework.http.HttpMethod
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.reactive.function.client.bodyToFlux
import org.springframework.web.reactive.function.client.toEntityFlux
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

interface ProblemIntegrationService {
    fun getTestCases(problemId: Long): Flux<TestCaseDto>
}

@Service
class ProblemIntegrationServiceImpl(
    private val webClient: WebClient.Builder
): ProblemIntegrationService {
    override fun getTestCases(problemId: Long): Flux<TestCaseDto>{
        return webClient.build().method(HttpMethod.GET)
            .uri("http://problem-service/problems/$problemId/test-cases")
            .retrieve()
            .bodyToFlux()
    }
}
