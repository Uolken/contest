package com.uolken.contest.gateway.service

import com.uolken.contest.gateway.RedirectableWebClient
import com.uolken.contest.gateway.configuration.graphql.RedirectableGraphQLContext
import com.uolken.contest.gateway.model.GraphQLWorkGroupAssignment
import com.uolken.contest.gateway.redirectToGet
import com.uolken.contest.gateway.redirectToPost
import com.uolken.contest.gateway.resolver.task.DefaultIfNullMap
import com.uolken.contest.gateway.resolver.task.EmptyIfNullMap
import com.uolken.contest.problems.model.dto.AssignmentId
import com.uolken.contest.problems.model.dto.WorkGroupAssignmentDto
import org.springframework.stereotype.Service
import java.util.concurrent.CompletableFuture

interface WorkGroupAssignmentService {

    fun assignmentsByGroupIds(
        groupIds: Set<Long>,
        context: RedirectableGraphQLContext
    ): CompletableFuture<Map<Long, List<GraphQLWorkGroupAssignment>>>

    fun assignmentsByWorkIds(
        workIds: Set<Long>,
        context: RedirectableGraphQLContext
    ): CompletableFuture<Map<Long, List<GraphQLWorkGroupAssignment>>>

    fun assignmentsByIds(
        assignmentIds: Set<AssignmentId>,
        context: RedirectableGraphQLContext
    ): CompletableFuture<Map<AssignmentId, GraphQLWorkGroupAssignment>>

}

@Service
class WorkGroupAssignmentServiceImpl(
    private val webClient: RedirectableWebClient
) : WorkGroupAssignmentService {

    override fun assignmentsByGroupIds(
        groupIds: Set<Long>,
        context: RedirectableGraphQLContext
    ): CompletableFuture<Map<Long, List<GraphQLWorkGroupAssignment>>> {
        return webClient.redirectToGet<List<WorkGroupAssignmentDto>>(
            "http://problem-service/groups/batched/assignments",
            context,
            mapOf("groupIds" to groupIds)
        ).thenApply { assignments ->
            EmptyIfNullMap(assignments.groupBy({ it.groupId }, { GraphQLWorkGroupAssignment(it) }))
        }
    }

    override fun assignmentsByWorkIds(
        workIds: Set<Long>,
        context: RedirectableGraphQLContext
    ): CompletableFuture<Map<Long, List<GraphQLWorkGroupAssignment>>> {
        return webClient.redirectToGet<List<WorkGroupAssignmentDto>>(
            "http://problem-service/works/batched/assignments",
            context,
            mapOf("workIds" to workIds)
        ).thenApply { assignments ->
            EmptyIfNullMap(assignments.groupBy({ it.workId }, { GraphQLWorkGroupAssignment(it) }))
        }
    }

    override fun assignmentsByIds(
        assignmentIds: Set<AssignmentId>,
        context: RedirectableGraphQLContext
    ): CompletableFuture<Map<AssignmentId, GraphQLWorkGroupAssignment>> {
        return webClient.redirectToPost<List<WorkGroupAssignmentDto>>(
            "http://problem-service/groups/batched/works/batched",
            context,
            assignmentIds
        ).thenApply { it.associateBy({ AssignmentId(it.workId, it.groupId) }, { GraphQLWorkGroupAssignment(it) }) }
    }
}
