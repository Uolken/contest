package com.uolken.contest.problems.controller

import com.uolken.contest.authentication.model.dto.UserInfo
import com.uolken.contest.problems.model.Work
import com.uolken.contest.problems.model.dto.WorkDto
import com.uolken.contest.problems.model.dto.WorkUpdateDto
import com.uolken.contest.problems.model.filter.WorkSelector
import com.uolken.contest.problems.model.filter.WorkSelectorWithPage
import com.uolken.contest.problems.service.WorkService
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@RestController
class WorkController(
    private val workService: WorkService
) {

    @GetMapping("/works")
    fun works(): Flux<Work> {
        return workService.get()
    }

    @PostMapping("/works")
    fun worksBySelector(@RequestBody workSelectorWithPage: WorkSelectorWithPage): Flux<WorkDto> {
        return workService.getWorks(workSelectorWithPage).map { it.toDto() }
    }

    @PostMapping("/works/save")
    fun saveWork(
        @RequestBody workUpdateDto: WorkUpdateDto,
        @AuthenticationPrincipal userInfo: UserInfo
    ): Mono<WorkDto> {
        return workService.saveWork(workUpdateDto, userInfo.id).map { it.toDto() }
    }

    @PostMapping("/works/count")
    fun workCountBySelector(@RequestBody workSelector: WorkSelector): Mono<Long> {
        return workService.getWorkCount(workSelector)
    }

    @GetMapping("/works/{id}")
    fun work(@PathVariable id: Long): Mono<WorkDto> {
        return workService.getById(id).map { it.toDto() }
    }

    @GetMapping("/works/batched")
    fun worksBatched(@RequestParam workIds: List<Long>): Flux<WorkDto> {
        return workService.getByIds(workIds).map { it.toDto() }
    }

}
