package com.uolken.contest.problems.repository

import com.uolken.contest.problems.model.Example
import com.uolken.contest.problems.model.Problem
import io.r2dbc.postgresql.codec.Json
import org.springframework.data.domain.Pageable
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.util.*

interface ProblemRepository : ReactiveCrudRepository<Problem, Long> {
    @Query("SELECT wp.work_id, p.* FROM problem p JOIN work_problem wp on wp.problem_id = p.id WHERE wp.work_id IN (:workIds)")
    fun findByWorkIds(workIds: List<Long>): Flux<ProblemWithWorkId>
    @Query("SELECT p.* FROM problem p JOIN work_problem wp on wp.problem_id = p.id WHERE wp.work_id = :workIds")
    fun findByWorkId(id: Long): Flux<Problem>
    @Query("SELECT p.* FROM problem p JOIN work_problem wp on p.id = wp.problem_id WHERE wp.work_id=:workId AND wp.problem_id=:id")
    fun findByIdAndWorkId(workId: Long, id: Long): Mono<Problem>
    fun findByInLibraryTrue(pageable: Pageable): Flux<Problem>
}

class ProblemWithWorkId(
    val workId: Long,
    id: Long,
    name: String,
    text: String,
    authorId: Long,
    examples: Json,
    inLibrary: Boolean
): Problem(id, name, text, authorId, examples, inLibrary)

