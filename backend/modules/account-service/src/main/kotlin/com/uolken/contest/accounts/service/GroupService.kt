package com.uolken.contest.accounts.service

import com.uolken.contest.accounts.model.Group
import com.uolken.contest.accounts.model.dto.request.UpdateGroupRequest
import com.uolken.contest.accounts.repository.GroupRepository
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.toFlux

interface GroupService {

    fun getAll(): Flux<Group>
    fun getByName(name: String): Mono<Group>
    fun updateGroup(updateGroupRequest: UpdateGroupRequest): Mono<Group>
    fun getByUserIds(userIds: Iterable<Long>): Flux<Pair<Long, Group>>
    fun getById(groupId: Long): Mono<Group>
    fun getByIds(ids: List<Long>): Flux<Group>
    fun addUserToGroup(userId: Long, groupId: Long): Mono<Group>
    fun getByUserId(studentId: Long): Mono<Group>
}

@Service
class GroupServiceImpl(
    private val groupRepository: GroupRepository,
    private val userService: UserService,

    ) : GroupService {

    override fun getAll(): Flux<Group> {
        return groupRepository.findAll()
    }

    override fun getByName(name: String): Mono<Group> {
        return groupRepository.findByName(name)
    }

    override fun updateGroup(updateGroupRequest: UpdateGroupRequest): Mono<Group> {
        return groupRepository.save(Group(updateGroupRequest.id ?: 0, updateGroupRequest.name, 2020))
            .doOnNext { group ->
                userService.removeStudentsFromGroup(group.id, updateGroupRequest.studentIds).subscribe()
                userService.addStudentsToGroup(group.id, updateGroupRequest.studentIds).subscribe()
            }
    }

    override fun getByUserIds(userIds: Iterable<Long>): Flux<Pair<Long, Group>> {
        return userIds.toFlux().flatMap { studentId ->
            getByUserId(studentId).map { studentId to it }
        }
    }

    override fun getById(groupId: Long): Mono<Group> = groupRepository.findById(groupId)

    override fun getByIds(ids: List<Long>): Flux<Group> = groupRepository.findAllById(ids)

    override fun addUserToGroup(userId: Long, groupId: Long): Mono<Group> {
        TODO()
    }

    override fun getByUserId(studentId: Long): Mono<Group> {
        return groupRepository.findByStudentId(studentId)
    }
}
