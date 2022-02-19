package com.uolken.contest.problems.service

import com.uolken.contest.problems.model.WorkGroupAssignment
import com.uolken.contest.problems.model.dto.AssignmentId
import com.uolken.contest.problems.model.dto.WorkAssignmentDto
import com.uolken.contest.problems.repository.WorkGroupAssignmentRepository
import org.springframework.r2dbc.core.DatabaseClient
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import java.time.LocalDateTime

interface WorkGroupAssignmentService {

    fun getAssignmentsByGroupIds(groupIds: List<Long>): Flux<WorkGroupAssignment>
    fun getAssignmentsByWorkIds(workIds: List<Long>): Flux<WorkGroupAssignment>
    fun getAssignmentsIds(assignmentIds: List<AssignmentId>): Flux<WorkGroupAssignment>
    fun saveWorkAssignments(workId: Long, workAssignments: List<WorkAssignmentDto>): Flux<Long>
    fun saveGroupAssignments(groupId: Long, workAssignments: List<WorkAssignmentDto>): Flux<Long>
}

@Service
class WorkGroupAssignmentServiceImpl(
    private val workGroupAssignmentRepository: WorkGroupAssignmentRepository,
    private val databaseClient: DatabaseClient
) : WorkGroupAssignmentService {

    override fun getAssignmentsByGroupIds(groupIds: List<Long>): Flux<WorkGroupAssignment> {
        return workGroupAssignmentRepository.findByGroupIdIn(groupIds)
    }

    override fun getAssignmentsByWorkIds(workIds: List<Long>): Flux<WorkGroupAssignment> {
        return workGroupAssignmentRepository.findByWorkIdIn(workIds)
    }

    override fun getAssignmentsIds(assignmentIds: List<AssignmentId>): Flux<WorkGroupAssignment> {
        val assignmentIdsStr = assignmentIds.joinToString { it.toQueryString() }
        return databaseClient.sql("SELECT * FROM work_group_assignment a WHERE (a.work_id, a.group_id) IN ($assignmentIdsStr)")
            .map { row -> WorkGroupAssignment.fromRow(row) }
            .all()
    }

    override fun saveWorkAssignments(
        workId: Long,
        workAssignments: List<WorkAssignmentDto>
    ): Flux<Long> {
        return workGroupAssignmentRepository.deleteByWorkId(workId)
            .thenMany(
                if(workAssignments.isEmpty()) Flux.empty()
                else databaseClient.inConnectionMany { connection ->
                    val statement = connection.createStatement(
                        "INSERT INTO  work_group_assignment (work_id, group_id, type, start, end_) VALUES ($1, $2, $3, $4, $5)"
                    ).returnGeneratedValues("group_id");
                    workAssignments.forEach { a ->
                        statement
                            .bind(0, workId)
                            .bind(1, a.groupId!!)
                            .bind(2, a.type.toString())
                            .let {
                                if(a.start == null) it.bindNull(3, LocalDateTime::class.java) else it.bind(
                                    3,
                                    a.start!!
                                )
                            }
                            .let {
                                if(a.end == null) it.bindNull(4, LocalDateTime::class.java) else it.bind(
                                    4,
                                    a.end!!
                                )
                            }
                            .add()
                    }

                    Flux.from(statement.execute())
                        .flatMap { result -> result.map { row, meta -> row.get(0) as Long } }
                    // .flatMap { row -> row.map {r -> r.get(0) as Long} }
                }
            )
        // databaseClient.sql("INSERT INTO work_group_assignment (work_id, group_id, type, start, end_) VALUES (?, ?, ?, ?, ?)")
        //         .bind()
        //         .map {row -> row[0] as Long}
        //         .first()
        // workGroupAssignmentRepository.saveAll(
        //     workAssignments.map {
        //         WorkGroupAssignment(
        //             workId = workId,
        //             groupId = it.groupId!!,
        //             type = it.type,
        //             start = it.start?.toLocalDateTime(),
        //             end = it.end?.toLocalDateTime()
        //         )
        //     }
        // )
    }

    override fun saveGroupAssignments(
        groupId: Long,
        workAssignments: List<WorkAssignmentDto>
    ): Flux<Long> {
        return workGroupAssignmentRepository.deleteByGroupId(groupId)
            .thenMany(
                if(workAssignments.isEmpty()) Flux.empty() else
                    databaseClient.inConnectionMany { connection ->
                        val statement = connection.createStatement(
                            "INSERT INTO  work_group_assignment (work_id, group_id, type, start, end_) VALUES ($1, $2, $3, $4, $5)"
                        ).returnGeneratedValues("group_id");
                        workAssignments.forEach { a ->
                            statement
                                .bind(0, a.workId!!)
                                .bind(1, groupId)
                                .bind(2, a.type.toString())
                                .let {
                                    if(a.start == null) it.bindNull(3, LocalDateTime::class.java) else it.bind(
                                        3,
                                        a.start!!
                                    )
                                }
                                .let {
                                    if(a.end == null) it.bindNull(4, LocalDateTime::class.java) else it.bind(
                                        4,
                                        a.end!!
                                    )
                                }
                                .add()
                        }

                        Flux.from(statement.execute())
                            .flatMap { result -> result.map { row, meta -> row.get(0) as Long } }
                        // .flatMap { row -> row.map {r -> r.get(0) as Long} }
                    }
            )

    }
}
