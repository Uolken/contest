package com.uolken.contest.problems.repository

import com.uolken.contest.problems.model.Work
import org.springframework.data.r2dbc.repository.Modifying
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Mono

interface WorkRepository: ReactiveCrudRepository<Work, Long> {

    @Modifying
    @Query("DELETE FROM work_problem wp WHERE wp.work_id = :workId")
    fun removeProblems(workId: Long): Mono<Long>

    @Modifying
    @Query("INSERT INTO work_problem (work_id, problem_id) VALUES (:workId, :problemId)")
    fun addTask(workId: Long, problemId: Long): Mono<Long>
}
