package com.uolken.contest.problems.controller

import com.fasterxml.jackson.annotation.JsonEnumDefaultValue
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.uolken.contest.authentication.model.dto.UserInfo
import com.uolken.contest.problems.model.Problem
import com.uolken.contest.problems.model.dto.ProblemDto
import com.uolken.contest.problems.model.dto.ProblemUpdateDto
import com.uolken.contest.problems.model.filter.ProblemSelector
import com.uolken.contest.problems.model.filter.ProblemSelectorWithPage
import com.uolken.contest.problems.service.ProblemService
import org.slf4j.LoggerFactory
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@RestController
class ProblemController(
    private val problemService: ProblemService,
    private val objectMapper: ObjectMapper
) {

    @PostMapping("/problems")
    fun getProblems(@RequestBody problemSelectorWithPage: ProblemSelectorWithPage): Flux<ProblemDto> {

        return problemService.getProblems(problemSelectorWithPage)
            .map { it.toDto() }
    }

    @PostMapping("/problems/save")
    fun saveProblem(
        @RequestBody newProblem: ProblemUpdateDto,
        @AuthenticationPrincipal userInfo: UserInfo
    ): Mono<ProblemDto> {
        return problemService.save(newProblem, userInfo.id)
            .map { it.toDto() }
    }

    @PostMapping("/problems/count")
    fun getProblemCount(@RequestBody problemSelector: ProblemSelector): Mono<Long> {
        return problemService.getProblemCount(problemSelector)
    }

    @GetMapping("/problems/batched")
    fun getProblemsByIds(@RequestParam problemIds: List<Long>): Flux<ProblemDto> {
        return problemService.getByIds(problemIds)
            .map { it.toDto() }
    }

    @GetMapping("/works/batched/problems")
    fun getProblemsByWorkIds(@RequestParam workIds: List<Long>): Flux<Pair<Long, List<ProblemDto>>> {
        return problemService.getByWorkIds(workIds)
            .map { it.first to it.second.map { it.toDto() } }
    }

    @GetMapping("/works/{workId}/problems")
    fun getProblemsByWorkId(@PathVariable workId: Long): Flux<ProblemDto> {
        return problemService.getByWorkId(workId)
            .map { it.toDto() }
    }

    @GetMapping("/works/{workId}/problems/{id}")
    fun getProblemByIdAndWorkId(@PathVariable workId: Long, @PathVariable id: Long): Mono<ProblemDto> {
        return problemService.getByIdAndWorkId(workId, id)
            .map { it.toDto() }
    }

    @GetMapping("/library/problems")
    fun getLibraryProblems(@RequestParam page: Int, @RequestParam size: Int): Flux<ProblemDto> {
        return problemService.getLibraryProblems(page, size).map { it.toDto() }
    }

    @GetMapping("/library/problems/{problemId}")
    fun getLibraryProblem(@PathVariable problemId: Long): Mono<ProblemDto> {
        return problemService.getLibraryProblem(problemId).map { it.toDto() }
    }

    companion object {

        val log = LoggerFactory.getLogger(ProblemController::class.java)
    }

    fun Problem.toDto() = ProblemDto(
        id,
        name,
        text,
        authorId,
        objectMapper.readValue(this.examples.asArray())
    )
}
