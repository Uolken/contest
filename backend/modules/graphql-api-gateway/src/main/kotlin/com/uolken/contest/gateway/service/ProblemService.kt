package com.uolken.contest.gateway.service

import com.uolken.contest.gateway.RedirectableWebClient
import com.uolken.contest.gateway.configuration.graphql.RedirectableGraphQLContext
import com.uolken.contest.gateway.model.GraphQLSolutionInfo
import com.uolken.contest.gateway.redirectToGet
import com.uolken.contest.solution.model.SolutionInfo
import org.springframework.stereotype.Service
import java.util.concurrent.CompletableFuture

//interface ProblemService {
//    fun getProblemTestCasesCount(redirectableGraphQLContext: RedirectableGraphQLContext, problemId: Long): CompletableFuture<Long>
//}
//
//@Service
//class ProblemServiceImpl(
//    private val redirectableWebClient: RedirectableWebClient
//): ProblemService {
//    override fun getProblemTestCasesCount(redirectableGraphQLContext: RedirectableGraphQLContext, problemId: Long): CompletableFuture<Long> {
//        return redirectableWebClient.redirectToGet(
//            "http://problem-service/problems/${problemId}/test-cases/count",
//            redirectableGraphQLContext,
//        )
//    }
//
//}
