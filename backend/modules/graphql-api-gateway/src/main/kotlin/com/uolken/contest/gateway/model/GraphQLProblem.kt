package com.uolken.contest.gateway.model

import com.expediagroup.graphql.generator.annotations.GraphQLName
import com.expediagroup.graphql.server.extensions.getValueFromDataLoader
import com.uolken.contest.gateway.configuration.graphql.RedirectableGraphQLContext
import com.uolken.contest.gateway.loader.DataLoaders
import com.uolken.contest.problems.model.Example
import com.uolken.contest.problems.model.dto.ProblemDto
import com.uolken.contest.solution.model.SolutionId
import graphql.schema.DataFetchingEnvironment
import java.util.concurrent.CompletableFuture

@GraphQLName("Problem")
class GraphQLProblem(private val problem: ProblemDto) {
    val id: Long get() = problem.id
    val name: String get() = problem.name
    val text: String get() = problem.text
    val inLibrary: Boolean get() = problem.inLibrary
    val examples: List<Example> get() = problem.examples

    fun author(dataFetchingEnvironment: DataFetchingEnvironment): CompletableFuture<GraphQLUser> {
        return dataFetchingEnvironment.getValueFromDataLoader(DataLoaders.userDataLoader, problem.authorId)
    }

    fun tags(dataFetchingEnvironment: DataFetchingEnvironment): CompletableFuture<List<GraphQLTag>> =
        dataFetchingEnvironment.getValueFromDataLoader(DataLoaders.tagsByProblemIdDataLoader, problem.id)


    // fun solutionInfo(dataFetchingEnvironment: DataFetchingEnvironment): CompletableFuture<GraphQLSolutionInfo?> =
    //     dataFetchingEnvironment.getValueFromDataLoader(DataLoaders.solutionDataLoader, problem.id)

    fun userSolutionInfo(userId: Long, dataFetchingEnvironment: DataFetchingEnvironment): CompletableFuture<GraphQLSolutionInfo?> =
        dataFetchingEnvironment.getValueFromDataLoader(DataLoaders.solutionDataLoader, SolutionId(id, userId))


    fun testCaseCount(dataFetchingEnvironment: DataFetchingEnvironment): CompletableFuture<Long> =
        dataFetchingEnvironment.getValueFromDataLoader(DataLoaders.testCaseCountDataLoader, problem.id)

    fun testCases(dataFetchingEnvironment: DataFetchingEnvironment): CompletableFuture<List<GraphQLTestCase>> {
        return dataFetchingEnvironment.getValueFromDataLoader(DataLoaders.problemTestCasesDataLoader, problem.id)
    }

}
