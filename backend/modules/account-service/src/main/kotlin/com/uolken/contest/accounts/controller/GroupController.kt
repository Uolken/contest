package com.uolken.contest.accounts.controller

import com.uolken.contest.accounts.model.dto.GroupDto
import com.uolken.contest.accounts.model.dto.request.UpdateGroupRequest
import com.uolken.contest.accounts.service.GroupService
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@RestController
class GroupController(
    private val groupService: GroupService
) {
    @GetMapping("/groups")
    fun getGroups(): Flux<GroupDto> {
        return groupService.getAll().map { it.toDto() }
    }

    @GetMapping("/groups/{groupId}")
    fun getGroup(@PathVariable groupId: Long): Mono<GroupDto> {
        return groupService.getById(groupId).map { it.toDto() }
    }

    @GetMapping("/groups/batched")
    fun getGroupsBatched(@RequestParam groupIds: List<Long>): Flux<GroupDto> {
        return groupService.getByIds(groupIds).map { it.toDto() }
    }

    @PostMapping("/groups")
    fun createGroup(@RequestBody body: UpdateGroupRequest): Mono<GroupDto> {
        return groupService.updateGroup(body).map { it.toDto() }
    }

    @GetMapping("/users/batched/groups")
    fun getGroupsByUserIds(@RequestParam userIds: List<Long>): Flux<Pair<Long, GroupDto>> {
        return groupService.getByUserIds(userIds).map { it.first to it.second.toDto() }
    }

    @PostMapping("/groups/{groupId}/users/{userId}/add")
    fun addUserToGroup(
        @PathVariable groupId: Long,
        @PathVariable userId: Long
    ): Mono<GroupDto> = groupService.addUserToGroup(userId, groupId).map { it.toDto() }
}
