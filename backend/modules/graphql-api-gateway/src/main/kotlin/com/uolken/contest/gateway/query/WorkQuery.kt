package com.uolken.contest.gateway.query

import com.expediagroup.graphql.server.operations.Query
import com.uolken.contest.gateway.RedirectableWebClient
import com.uolken.contest.gateway.configuration.graphql.RedirectableGraphQLContext
import com.uolken.contest.gateway.model.GraphQLWork
import com.uolken.contest.gateway.redirectToGet
import com.uolken.contest.gateway.service.WorkService
import com.uolken.contest.problems.model.filter.WorkSelector
import com.uolken.contest.problems.model.filter.WorkSelectorWithPage
import org.springframework.stereotype.Component
import java.util.concurrent.CompletableFuture

@Component
class WorkQuery(
    private val redirectableWebClient: RedirectableWebClient,
    private val workService: WorkService
) : Query {

    fun work(id: Long, context: RedirectableGraphQLContext): CompletableFuture<GraphQLWork?> {
        return redirectableWebClient.redirectToGet("http://problem-service/works/$id", context)
    }

    // fun works(context: RedirectableGraphQLContext): CompletableFuture<List<GraphQLWork>> {
    //     return redirectableWebClient.redirectToGet("http://problem-service/works", context)
    // }

    fun works(
        workSelectorWithPage: WorkSelectorWithPage,
        context: RedirectableGraphQLContext
    ): CompletableFuture<List<GraphQLWork>> {
        return workService.getWorks(workSelectorWithPage, context)
    }

    fun workCount(workSelector: WorkSelector, context: RedirectableGraphQLContext): CompletableFuture<Long> {
        return workService.getWorkCount(workSelector, context)
    }
}
