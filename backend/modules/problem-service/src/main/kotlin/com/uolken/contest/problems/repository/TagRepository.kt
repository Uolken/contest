package com.uolken.contest.problems.repository

import com.uolken.contest.problems.model.Tag
import org.springframework.data.r2dbc.repository.Modifying
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

interface TagRepository : ReactiveCrudRepository<Tag, Long> {
    @Query("SELECT t.id, t.name FROM tag t JOIN problem_tag pt on t.id = pt.tag_id WHERE pt.problem_id = :problemId")
    fun findByProblemId(problemId: Long): Flux<Tag>
    @Query("SELECT problem_id, t.id, t.name FROM tag t LEFT JOIN problem_tag pt on t.id = pt.tag_id WHERE pt.problem_id in (:ids)")
    fun findByProblemIds(ids: List<Long>): Flux<TagWithProblemId>
    @Modifying
    @Query("DELETE FROM problem_tag pt WHERE pt.problem_id = :problemId")
    fun removeProblemTags(problemId: Long): Mono<Long>
    @Modifying
    @Query("DELETE FROM problem_tag pt WHERE pt.problem_id = :problemId AND pt.tag_id NOT IN (:excludeTags)")
    fun removeProblemTags(problemId: Long, excludeTags: List<Long>): Mono<Long>
    @Modifying
    @Query("INSERT INTO problem_tag (problem_id, tag_id) values (:problemId, :tagId) ON CONFLICT DO NOTHING")
    fun setProblemTags(problemId: Long, tagId: Long): Mono<Long>
}

class TagWithProblemId(
    val problemId: Long,
    id: Long,
    name: String
): Tag(id, name)
