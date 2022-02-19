package com.uolken.contest.gateway.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.uolken.contest.gateway.RedirectableWebClient
import com.uolken.contest.gateway.configuration.graphql.RedirectableGraphQLContext
import com.uolken.contest.gateway.model.GraphQLSolutionInfo
import com.uolken.contest.gateway.redirectToPost
import com.uolken.contest.solution.model.SolutionId
import com.uolken.contest.solution.model.SolutionInfo
import org.springframework.stereotype.Component
import java.util.concurrent.CompletableFuture

interface SolutionService {
    //    fun getTasksSolutionsInfo(
    //        tasksBySubmitters: Map<UUID, List<Long>>,
    //        context: RedirectableGraphQLContext
    //    ): CompletableFuture<Map<SubmitterIdAndTaskId, GraphQLSolutionInfo>>

    fun getSolutionsInfo(
        solutionIds: Set<SolutionId>,
        context: RedirectableGraphQLContext
    ): CompletableFuture<Map<SolutionId, GraphQLSolutionInfo>>

}

@Component
class SolutionServiceImpl(
    private val redirectableWebClient: RedirectableWebClient,
    private val objectMapper: ObjectMapper
) : SolutionService {

    //    override fun getTasksSolutionsInfo(
    //        tasksBySubmitters: Map<UUID, List<Long>>,
    //        context: RedirectableGraphQLContext
    //    ): CompletableFuture<Map<SubmitterIdAndTaskId, GraphQLSolutionInfo>> {
    //        return redirectableWebClient.redirectToGet<List<SolutionInfo>>(
    //            "http://solution-service/submissions/batched/summary",
    //            context,
    //            params = tasksBySubmitters.mapKeys { it.key.toString() }
    //        ).thenApply { it.associateBy({ SubmitterIdAndTaskId(it.submitterId, it.taskId) }, { GraphQLSolutionInfo(it) }) }
    //    }

    override fun getSolutionsInfo(
        solutionIds: Set<SolutionId>,
        context: RedirectableGraphQLContext
    ): CompletableFuture<Map<SolutionId, GraphQLSolutionInfo>> {
        // val params = objectMapper.convertValue<Map<String, Any?>>(solutionIds)
        return redirectableWebClient.redirectToPost<List<SolutionInfo>>(
            "http://solution-service/users/batched/problems/batched/solution-info",
            context,
            body = solutionIds,
        ).thenApply { infos ->
            infos.associateBy({ SolutionId(it.problemId, it.submitterId) }, { GraphQLSolutionInfo(it) })
        }
        // return redirectableWebClient.redirectToGet<List<SolutionInfo>>(
        //     "http://solution-service/problems/batched/summary/my",
        //     context,
        //     params = mapOf("problemIds" to solutionIds)
        // ).thenApply { it.associateBy({ it.problemId }, { GraphQLSolutionInfo(it) }) }

    }
}
