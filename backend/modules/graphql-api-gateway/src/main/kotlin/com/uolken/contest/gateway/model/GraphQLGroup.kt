package com.uolken.contest.gateway.model

import com.expediagroup.graphql.generator.annotations.GraphQLName
import com.expediagroup.graphql.server.extensions.getValueFromDataLoader
import com.uolken.contest.accounts.model.dto.GroupDto
import com.uolken.contest.gateway.loader.DataLoaders
import com.uolken.contest.problems.model.dto.AssignmentId
import graphql.schema.DataFetchingEnvironment
import java.util.concurrent.CompletableFuture

@GraphQLName("Group")
class GraphQLGroup(private val groupDto: GroupDto) {

    val id: Long get() = groupDto.id
    val name: String get() = groupDto.name

    fun students(environment: DataFetchingEnvironment): CompletableFuture<List<GraphQLUser>> {
        return environment.getValueFromDataLoader(DataLoaders.usersByGroupIdDataLoader, id)
    }

    fun workAssignments(environment: DataFetchingEnvironment): CompletableFuture<List<GraphQLWorkGroupAssignment>> {
        return environment.getValueFromDataLoader(DataLoaders.assignmentsByGroupIdDataLoader, id)
    }

    fun workAssignment(
        workId: Long,
        environment: DataFetchingEnvironment
    ): CompletableFuture<GraphQLWorkGroupAssignment?> {
        return environment.getValueFromDataLoader(
            DataLoaders.assignmentByGroupIdAndWorkIdDataLoader,
            AssignmentId(workId, id)
        )
    }
}
