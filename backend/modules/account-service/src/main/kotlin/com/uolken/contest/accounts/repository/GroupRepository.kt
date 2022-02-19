package com.uolken.contest.accounts.repository

import com.uolken.contest.accounts.model.Group
import com.uolken.contest.accounts.model.User
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.util.*

@Repository
interface GroupRepository : ReactiveCrudRepository<Group, Long> {
    fun findByName(name: String): Mono<Group>
    @Query("SELECT g.* FROM groups g JOIN users u ON u.group_id=g.id WHERE u.id=:student_id")
    fun findByStudentId(studentId: Long): Mono<Group>

}

