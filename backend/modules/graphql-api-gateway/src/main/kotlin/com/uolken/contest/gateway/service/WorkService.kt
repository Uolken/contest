package com.uolken.contest.gateway.service

import com.uolken.contest.gateway.RedirectableWebClient
import com.uolken.contest.gateway.configuration.graphql.RedirectableGraphQLContext
import com.uolken.contest.gateway.model.GraphQLWork
import com.uolken.contest.gateway.redirectToGet
import com.uolken.contest.gateway.redirectToPost
import com.uolken.contest.problems.model.dto.WorkDto
import com.uolken.contest.problems.model.filter.WorkSelector
import com.uolken.contest.problems.model.filter.WorkSelectorWithPage
import org.springframework.stereotype.Service
import java.util.concurrent.CompletableFuture

interface WorkService {

    fun getWorksByIds(
        workIds: Iterable<Long>,
        context: RedirectableGraphQLContext?
    ): CompletableFuture<Map<Long, GraphQLWork>>

    fun getWorks(workSelectorWithPage: WorkSelectorWithPage, context: RedirectableGraphQLContext): CompletableFuture<List<GraphQLWork>>
    fun getWorkCount(workSelector: WorkSelector, context: RedirectableGraphQLContext): CompletableFuture<Long>
}

@Service
class WorkServiceImpl(
    private val webClient: RedirectableWebClient
) : WorkService {

    override fun getWorksByIds(
        workIds: Iterable<Long>,
        context: RedirectableGraphQLContext?
    ): CompletableFuture<Map<Long, GraphQLWork>> {
        return webClient.redirectToGet<List<WorkDto>>(
            "http://problem-service/works/batched",
            context,
            mapOf("workIds" to workIds)
        ).thenApply { works ->
            works.associateBy ({ it.id }, {GraphQLWork(it)})
        }
    }

    override fun getWorks(workSelectorWithPage: WorkSelectorWithPage, context: RedirectableGraphQLContext): CompletableFuture<List<GraphQLWork>> {
        return webClient.redirectToPost("http://problem-service/works", context, workSelectorWithPage)
    }

    override fun getWorkCount(
        workSelector: WorkSelector,
        context: RedirectableGraphQLContext
    ): CompletableFuture<Long> {
        return webClient.redirectToPost("http://problem-service/works/count", context, workSelector)
    }

}
