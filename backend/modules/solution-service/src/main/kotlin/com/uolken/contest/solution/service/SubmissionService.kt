package com.uolken.contest.solution.service

import com.uolken.contest.solution.model.ExecutionResult
import com.uolken.contest.solution.model.*
import com.uolken.contest.solution.model.dto.SolveProblemRequest
import com.uolken.contest.solution.model.dto.SubmissionCount
import com.uolken.contest.solution.model.selector.SubmissionSelector
import com.uolken.contest.solution.model.selector.SubmissionSelectorWithPage
import com.uolken.contest.solution.repository.SolutionAggregatedInfo
import com.uolken.contest.solution.repository.SubmissionRepository
import org.bson.types.ObjectId
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.data.mongodb.core.ReactiveMongoTemplate
import org.springframework.data.mongodb.core.query.Criteria.where
import org.springframework.data.mongodb.core.query.Query
import org.springframework.data.mongodb.core.query.Update
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.toFlux
import java.time.Clock
import java.time.LocalDate
import java.time.LocalDateTime

interface SubmissionService {

    fun getSolutionInfo(submitterId: Long, problemId: Long): Mono<SolutionInfo>
    fun getSolutionsInfo(solutionIds: List<SolutionId>): Flux<SolutionInfo>
    fun getSolutionsInfo(submitterId: Long, problemIds: List<Long>): Flux<SolutionInfo>
    fun createSubmission(submitterId: Long, problemId: Long, solveProblemRequest: SolveProblemRequest): Mono<Submission>
    fun updateSubmissionStatus(submissionId: String, executionResult: ExecutionResult): Mono<Submission>
    fun getSubmissions(selector: SubmissionSelectorWithPage): Flux<Submission>
    fun getSubmissionCount(selector: SubmissionSelector): Mono<Long>
    fun getSubmission(submissionId: String): Mono<Submission>
    fun getSubmissionCounts(start: LocalDate, end: LocalDate, userId: Long): Flux<SubmissionCount>
}

@Service
class SubmissionServiceImpl(
    private val submissionRepository: SubmissionRepository,
    private val mongoTemplate: ReactiveMongoTemplate,
    private val clock: Clock
) : SubmissionService {

    override fun getSolutionInfo(submitterId: Long, problemId: Long): Mono<SolutionInfo> {
        return submissionRepository.getSolutionInfo(submitterId, listOf(problemId))
            .map {
                SolutionInfo(
                    it.submitterId,
                    it.problemId,
                    it.submissionsCount,
                    getSubmissionStatus(it)
                )
            }.next()
    }

    override fun getSolutionsInfo(solutionIds: List<SolutionId>): Flux<SolutionInfo> {
        return solutionIds.toFlux().flatMap { getSolutionInfo(it.submitterId, it.problemId) }
    }

    private fun getSubmissionStatus(solutionAggregatedInfo: SolutionAggregatedInfo): SolutionStatus {
        return when {
            solutionAggregatedInfo.succeedCount > 0 -> SolutionStatus.ACCEPTED
            solutionAggregatedInfo.testingCount > 0 -> SolutionStatus.TESTING
            solutionAggregatedInfo.failedCount > 0 -> SolutionStatus.FAILED_TEST
            solutionAggregatedInfo.toTestCount > 0 -> SolutionStatus.TO_TEST
            else -> SolutionStatus.NOT_SUBMITTED
        }
    }

    override fun getSolutionsInfo(submitterId: Long, problemIds: List<Long>): Flux<SolutionInfo> {
        return submissionRepository.getSolutionInfo(submitterId, problemIds)
            .map {
                SolutionInfo(
                    it.submitterId,
                    it.problemId,
                    it.submissionsCount,
                    getSubmissionStatus(it)
                )
            }
    }

    override fun createSubmission(
        submitterId: Long,
        problemId: Long,
        solveProblemRequest: SolveProblemRequest
    ): Mono<Submission> {
        return submissionRepository.insert(
            Submission(
                ObjectId.get(),
                problemId,
                submitterId,
                solveProblemRequest.language,
                solveProblemRequest.solutionText,
                SubmissionStatus.TO_TEST,
                LocalDateTime.now(clock)
            )
        )
    }

    override fun updateSubmissionStatus(submissionId: String, executionResult: ExecutionResult): Mono<Submission> {
        val status = computeStatus(executionResult)
        return mongoTemplate.findAndModify(
            Query(
                where("_id").`is`(submissionId)
            ),
            Update().set("executionResult", executionResult).set("status", status)
        )
    }

    override fun getSubmissions(selector: SubmissionSelectorWithPage): Flux<Submission> {
        val pageSelector = selector.pageSelector
        val pageSize = getPageSizeOrDefault(pageSelector.pageSize)
        val sortField = getSortFieldOrDefault(pageSelector.sortField)
        val sort = Sort.by(sortField).let { if(pageSelector.sortDirIsDesc) it.descending() else it.ascending() }

        val submissionSelector = selector.submissionSelector


        return submissionRepository.findBySelector(
            submissionSelector.languages ?: emptyList(),
            submissionSelector.problemIds ?: emptyList(),
            submissionSelector.submitterIds ?: emptyList(),
            submissionSelector.statuses ?: emptyList(),
            submissionSelector.from?.toLocalDateTime(),
            submissionSelector.to?.toLocalDateTime(),
            PageRequest.of(pageSelector.currentPage, pageSize, sort)
        )
    }

    override fun getSubmissionCount(selector: SubmissionSelector): Mono<Long> {
        return submissionRepository.countBySelector(
            selector.languages ?: emptyList(),
            selector.problemIds ?: emptyList(),
            selector.submitterIds ?: emptyList(),
            selector.statuses ?: emptyList(),
        )
    }

    override fun getSubmission(submissionId: String): Mono<Submission> {
        return submissionRepository.findById(submissionId)
    }

    override fun getSubmissionCounts(start: LocalDate, end: LocalDate, userId: Long): Flux<SubmissionCount> {
        return submissionRepository.countsByDates(start, end, userId)
    }

    private fun getSortFieldOrDefault(sortField: String): String {
        return if(sortableFields.contains(sortField)) return sortField else "submitted"
    }

    private fun getPageSizeOrDefault(pageSize: Int) =
        if(pageSize in 2..99) pageSize else 100
    //
    // override fun getSubmissions(problemAndUserIds: Set<ProblemAndSubmitterId>): Flux<Submission> {
    //     return problemAndUserIds.toFlux().flatMap { getSubmissions(it) }
    // }
    //
    // fun getSubmissions(problemAndUserIds: ProblemAndSubmitterId): Flux<Submission> =
    //     submissionRepository.findByProblemIdAndSubmitterId(problemAndUserIds.problemId, problemAndUserIds.submitterId)

    private fun computeStatus(executionResult: ExecutionResult): SubmissionStatus {
        return if(executionResult.testsPassed) {
            SubmissionStatus.SUCCEED
        } else {
            SubmissionStatus.FAILED
        }
    }

    companion object {

        val sortableFields = listOf(
            "language", "status", "submitted"
        )
    }

}

inline fun <reified T> ReactiveMongoTemplate.findAndModify(query: Query, set: Update): Mono<T> =
    this.findAndModify(query, set, T::class.java)
