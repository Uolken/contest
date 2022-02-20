package com.uolken.contest.solution.controller

import com.fasterxml.jackson.databind.ObjectMapper
import com.uolken.contest.authentication.model.UserRole
import com.uolken.contest.authentication.model.dto.UserInfo
import com.uolken.contest.solution.PermissionDeniedException
import com.uolken.contest.solution.model.ExecutionResult
import com.uolken.contest.solution.model.SolutionId
import com.uolken.contest.solution.model.SolutionInfo
import com.uolken.contest.solution.model.SubmissionDto
import com.uolken.contest.solution.model.dto.SolveProblemRequest
import com.uolken.contest.solution.model.dto.SolveProblemResponse
import com.uolken.contest.solution.model.dto.SubmissionCount
import com.uolken.contest.solution.model.selector.SubmissionSelector
import com.uolken.contest.solution.model.selector.SubmissionSelectorWithPage
import com.uolken.contest.solution.service.SubmissionService
import org.springframework.amqp.core.AmqpTemplate
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.time.LocalDate
import java.time.LocalDateTime
import java.util.TimeZone

@RestController
class SolutionController(
    private val submissionService: SubmissionService,
    private val rabbitTemplate: AmqpTemplate,
    private val objectMapper: ObjectMapper
) {

    @GetMapping("/submissions/batched/summary")
    fun solutionsSummary(
        //        @RequestParam submitterIdsToTaskIds: Map<UUID, List<Long>>
        //        @RequestParam submitterId: UUID,
        //        @RequestParam taskIds: List<Long>
    ): Flux<SolutionInfo> {
        TODO()
        //        return submissionService.getSolutionsInfo(submitterId, taskIds)
    }

    @PostMapping("/submissions")
    fun getSubmissions(@RequestBody selector: SubmissionSelectorWithPage): Flux<SubmissionDto> {
        return submissionService.getSubmissions(selector).map { it.toDto() }
    }

    @GetMapping("/submissions/{submissionId}")
    fun getSubmission(@PathVariable submissionId: String): Mono<SubmissionDto> {
        return submissionService.getSubmission(submissionId).map { it.toDto() }
    }

    @PostMapping("/submissions/count")
    fun getSubmissionCount(@RequestBody selector: SubmissionSelector): Mono<Long> {
        return submissionService.getSubmissionCount(selector)
    }

    @GetMapping("/submissions/counts-by-dates")
    fun getSubmissionCountsByDates(
        @RequestParam start: String,
        @RequestParam end: String,
        @RequestParam userId: Long,
        @RequestParam timezone: String,
    ): Flux<SubmissionCount> {
        return submissionService.getSubmissionCounts(LocalDate.parse(start), LocalDate.parse(end), userId, timezone)
    }

    @PostMapping("/submissions/{submissionId}")
    fun updateSubmissionStatus(
        @PathVariable submissionId: String,
        @RequestBody executionResult: ExecutionResult
    ): Mono<SubmissionDto> {
        return submissionService.updateSubmissionStatus(submissionId, executionResult).map { it.toDto() }
        //        return submissionService.getSolutionsInfo(submitterId, taskIds)
    }

    //TODO  fuck
    @PostMapping("/users/batched/problems/batched/solution-info")
    fun getSolutionsInfoBatched(
        @RequestBody solutionIds: List<SolutionId>,
        @AuthenticationPrincipal userInfo: UserInfo
    ): Flux<SolutionInfo> {
        if(!privilegedUsers.contains(userInfo.role) && solutionIds.any { it.submitterId != userInfo.id }) {
            throw PermissionDeniedException()
        }
        return submissionService.getSolutionsInfo(solutionIds)
    }
    //
    //    @GetMapping("/problems/batched/summery")
    //    fun problemStatistic(
    //        @RequestParam problemIds: List<Long>,
    //        @AuthenticationPrincipal userInfo: UserInfo
    //    ): Flux<SolutionInfo> {
    //        return submissionService.getSolutionsInfo(userInfo.id, problemIds)
    //    }

    @PostMapping("/problems/{problemId}/solve")
    fun solveProblem(
        @PathVariable problemId: Long,
        @RequestBody solveProblemRequest: SolveProblemRequest,
        @AuthenticationPrincipal userInfo: UserInfo
    ): Mono<SolveProblemResponse> {
        return submissionService.createSubmission(userInfo.id, problemId, solveProblemRequest)
            .doOnNext { rabbitTemplate.convertAndSend("solution-test", it.toDto()) }
            .map { SolveProblemResponse(it.id.toHexString()) }
    }

    companion object {

        val privilegedUsers = listOf(UserRole.ADMIN, UserRole.TEACHER)
    }

}
