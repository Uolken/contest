package com.uolken.contest.gateway.mutation

import com.expediagroup.graphql.generator.annotations.GraphQLName
import com.expediagroup.graphql.server.operations.Mutation
import com.uolken.contest.gateway.RedirectableWebClient
import com.uolken.contest.gateway.configuration.graphql.RedirectableGraphQLContext
import com.uolken.contest.gateway.model.GraphQLProblem
import com.uolken.contest.gateway.redirectToPost
import com.uolken.contest.problems.model.Example
import com.uolken.contest.problems.model.dto.ProblemUpdateDto
import com.uolken.contest.problems.model.dto.TestCaseDto
import com.uolken.contest.solution.model.dto.SolveProblemRequest
import com.uolken.contest.solution.model.dto.SolveProblemResponse
import org.springframework.stereotype.Component
import java.util.concurrent.CompletableFuture

@Component
class ProblemMutations(
    private val webClient: RedirectableWebClient
): Mutation {
    fun solveProblem(problemId: Long, solveProblemRequest: SolveProblemRequest, context: RedirectableGraphQLContext): CompletableFuture<SolveProblemResponse> {
        return webClient.redirectToPost("http://solution-service/problems/${problemId}/solve", context, solveProblemRequest)
    }

    fun saveProblem(newProblem: ProblemUpdateDto, context: RedirectableGraphQLContext): CompletableFuture<GraphQLProblem> {
        return webClient.redirectToPost("http://problem-service/problems/save", context, newProblem)
    }

    fun saveTestCases(problemId: Long, testCases: List<TestCaseDto>, context: RedirectableGraphQLContext): CompletableFuture<Long> {
        return webClient.redirectToPost("http://problem-service/problems/${problemId}/test-cases/save", context, testCases)
    }
}

