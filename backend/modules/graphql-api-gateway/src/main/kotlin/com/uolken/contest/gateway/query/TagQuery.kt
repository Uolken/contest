package com.uolken.contest.gateway.query

import com.expediagroup.graphql.server.operations.Query
import com.uolken.contest.gateway.RedirectableWebClient
import com.uolken.contest.gateway.configuration.graphql.RedirectableGraphQLContext
import com.uolken.contest.gateway.model.GraphQLGroup
import com.uolken.contest.gateway.model.GraphQLTag
import com.uolken.contest.gateway.redirectToGet
import org.springframework.stereotype.Component
import java.util.concurrent.CompletableFuture

@Component
class TagQuery(
    private val webClient: RedirectableWebClient
): Query {

    fun tags(context: RedirectableGraphQLContext): CompletableFuture<List<GraphQLTag>> =
        webClient.redirectToGet("http://problem-service/tags", context)

}
