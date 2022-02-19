package com.uolken.contest.problems.controller

import com.uolken.contest.problems.model.TestCase
import com.uolken.contest.problems.model.dto.TestCaseDto
import com.uolken.contest.problems.service.TestCaseService
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@RestController
class TestCaseController(
    private val testCaseService: TestCaseService
) {

    @GetMapping("/problems/{problemId}/test-cases")
    fun getProblemTestCases(@PathVariable problemId: Long): Flux<TestCase> {
        return testCaseService.getProblemTestCases(problemId)
    }

    @GetMapping("/problems/{problemId}/test-cases/count")
    fun getProblemTestCasesCount(@PathVariable problemId: Long): Mono<Long> {
        return testCaseService.getProblemTestCasesCount(problemId)
    }
    @PostMapping("/problems/{problemId}/test-cases/save")
    fun saveTestCases(
        @PathVariable problemId: Long,
        @RequestBody testCases: List<TestCaseDto>
    ): Mono<Long> {
        return testCaseService.save(problemId, testCases)
    }


}
