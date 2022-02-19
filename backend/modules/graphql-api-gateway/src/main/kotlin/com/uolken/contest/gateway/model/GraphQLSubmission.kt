package com.uolken.contest.gateway.model

import com.expediagroup.graphql.generator.annotations.GraphQLName
import com.expediagroup.graphql.server.extensions.getValueFromDataLoader
import com.uolken.contest.solution.model.ExecutionResult
import com.uolken.contest.gateway.loader.DataLoaders
import com.uolken.contest.solution.model.SubmissionDto
import com.uolken.contest.solution.model.SubmissionStatus
import graphql.schema.DataFetchingEnvironment
import java.time.OffsetDateTime
import java.time.ZoneOffset
import java.util.concurrent.CompletableFuture

@GraphQLName("Submission")
class GraphQLSubmission(private val submissionDto: SubmissionDto) {
    val id: String get() = submissionDto.id
    val problemId: Long get() = submissionDto.problemId
    val submitterId: Long get() = submissionDto.submitterId
    val status: SubmissionStatus get() = submissionDto.status
    val language: String get() = submissionDto.language
    val submitted: OffsetDateTime get() = submissionDto.submitted.atOffset(ZoneOffset.UTC)
    val code: String get() = submissionDto.code
    val executionResult: ExecutionResult? get() = submissionDto.executionResult

    fun submitter(environment: DataFetchingEnvironment): CompletableFuture<GraphQLUser> {
        return environment.getValueFromDataLoader(DataLoaders.userDataLoader, submissionDto.submitterId)
    }
    fun problem(environment: DataFetchingEnvironment): CompletableFuture<GraphQLProblem> {
        return environment.getValueFromDataLoader(DataLoaders.problemDataLoader, submissionDto.problemId)
    }
}
