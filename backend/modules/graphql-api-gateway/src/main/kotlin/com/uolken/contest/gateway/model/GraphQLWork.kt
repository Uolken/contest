package com.uolken.contest.gateway.model

import com.expediagroup.graphql.generator.annotations.GraphQLName
import com.expediagroup.graphql.server.extensions.getValueFromDataLoader
import com.uolken.contest.gateway.loader.DataLoaders
import com.uolken.contest.problems.model.WorkType
import com.uolken.contest.problems.model.dto.WorkDto
import graphql.schema.DataFetchingEnvironment
import java.time.OffsetDateTime
import java.time.ZoneOffset
import java.util.concurrent.CompletableFuture

@GraphQLName("Work")
class GraphQLWork(private val work: WorkDto) {
    val id: Long = work.id
    val name: String = work.name
    val start: OffsetDateTime? = work.start?.atOffset(ZoneOffset.UTC)
    val end: OffsetDateTime? = work.end?.atOffset(ZoneOffset.UTC)
    val type: WorkType = work.type

    fun problems(environment: DataFetchingEnvironment): CompletableFuture<List<GraphQLProblem>> =
        environment.getValueFromDataLoader(DataLoaders.problemsByWorkIdDataLoader, work.id)


    fun author(environment: DataFetchingEnvironment): CompletableFuture<GraphQLUser> =
        environment.getValueFromDataLoader(DataLoaders.userDataLoader, work.authorId)

    fun assignments(environment: DataFetchingEnvironment): CompletableFuture<List<GraphQLWorkGroupAssignment>> =
        environment.getValueFromDataLoader(DataLoaders.assignmentsByWorkIdDataLoader, id)


}

