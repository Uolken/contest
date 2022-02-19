package com.uolken.contest.gateway.query

import com.expediagroup.graphql.server.extensions.getValueFromDataLoader
import com.expediagroup.graphql.server.operations.Query
import com.uolken.contest.gateway.RedirectableWebClient
import com.uolken.contest.gateway.configuration.graphql.RedirectableGraphQLContext
import com.uolken.contest.gateway.loader.DataLoaders
import com.uolken.contest.gateway.model.GraphQLProblem
import com.uolken.contest.gateway.model.GraphQLTestCase
import com.uolken.contest.gateway.redirectToGet
import com.uolken.contest.gateway.resolver.task.ProblemService
import com.uolken.contest.problems.model.dto.ProblemDto
import com.uolken.contest.problems.model.dto.TestCaseDto
import com.uolken.contest.problems.model.filter.ProblemSelector
import com.uolken.contest.problems.model.filter.ProblemSelectorWithPage
import graphql.schema.DataFetchingEnvironment
import org.springframework.stereotype.Component
import java.util.concurrent.CompletableFuture

@Component
class ProblemQuery(
    private val redirectableWebClient: RedirectableWebClient,
    private val problemService: ProblemService
) : Query {
    fun workProblem(workId: Long, problemId: Long, context: RedirectableGraphQLContext): CompletableFuture<GraphQLProblem?> {
        return redirectableWebClient.redirectToGet<ProblemDto>("http://problem-service/works/$workId/problems/$problemId", context)
            .thenApply { GraphQLProblem(it) }
    }

    fun problem(problemId: Long, environment: DataFetchingEnvironment): CompletableFuture<GraphQLProblem?> {
        return environment.getValueFromDataLoader(DataLoaders.problemDataLoader, problemId)
    }

    fun libraryProblem(id: Long, context: RedirectableGraphQLContext): CompletableFuture<GraphQLProblem> {
        return redirectableWebClient.redirectToGet<ProblemDto>("http://problem-service/library/problems/$id", context)
            .thenApply { GraphQLProblem(it) }
    }

    fun libraryProblems(
        page: Int,
        size: Int,
        context: RedirectableGraphQLContext
    ): CompletableFuture<List<GraphQLProblem>> {
        return redirectableWebClient.redirectToGet<List<ProblemDto>>(
            "http://problem-service/library/problems",
            context,
            params = mapOf("page" to page, "size" to size)
        )
            .thenApply { it.map { GraphQLProblem(it) } }
    }

    fun problems(problemSelectorWithPage: ProblemSelectorWithPage, context: RedirectableGraphQLContext): CompletableFuture<List<GraphQLProblem>> {
        return problemService.getProblems(problemSelectorWithPage, context)
    }

    fun problemCount(problemSelector: ProblemSelector, context: RedirectableGraphQLContext): CompletableFuture<Long> {
        return problemService.getProblemCount(problemSelector, context)
    }


}
