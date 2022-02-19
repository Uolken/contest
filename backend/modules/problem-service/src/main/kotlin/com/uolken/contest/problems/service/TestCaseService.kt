package com.uolken.contest.problems.service

import com.uolken.contest.problems.model.TestCase
import com.uolken.contest.problems.model.dto.TestCaseDto
import com.uolken.contest.problems.repository.TestCaseRepository
import org.springframework.r2dbc.core.DatabaseClient
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

interface TestCaseService {
    fun getProblemTestCases(problemId: Long): Flux<TestCase>
    fun getProblemTestCasesCount(problemId: Long): Mono<Long>
    fun save(problemId: Long, testCases: List<TestCaseDto>): Mono<Long>

}

@Service
class TestCaseServiceImpl(
    private val testCaseRepository: TestCaseRepository,
    private val databaseClient: DatabaseClient
): TestCaseService {
    override fun getProblemTestCases(problemId: Long): Flux<TestCase> {
        return testCaseRepository.findByProblemId(problemId)
    }

    override fun getProblemTestCasesCount(problemId: Long): Mono<Long> {
        return testCaseRepository.countByProblemId(problemId)
    }

    override fun save(problemId: Long, testCases: List<TestCaseDto>): Mono<Long> {
        val idsToDeleteStr = if (testCases.isNotEmpty()) "AND t.id NOT IN (${testCases.joinToString { it.id.toString() }})" else ""
        val deleted = databaseClient.sql("DELETE FROM test_case t WHERE t.problem_id = ${problemId} $idsToDeleteStr")
            .map { row -> row[0] as Long }
            .first().toFuture().get()
        return testCaseRepository.saveAll(testCases.map { TestCase(it.id, problemId, it.input, it.outputs) })
            .count()
    }

}
