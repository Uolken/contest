package com.uolken.contest.gateway.mutation

import com.expediagroup.graphql.server.operations.Mutation
import com.uolken.contest.gateway.RedirectableWebClient
import com.uolken.contest.gateway.configuration.graphql.RedirectableGraphQLContext
import com.uolken.contest.gateway.model.GraphQLWork
import com.uolken.contest.gateway.redirectToPost
import com.uolken.contest.problems.model.WorkType
import com.uolken.contest.problems.model.dto.WorkGroupAssignmentDto
import com.uolken.contest.problems.model.dto.WorkUpdateDto
import org.springframework.stereotype.Component
import java.time.LocalDateTime
import java.time.OffsetDateTime
import java.util.concurrent.CompletableFuture

@Component
class WorkMutation(
    private val webClient: RedirectableWebClient
): Mutation {

    fun saveWork(workUpdateInput: WorkUpdateDto, context: RedirectableGraphQLContext): CompletableFuture<GraphQLWork> {
        return webClient.redirectToPost("http://problem-service/works/save", context, workUpdateInput)
    }
}



