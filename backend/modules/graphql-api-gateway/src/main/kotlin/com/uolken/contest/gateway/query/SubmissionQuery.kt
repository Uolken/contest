package com.uolken.contest.gateway.query

import com.expediagroup.graphql.server.operations.Query
import com.uolken.contest.gateway.RedirectableWebClient
import com.uolken.contest.gateway.configuration.graphql.RedirectableGraphQLContext
import com.uolken.contest.gateway.model.GraphQLSubmission
import com.uolken.contest.gateway.redirectToGet
import com.uolken.contest.gateway.redirectToPost
import com.uolken.contest.solution.model.dto.SubmissionCount
import com.uolken.contest.solution.model.selector.SubmissionSelector
import com.uolken.contest.solution.model.selector.SubmissionSelectorWithPage
import org.springframework.stereotype.Component
import java.time.LocalDate
import java.util.concurrent.CompletableFuture

@Component
class SubmissionQuery(
    private val webClient: RedirectableWebClient
) : Query {

    fun submission(submissionId: String, context: RedirectableGraphQLContext): CompletableFuture<GraphQLSubmission> {
        return webClient.redirectToGet("http://solution-service/submissions/$submissionId", context)
    }

    fun submissions(selector: SubmissionSelectorWithPage, context: RedirectableGraphQLContext): CompletableFuture<List<GraphQLSubmission>> {
        return webClient.redirectToPost("http://solution-service/submissions", context, selector)
    }

    fun submissionCount(selector: SubmissionSelector, context: RedirectableGraphQLContext): CompletableFuture<Long> {
        return webClient.redirectToPost("http://solution-service/submissions/count", context, selector)
    }

    fun submissionCountsByDates(start: LocalDate, end: LocalDate, userId: Long, context: RedirectableGraphQLContext): CompletableFuture<List<SubmissionCount>> {
        return webClient.redirectToGet("http://solution-service/submissions/counts-by-dates", context, mapOf(
            "start" to start,
            "end" to end,
            "userId" to userId
        ))
    }
}
