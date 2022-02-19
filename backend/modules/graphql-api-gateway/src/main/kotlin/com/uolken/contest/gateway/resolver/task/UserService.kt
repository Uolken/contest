package com.uolken.contest.gateway.resolver.task

import com.uolken.contest.accounts.model.dto.UserDto
import com.uolken.contest.gateway.RedirectableWebClient
import com.uolken.contest.gateway.configuration.graphql.RedirectableGraphQLContext
import com.uolken.contest.gateway.model.GraphQLGroup
import com.uolken.contest.gateway.model.GraphQLUser
import com.uolken.contest.gateway.redirectToGet
import org.springframework.stereotype.Component
import reactor.core.publisher.Flux
import java.util.*
import java.util.concurrent.CompletableFuture

interface UserService {
    fun getUsers(ids: Iterable<Long>, context: RedirectableGraphQLContext): CompletableFuture<Map<Long, GraphQLUser>>
    fun getUsersByGroupIds(
        groupIds: Iterable<Long>,
        context: RedirectableGraphQLContext
    ): CompletableFuture<Map<Long, List<GraphQLUser>>>
}

@Component
class UserServiceImpl(
    private val redirectableWebClient: RedirectableWebClient
) : UserService {

    override fun getUsers(
        ids: Iterable<Long>,
        context: RedirectableGraphQLContext
    ): CompletableFuture<Map<Long, GraphQLUser>> {
        return redirectableWebClient.redirectToGet<List<UserDto>>(
            "http://account-service/users/batched",
            context,
            params = mapOf("userIds" to ids)
        )
            .thenApply { it.map { GraphQLUser(it) }.associateBy { it.id } }
    }

    override fun getUsersByGroupIds(
        groupIds: Iterable<Long>,
        context: RedirectableGraphQLContext
    ): CompletableFuture<Map<Long, List<GraphQLUser>>> {
        return redirectableWebClient.redirectToGet<List<Pair<Long, List<UserDto>>>>(
            "http://account-service/groups/batched/users",
            context,
            params = mapOf("ids" to groupIds)
        ).thenApply {
            EmptyIfNullMap(it.toMap().mapValues { it.value.map { GraphQLUser(it) } })
        }
    }

}

