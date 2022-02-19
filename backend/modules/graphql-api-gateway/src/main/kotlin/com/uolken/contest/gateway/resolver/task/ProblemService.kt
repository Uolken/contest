package com.uolken.contest.gateway.resolver.task

import com.uolken.contest.gateway.RedirectableWebClient
import com.uolken.contest.gateway.configuration.graphql.RedirectableGraphQLContext
import com.uolken.contest.gateway.model.GraphQLProblem
import com.uolken.contest.gateway.model.GraphQLSubmission
import com.uolken.contest.gateway.model.GraphQLTestCase
import com.uolken.contest.gateway.redirectToGet
import com.uolken.contest.gateway.redirectToPost
import com.uolken.contest.problems.model.dto.ProblemDto
import com.uolken.contest.problems.model.filter.ProblemSelector
import com.uolken.contest.problems.model.filter.ProblemSelectorWithPage
import com.uolken.contest.solution.model.SubmissionDto
import org.springframework.stereotype.Service
import java.util.concurrent.CompletableFuture

@Service
class ProblemService(
    private val webClient: RedirectableWebClient
) {

    fun problems(context: RedirectableGraphQLContext): CompletableFuture<List<GraphQLProblem>> {
        return webClient.redirectToGet<List<ProblemDto>>("http://problem-service/problems", context)
            .thenApply { it.map { GraphQLProblem(it) } }
    }

    fun problemsByWorkId(workId: Long, context: RedirectableGraphQLContext): CompletableFuture<List<GraphQLProblem>> {
        return webClient.redirectToGet<List<ProblemDto>>("http://problem-service/works/$workId/tasks", context)
            .thenApply { it.map { GraphQLProblem(it) } }
    }

    fun problemsByWorkIds(
        workIds: Set<Long>,
        context: RedirectableGraphQLContext
    ): CompletableFuture<Map<Long, List<GraphQLProblem>>> {
        return webClient.redirectToGet<List<Pair<Long, List<ProblemDto>>>>(
            "http://problem-service/works/batched/problems",
            context,
            params = mapOf("workIds" to workIds)
        )
            .thenApply { EmptyIfNullMap(it.associateBy({ it.first }, { it.second.map { GraphQLProblem(it) } })) }
    }

    fun problemsByIds(
        problemIds: Iterable<Long>,
        context: RedirectableGraphQLContext
    ): CompletableFuture<Map<Long, GraphQLProblem>> {
        return webClient.redirectToGet<List<ProblemDto>>(
            "http://problem-service/problems/batched",
            context,
            params = mapOf("problemIds" to problemIds)
        )
            .thenApply { it.associateBy({ it.id }, { GraphQLProblem(it) }) }
    }

    fun getProblemTestCasesCount(problemId: Long, context: RedirectableGraphQLContext): CompletableFuture<Long> =
        webClient.redirectToGet("http://problem-service/problems/${problemId}/test-cases/count", context)

    fun getTestCaseCounts(
        problemIds: Iterable<Long>,
        context: RedirectableGraphQLContext
    ): CompletableFuture<Map<Long, Long>> {
        return CompletableFuture.supplyAsync {
            problemIds.associateWith {
                getProblemTestCasesCount(it, context).get()
            }
        }
    }

    fun getProblemTestCases(
        problemIds: Iterable<Long>,
        context: RedirectableGraphQLContext
    ): CompletableFuture<Map<Long, List<GraphQLTestCase>>> {
        return CompletableFuture.supplyAsync {
            problemIds.associateWith { getTestCases(it, context).get() }
        }
    }

    fun getProblems(
        problemSelectorWithPage: ProblemSelectorWithPage,
        context: RedirectableGraphQLContext
    ): CompletableFuture<List<GraphQLProblem>> {
        return webClient.redirectToPost("http://problem-service/problems", context, problemSelectorWithPage)
    }

    fun getProblemCount(
        problemSelector: ProblemSelector,
        context: RedirectableGraphQLContext
    ): CompletableFuture<Long> {
        return webClient.redirectToPost("http://problem-service/problems/count", context, problemSelector)
    }

    fun getTestCases(problemId: Long, context: RedirectableGraphQLContext): CompletableFuture<List<GraphQLTestCase>> {
        return webClient.redirectToGet("http://problem-service/problems/${problemId}/test-cases", context)
    }
}


