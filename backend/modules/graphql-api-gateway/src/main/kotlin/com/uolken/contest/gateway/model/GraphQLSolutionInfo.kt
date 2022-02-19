package com.uolken.contest.gateway.model

import com.expediagroup.graphql.generator.annotations.GraphQLName
import com.uolken.contest.solution.model.SolutionInfo
import com.uolken.contest.solution.model.SolutionStatus
import java.util.*

@GraphQLName("SolutionInfo")
class GraphQLSolutionInfo(private val solutionInfo: SolutionInfo) {
    val status: SolutionStatus = solutionInfo.status
    val tryCount: Int = solutionInfo.tryCount
//    fun task(dataFetchingEnvironment: DataFetchingEnvironment): CompletableFuture<List<GraphQLTask>> {
//
//    }
}

