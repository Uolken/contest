package com.uolken.contest.problems.repository

import com.uolken.contest.problems.model.Tag
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Flux

interface TagRepository : ReactiveCrudRepository<Tag, Long> {
    @Query("SELECT t.id, t.name FROM tag t JOIN problem_tag pt on t.id = pt.tag_id WHERE pt.problem_id = :problemId")
    fun findByProblemId(problemId: Long): Flux<Tag>
    @Query("SELECT problem_id, t.id, t.name FROM tag t LEFT JOIN problem_tag pt on t.id = pt.tag_id WHERE pt.problem_id in (:ids)")
    fun findByProblemIds(ids: List<Long>): Flux<TagWithProblemId>
}

class TagWithProblemId(
    val problemId: Long,
    id: Long,
    name: String
): Tag(id, name)
