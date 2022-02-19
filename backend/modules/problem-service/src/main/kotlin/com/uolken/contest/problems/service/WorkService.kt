package com.uolken.contest.problems.service

import com.uolken.contest.problems.model.Work
import com.uolken.contest.problems.model.dto.WorkUpdateDto
import com.uolken.contest.problems.model.filter.WorkSelector
import com.uolken.contest.problems.model.filter.WorkSelectorWithPage
import com.uolken.contest.problems.repository.WorkRepository
import org.springframework.r2dbc.core.DatabaseClient
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.toFlux
import java.time.Clock
import java.time.LocalDateTime

interface WorkService {

    fun get(): Flux<Work>
    fun getById(id: Long): Mono<Work>
    fun getByIds(ids: List<Long>): Flux<Work>
    fun getWorks(workSelectorWithPage: WorkSelectorWithPage): Flux<Work>
    fun getWorkCount(workSelector: WorkSelector): Mono<Long>
    fun saveWork(workUpdateDto: WorkUpdateDto, userId: Long): Mono<Work>
}

@Service
class WorkServiceImpl(
    private val workRepository: WorkRepository,
    private val workGroupAssignmentService: WorkGroupAssignmentService,
    private val databaseClient: DatabaseClient,
    private val clock: Clock
) : WorkService {

    override fun get(): Flux<Work> {
        return workRepository.findAll()
    }

    override fun getById(id: Long): Mono<Work> {
        return workRepository.findById(id)
    }

    override fun getByIds(ids: List<Long>): Flux<Work> {
        return workRepository.findAllById(ids)
    }

    override fun getWorks(workSelectorWithPage: WorkSelectorWithPage): Flux<Work> {
        val query = StringBuilder("SELECT w.* FROM work w WHERE 1=1 ")
        val params = HashMap<String, String>()

        val workSelector = workSelectorWithPage.workSelector
        workSelector.name
            ?.let {
                query.append("AND LOWER(w.name) LIKE :name ")
                params.put("name", "%${it.toLowerCase()}%")

            }
        workSelector.workTypes
            ?.let { if(it.isNotEmpty()) query.append("AND w.type IN (${it.joinToString(",") { "\'$it\'" }}) ") }

        workSelector.authorId
            ?.let { query.append("AND w.author_id=${it} ") }

        workSelector.excludeIds
            ?.let { if(it.isNotEmpty()) query.append("AND w.id NOT IN (${it.joinToString() { it.toString() }})") }


        workSelector.started
            ?.let { query.append("AND (w.start IS NULL OR w.start ${if(it) "<" else ">"} '${LocalDateTime.now(clock)}') ") }

        workSelector.ended
            ?.let { query.append("AND (w.end_ IS NULL OR w.end_ ${if(it) ">" else "<"} '${LocalDateTime.now(clock)}') ") }

        val pageSelector = workSelectorWithPage.pageSelector
        val pageSize = if(pageSelector.pageSize > MAX_PAGE_SIZE) MAX_PAGE_SIZE else pageSelector.pageSize
        val offset = pageSize * pageSelector.currentPage
        val sortField = verifySortColumnOrDefault(pageSelector.sortField)
        val order = if(pageSelector.sortDirIsDesc) "DESC" else "ASC"
        query.append("ORDER BY $sortField $order OFFSET $offset LIMIT $pageSize")

        return databaseClient.sql(query.toString())
            .let { spec -> params.asSequence().fold(spec) { s, (k, v) -> s.bind(k, v) } }
            .map { row -> Work.fromRow(row) }
            .all()
    }

    override fun getWorkCount(workSelector: WorkSelector): Mono<Long> {
        val query = StringBuilder("SELECT count(w.*) FROM work w WHERE 1=1 ")
        val params = HashMap<String, String>()

        workSelector.name
            ?.let {
                query.append("AND LOWER(w.name) LIKE :name ")
                params.put("name", "%${it.toLowerCase()}%")

            }
        workSelector.workTypes
            ?.let { if(it.isNotEmpty()) query.append("AND w.type IN (${it.joinToString(",") { "\'$it\'" }}) ") }

        workSelector.authorId
            ?.let { query.append("AND w.author_id=${it} ") }

        workSelector.excludeIds
            ?.let { if(it.isNotEmpty()) query.append("AND w.id NOT IN (${it.joinToString() { it.toString() }})") }
        workSelector.started
            ?.let { query.append("AND (w.start IS NULL OR w.start ${if(it) "<" else ">"} '${LocalDateTime.now(clock)}') ") }

        workSelector.ended
            ?.let { query.append("AND (w.end_ IS NULL OR w.end_ ${if(it) ">" else "<"} '${LocalDateTime.now(clock)}') ") }

        return databaseClient.sql(query.toString())
            .let { spec -> params.asSequence().fold(spec) { s, (k, v) -> s.bind(k, v) } }
            .map { row -> row[0] as Long }
            .first()
    }

    override fun saveWork(workUpdateDto: WorkUpdateDto, userId: Long): Mono<Work> {
        val workId = workUpdateDto.id
        return (if(workId == null) createWork(workUpdateDto, userId) else workRepository.findById(workId)
            .flatMap { work ->
                workRepository.save(
                    Work(
                        workId,
                        workUpdateDto.name,
                        workUpdateDto.type,
                        workUpdateDto.start?.toLocalDateTime(),
                        workUpdateDto.end?.toLocalDateTime(),
                        work.authorId
                    )
                )
            }).doOnNext { work -> saveProblems(work.id, workUpdateDto.problemIds) }
    }

    private fun saveProblems(workId: Long, problemIds: List<Long>) {
        workRepository.removeProblems(workId)
            .thenMany(problemIds.toFlux().flatMap { workRepository.addTask(workId, it) }).subscribe()
    }

    private fun createWork(workUpdateDto: WorkUpdateDto, authorId: Long): Mono<Work> {
        return workRepository.save(
            Work(
                0,
                workUpdateDto.name,
                workUpdateDto.type,
                workUpdateDto.start?.toLocalDateTime(),
                workUpdateDto.start?.toLocalDateTime(),
                authorId
            )
        )
    }

    private fun verifySortColumnOrDefault(colum: String): String {
        return sortFieldMapper.getOrDefault(colum, "name")
    }

    companion object {

        const val MAX_PAGE_SIZE = 100
        val sortFieldMapper = mapOf(
            "id" to "id",
            "name" to "name",
            "start" to "start",
            "end" to "end_",
            "problemCount" to "(SELECT count(*) FROM work_problem wp WHERE wp.work_id = w.id)",
        )
    }

}
