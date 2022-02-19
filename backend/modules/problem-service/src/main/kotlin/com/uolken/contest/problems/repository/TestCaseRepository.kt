package com.uolken.contest.problems.repository

import com.uolken.contest.problems.model.TestCase
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

interface TestCaseRepository: ReactiveCrudRepository<TestCase, Long> {
    fun findByProblemId(problemId: Long): Flux<TestCase>
    fun countByProblemId(problemId: Long): Mono<Long>
    @Query("DELETE FROM test_case t WHERE t.id NOT IN (:testCaseIds)")
    fun deleteByIdNotIn(testCaseIds: List<Long>): Mono<Long>
}
