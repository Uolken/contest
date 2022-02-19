package com.uolken.contest.gateway.query

import com.expediagroup.graphql.server.operations.Query
import com.uolken.contest.gateway.RedirectableWebClient
import com.uolken.contest.gateway.configuration.graphql.RedirectableGraphQLContext
import com.uolken.contest.gateway.model.GraphQLGroup
import com.uolken.contest.gateway.redirectToGet
import org.springframework.stereotype.Component
import java.util.concurrent.CompletableFuture

@Component
class GroupQuery(
    private val webClient: RedirectableWebClient
): Query {

    fun groups(context: RedirectableGraphQLContext): CompletableFuture<List<GraphQLGroup>> =
        webClient.redirectToGet("http://account-service/groups", context)

    fun group(groupId: Long, context: RedirectableGraphQLContext): CompletableFuture<GraphQLGroup> =
        webClient.redirectToGet("http://account-service/groups/$groupId", context)

}
