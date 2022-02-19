package com.uolken.contest.solution.repository

import com.uolken.contest.solution.model.Submission
import com.uolken.contest.solution.model.SubmissionStatus
import com.uolken.contest.solution.model.dto.SubmissionCount
import org.springframework.data.domain.Pageable
import org.springframework.data.mongodb.repository.Aggregation
import org.springframework.data.mongodb.repository.Query
import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.time.LocalDate
import java.time.LocalDateTime

@Repository
interface SubmissionRepository : ReactiveMongoRepository<Submission, String> {

    @Aggregation(
        pipeline = [
            "{\$match: { problemId: {\$in: ?1}, submitterId: ?0 } }",
            "{ \$group: { _id: { problemId: \"\$problemId\", submitterId: \"\$submitterId\", status: \"\$status\" }, count: { \$sum: 1 } } }",
            "{ \$group: { _id: { problemId: \"\$_id.problemId\", submitterId: \"\$_id.submitterId\", }, statusesCounts: { \$addToSet: {status: \"\$_id.status\", count: \"\$count\"} } } }",
            "{ \$project: { _id: false, problemId: \"\$_id.problemId\", submitterId: \"\$_id.submitterId\", statusesCounts: \"\$statusesCounts\" } }"
        ]
    )
    fun getSolutionInfo(submitterId: Long, problemIds: List<Long>): Flux<SolutionAggregatedInfo>

    @Query(
        "{ \$and: [" +
            "{ \$or: [ { \$expr: :#{#languages.size == 0} }, { language: { \$in: :#{#languages} } }] }," +
            "{ \$or: [ { \$expr: :#{#problemIds.size == 0} }, { problemId: { \$in: :#{#problemIds} } }] }," +
            "{ \$or: [ { \$expr: :#{#submitterIds.size == 0} }, { submitterId: { \$in: :#{#submitterIds} } }] }," +
            "{ \$or: [ { \$expr: :#{#statuses.size == 0} }, { status: { \$in: :#{#statuses} } }] }" +
            "{ \$or: [ { \$expr: :#{#from == null} }, { submitted: { \$gte: :#{#from} } }] }" +
            "{ \$or: [ { \$expr: :#{#to == null} }, { submitted: { \$lte: :#{#to} } }] }" +
            "] }"
    )
    fun findBySelector(
        languages: List<String>,
        problemIds: List<Long>,
        submitterIds: List<Long>,
        statuses: List<SubmissionStatus>,
        from: LocalDateTime?,
        to: LocalDateTime?,
        pageable: Pageable
    ): Flux<Submission>

    @Query(
        count = true, value = "{ \$and: [" +
            "{ \$or: [ { \$expr: :#{#languages.size == 0} }, { language: { \$in: :#{#languages} } }] }," +
            "{ \$or: [ { \$expr: :#{#problemIds.size == 0} }, { problemId: { \$in: :#{#problemIds} } }] }," +
            "{ \$or: [ { \$expr: :#{#submitterIds.size == 0} }, { submitterId: { \$in: :#{#submitterIds} } }] }," +
            "{ \$or: [ { \$expr: :#{#statuses.size == 0} }, { status: { \$in: :#{#statuses} } }] }" +
            "] }"
    )
    fun countBySelector(
        languages: List<String>,
        problemIds: List<Long>,
        submitterIds: List<Long>,
        statuses: List<SubmissionStatus>,
    ): Mono<Long>

    @Aggregation(
        pipeline = [
            "{\$match: {submitted: {\$gte: ?0, \$lte: ?1}, submitterId: ?2} }",
            "{\$group: {_id: {\$dateToString: { format: \"%Y-%m-%d\", date: \"\$submitted\"}}, count: {\$sum: 1}}}",
            "{\$project: {_id: false, date: \"\$_id\", count: true}}"
        ]
    )
    fun countsByDates(start: LocalDate, end: LocalDate, userId: Long): Flux<SubmissionCount>
}

data class SolutionAggregatedInfo(
    val problemId: Long,
    val submitterId: Long,
    val statusesCounts: List<StatusCount>
) {

    val succeedCount: Int get() = submissionsInStatus(SubmissionStatus.SUCCEED)
    val testingCount: Int get() = submissionsInStatus(SubmissionStatus.TESTING)
    val failedCount: Int get() = submissionsInStatus(SubmissionStatus.FAILED)
    val toTestCount: Int get() = submissionsInStatus(SubmissionStatus.TO_TEST)
    val submissionsCount: Int get() = statusesCounts.sumOf { it.count }

    fun submissionsInStatus(status: SubmissionStatus): Int =
        statusesCounts.find { it.status == status }?.count ?: 0
}

data class StatusCount(
    val status: SubmissionStatus,
    val count: Int,
)
