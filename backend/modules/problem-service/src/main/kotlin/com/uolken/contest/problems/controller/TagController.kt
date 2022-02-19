package com.uolken.contest.problems.controller

import com.uolken.contest.problems.model.dto.TagDto
import com.uolken.contest.problems.service.TagService
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@RestController
class TagController(
    private val tagService: TagService
) {

    @GetMapping("/problems/{problemId}/tags")
    fun getByTaskId(@PathVariable problemId: Long): Flux<TagDto> {
        log.info("Tags for task with id: $problemId was requested")
        return tagService.getByTaskId(problemId).map { it.toDto() }
    }

    @GetMapping("/tags/{id}")
    fun getById(@PathVariable id: Long): Mono<TagDto> {
        return tagService.getById(id).map { it.toDto() }
    }

    @GetMapping("/tags/batched")
    fun getBatched(@RequestParam ids: List<Long>): Flux<TagDto> {
        return tagService.getByIds(ids).map { it.toDto() }
    }

    @GetMapping("/problems/batched/tags")
    fun getByTaskIdsBatched(@RequestParam problemIds: List<Long>): Flux<Pair<Long, List<TagDto>>> {
        return tagService.getByTaskIds(problemIds)
            .map { it.first to it.second.map { it.toDto()  } }
    }

    companion object {
        val log = LoggerFactory.getLogger(TagController::class.java)
    }
}
