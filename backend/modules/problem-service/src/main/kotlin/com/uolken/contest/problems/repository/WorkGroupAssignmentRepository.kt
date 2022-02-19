package com.uolken.contest.problems.repository

import com.uolken.contest.problems.model.WorkGroupAssignment
import com.uolken.contest.problems.model.dto.AssignmentId
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Repository
interface WorkGroupAssignmentRepository: ReactiveCrudRepository<WorkGroupAssignment, Long> {
    fun findByGroupIdIn(groupIds: List<Long>): Flux<WorkGroupAssignment>
    fun findByWorkIdIn(workIds: List<Long>): Flux<WorkGroupAssignment>
    fun deleteByWorkId(workId: Long): Mono<Long>
    fun deleteByGroupId(groupId: Long): Mono<Long>
}
