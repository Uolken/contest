package com.uolken.contest.gateway.mutation

import com.expediagroup.graphql.server.operations.Mutation
import com.uolken.contest.gateway.RedirectableWebClient
import com.uolken.contest.gateway.configuration.graphql.RedirectableGraphQLContext
import com.uolken.contest.gateway.redirectToPost
import com.uolken.contest.problems.model.dto.WorkAssignmentDto
import org.springframework.stereotype.Component
import java.util.concurrent.CompletableFuture

@Component
class AssignmentMutation(
    private val webClient: RedirectableWebClient
) : Mutation {

    fun saveWorkAssignments(
        workId: Long,
        workAssignments: List<WorkAssignmentDto>,
        context: RedirectableGraphQLContext
    ): CompletableFuture<List<Long>> {
        return webClient.redirectToPost(
            "http://problem-service/works/$workId/assignments/save",
            context,
            workAssignments
        )
    }

    fun saveGroupAssignments(
        groupId: Long,
        workAssignments: List<WorkAssignmentDto>,
        context: RedirectableGraphQLContext
    ): CompletableFuture<List<Long>> {
        return webClient.redirectToPost(
            "http://problem-service/groups/$groupId/assignments/save",
            context,
            workAssignments
        )
    }
}
