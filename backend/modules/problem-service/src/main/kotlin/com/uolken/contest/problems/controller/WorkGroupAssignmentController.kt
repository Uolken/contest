package com.uolken.contest.problems.controller

import com.uolken.contest.problems.model.dto.*
import com.uolken.contest.problems.service.WorkGroupAssignmentService
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import java.lang.IllegalStateException

@RestController
class WorkGroupAssignmentController(
    private val workGroupAssignmentService: WorkGroupAssignmentService
) {

    @GetMapping("/groups/batched/assignments")
    fun getAssignmentsByGroupIdBatched(
        @RequestParam groupIds: List<Long>
    ): Flux<WorkGroupAssignmentDto> {
        return workGroupAssignmentService.getAssignmentsByGroupIds(groupIds).map { it.toDto() }
    }

    @GetMapping("/works/batched/assignments")
    fun getAssignmentsByWorkIdBatched(
        @RequestParam workIds: List<Long>
    ): Flux<WorkGroupAssignmentDto> {
        return workGroupAssignmentService.getAssignmentsByWorkIds(workIds).map { it.toDto() }
    }

    @PostMapping("/groups/batched/works/batched")
    fun getAssignmentsByIdBatched(
        @RequestBody assignmentIds: List<AssignmentId>
    ): Flux<WorkGroupAssignmentDto> {
        return workGroupAssignmentService.getAssignmentsIds(assignmentIds).map { it.toDto() }
    }

    @PostMapping("/works/{workId}/assignments/save","/groups/{groupId}/assignments/save")
    fun saveAssignments(
        @PathVariable(required = false) workId: Long?,
        @PathVariable(required = false) groupId: Long?,
        @RequestBody workAssignments: List<WorkAssignmentDto>,
    ): Flux<Long> {
        workId?.let { return workGroupAssignmentService.saveWorkAssignments(it, workAssignments) }
        groupId?.let { return workGroupAssignmentService.saveGroupAssignments(it, workAssignments) }
        throw IllegalStateException("One of workId or groupId must not be null")
    }
}
