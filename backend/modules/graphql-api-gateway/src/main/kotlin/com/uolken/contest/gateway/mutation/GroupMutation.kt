package com.uolken.contest.gateway.mutation

import com.expediagroup.graphql.server.operations.Mutation
import com.uolken.contest.accounts.model.dto.GroupDto
import com.uolken.contest.accounts.model.dto.request.UpdateGroupRequest
import com.uolken.contest.gateway.RedirectableWebClient
import com.uolken.contest.gateway.configuration.graphql.RedirectableGraphQLContext
import com.uolken.contest.gateway.model.GraphQLGroup
import com.uolken.contest.gateway.redirectToPost
import org.springframework.stereotype.Component
import java.util.*
import java.util.concurrent.CompletableFuture

@Component
class GroupMutation(
    private val webClient: RedirectableWebClient
): Mutation {
    fun createGroup(updateGroupRequest: UpdateGroupRequest, context: RedirectableGraphQLContext): CompletableFuture<GraphQLGroup> =
        webClient.redirectToPost("http://account-service/groups", context, updateGroupRequest)

    fun addUserToGroup(userId: UUID, groupId: UUID, context: RedirectableGraphQLContext): CompletableFuture<GraphQLGroup> =
        webClient.redirectToPost<GroupDto>("http://account-service/groups/${groupId}/users/${userId}/add", context)
            .thenApply { GraphQLGroup(it) }
}

