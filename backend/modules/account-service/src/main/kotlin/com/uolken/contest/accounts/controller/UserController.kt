package com.uolken.contest.accounts.controller

import com.uolken.contest.accounts.model.dto.UserDto
import com.uolken.contest.accounts.model.dto.filter.UserSelector
import com.uolken.contest.accounts.model.dto.request.CreateUserRequest
import com.uolken.contest.accounts.model.dto.request.ResetPasswordRequest
import com.uolken.contest.accounts.service.UserService
import com.uolken.contest.authentication.model.dto.UserInfo
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.toFlux

@RestController
class UserController(
    private val userService: UserService
) {

    @GetMapping("/users")
    fun getUsers(
        userSelector: UserSelector
    ): Flux<UserDto> {
        return userService.getUsers(userSelector).map { it.toDto() }
    }

    @GetMapping("/users/count")
    fun getUserCount(
        userSelector: UserSelector
    ): Mono<Long> {
        return userService.getUserCount(userSelector)
    }

    @GetMapping("/users/batched")
    fun getUsersBatched(@RequestParam userIds: List<Long>): Flux<UserDto> =
        userService.getUsers(userIds)
            .map { it.toDto() }

    @GetMapping("/groups/{groupId}/users")
    fun getByGroupId(@PathVariable groupId: Long): Flux<UserDto> {
        return userService.getByGroupId(groupId).map { it.toDto() }
    }

    @PostMapping("/users/save")
    fun createUser(@RequestBody createUserRequest: CreateUserRequest): Mono<UserDto> {
        return userService.save(createUserRequest).map { it.toDto() }
    }

    @PostMapping("/users/password/reset")
    fun resetPassword(
        @RequestBody resetPasswordRequest: ResetPasswordRequest,
        @AuthenticationPrincipal userInfo: UserInfo,
    ): Mono<UserDto> {
        return userService.resetPassword(userInfo.email, resetPasswordRequest).map { it.toDto() }
    }

    @GetMapping("/groups/batched/users")
    fun getUsersByGroupIds(
        @RequestParam ids: List<Long>
    ): Flux<Pair<Long, List<UserDto>>> {
        return ids.toFlux().flatMap { id ->
            userService.getByGroupId(id)
                .map { it.toDto() }
                .collectList()
                .map { id to it }
        }
    }

}
