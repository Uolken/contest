package com.uolken.contest.gateway.query

import com.expediagroup.graphql.server.extensions.getValueFromDataLoader
import com.expediagroup.graphql.server.operations.Query
import com.uolken.contest.gateway.configuration.graphql.RedirectableGraphQLContext
import com.uolken.contest.gateway.loader.DataLoaders
import com.uolken.contest.gateway.model.GraphQLWorkGroupAssignment
import com.uolken.contest.gateway.service.WorkGroupAssignmentService
import graphql.schema.DataFetchingEnvironment
import org.springframework.stereotype.Component
import java.util.concurrent.CompletableFuture

@Component
class WorkGroupAssignmentQuery(
    private val workGroupAssignmentService: WorkGroupAssignmentService
) : Query {

    fun workAssignments(
        groupId: Long,
        environment: DataFetchingEnvironment
    ): CompletableFuture<List<GraphQLWorkGroupAssignment>> {
        return environment.getValueFromDataLoader(DataLoaders.assignmentsByGroupIdDataLoader, groupId)
    }
}
