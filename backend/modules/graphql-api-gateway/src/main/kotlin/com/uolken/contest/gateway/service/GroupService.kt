package com.uolken.contest.gateway.service

import com.uolken.contest.accounts.model.dto.GroupDto
import com.uolken.contest.gateway.RedirectableWebClient
import com.uolken.contest.gateway.configuration.graphql.RedirectableGraphQLContext
import com.uolken.contest.gateway.model.GraphQLGroup
import com.uolken.contest.gateway.redirectToGet
import com.uolken.contest.gateway.resolver.task.EmptyIfNullMap
import org.springframework.stereotype.Service
import java.util.*
import java.util.concurrent.CompletableFuture

interface GroupService {
    fun byUserIds(
        userIds: Set<Long>,
        context: RedirectableGraphQLContext
    ): CompletableFuture<Map<Long, GraphQLGroup>>

    fun getByIds(groupIds: Set<Long>, context: RedirectableGraphQLContext): CompletableFuture<Map<Long, GraphQLGroup>>
}

@Service
class GroupServiceImpl(
    private val redirectableWebClient: RedirectableWebClient
) : GroupService {
    override fun byUserIds(
        userIds: Set<Long>,
        context: RedirectableGraphQLContext
    ): CompletableFuture<Map<Long, GraphQLGroup>> {
        return redirectableWebClient.redirectToGet<List<Pair<Long, GroupDto>>>(
            "http://account-service/users/batched/groups",
            context,
            mapOf("userIds" to userIds)
        ).thenApply {
            it.associateBy({it.first}, {GraphQLGroup(it.second) })
            // EmptyIfNullMap(it.toMap().mapValues { it.value.map { GraphQLGroup(it) } })

            //    "babel-eslint": "^10.1.0",
        }
    }

    override fun getByIds(
        groupIds: Set<Long>,
        context: RedirectableGraphQLContext
    ): CompletableFuture<Map<Long, GraphQLGroup>> {
        return redirectableWebClient.redirectToGet<List<GroupDto>>(
            "http://account-service/groups/batched",
            context,
            mapOf("groupIds" to groupIds)
        ).thenApply {
            it.map { GraphQLGroup(it) }.associateBy { it.id }
        }
    }
}
