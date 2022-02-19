package com.uolken.contest.accounts.repository

import com.uolken.contest.accounts.model.User
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.relational.core.query.Criteria
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Repository
interface UserRepository : ReactiveCrudRepository<User, Long> {
    fun findByEmail(email: String): Mono<User>
    fun findByGroupId(groupId: Long): Flux<User>
    @Query("UPDATE users SET group_id = :groupId WHERE id IN (:studentIds)")
    fun setGroupIdForUsers(groupId: Long, studentIds: List<Long>): Mono<Long>
    @Query("UPDATE users SET group_id = NULL WHERE group_id = :groupId")
    fun setGroupIdNull(groupId: Long): Mono<Long>
    @Query("UPDATE users SET group_id = NULL WHERE group_id = :groupId AND id NOT IN (:excludeStudents)")
    fun setGroupIdNull(groupId: Long, excludeStudents: List<Long>): Mono<Long>
}

