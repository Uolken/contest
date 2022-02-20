package com.uolken.contest.problems.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.uolken.contest.problems.model.Problem
import com.uolken.contest.problems.model.dto.ProblemUpdateDto
import com.uolken.contest.problems.model.filter.ProblemSelector
import com.uolken.contest.problems.model.filter.ProblemSelectorWithPage
import com.uolken.contest.problems.repository.ProblemRepository
import io.r2dbc.postgresql.codec.Json
import org.springframework.data.domain.PageRequest
import org.springframework.r2dbc.core.DatabaseClient
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

interface ProblemService {

    fun getAll(): Flux<Problem>
    fun save(newProblem: ProblemUpdateDto, userId: Long): Mono<Problem>
    fun getByWorkIds(ids: List<Long>): Flux<Pair<Long, List<Problem>>>
    fun getByIds(ids: List<Long>): Flux<Problem>
    fun getByWorkId(id: Long): Flux<Problem>
    fun getByIdAndWorkId(workId: Long, id: Long): Mono<Problem>
    fun getLibraryProblems(page: Int, size: Int): Flux<Problem>
    fun getLibraryProblem(problemId: Long): Mono<Problem>
    fun getProblems(problemSelectorWithPage: ProblemSelectorWithPage): Flux<Problem>
    fun getProblemCount(problemSelector: ProblemSelector): Mono<Long>
}

@Service
class ProblemServiceImpl(
    private val problemRepository: ProblemRepository,
    private val tagService: TagService,
    private val objectMapper: ObjectMapper,
    private val databaseClient: DatabaseClient,
) : ProblemService {

    override fun getAll(): Flux<Problem> {
        return problemRepository.findAll()
    }

    override fun save(newProblem: ProblemUpdateDto, userId: Long): Mono<Problem> {
        val problemId = if (newProblem.id == 0L) return saveNewProblem(newProblem, userId) else newProblem.id
        return problemRepository.findById(problemId)
            .flatMap {
                problemRepository.save(
                    Problem(
                        id = it.id,
                        authorId = it.authorId,
                        name = newProblem.name,
                        text = newProblem.text,
                        examples = Json.of(objectMapper.writeValueAsBytes(newProblem.examples)),
                        inLibrary = newProblem.inLibrary
                    )
                )
            }.map { problem ->
                tagService.setProblemTags(problem.id, newProblem.tags)
                problem
            }
    }

    private fun saveNewProblem(newProblem: ProblemUpdateDto, authorId: Long): Mono<Problem> {
        return problemRepository.save(
            Problem(
                id = 0,
                name = newProblem.name,
                text = newProblem.text,
                examples = Json.of(objectMapper.writeValueAsBytes(newProblem.examples)),
                inLibrary = newProblem.inLibrary,
                authorId = authorId
            )
        )
    }

    override fun getByWorkIds(ids: List<Long>): Flux<Pair<Long, List<Problem>>> {
        return problemRepository.findByWorkIds(ids)
            .groupBy { it.workId }
            .flatMap { group -> group.collectList().map { group.key() to it } }
    }

    override fun getByIds(ids: List<Long>): Flux<Problem> {
        return problemRepository.findAllById(ids)
    }

    override fun getByWorkId(id: Long): Flux<Problem> {
        return problemRepository.findByWorkId(id)
    }

    override fun getByIdAndWorkId(workId: Long, id: Long): Mono<Problem> {
        return problemRepository.findByIdAndWorkId(workId, id)
    }

    override fun getLibraryProblems(page: Int, size: Int): Flux<Problem> {
        return problemRepository.findByInLibraryTrue(PageRequest.of(page, size))
    }

    override fun getLibraryProblem(problemId: Long): Mono<Problem> {
        return problemRepository.findById(problemId).filter { it.inLibrary }
    }

    override fun getProblems(problemSelectorWithPage: ProblemSelectorWithPage): Flux<Problem> {
        val query = StringBuilder("SELECT p.* FROM problem p WHERE 1=1 ")
        val params = HashMap<String, String>()

        val problemSelector = problemSelectorWithPage.problemSelector
        problemSelector.name
            ?.let {
                query.append("AND LOWER(p.name) LIKE :name ")
                params.put("name", "%${it.toLowerCase()}%")
            }

        problemSelector.tagIds
            ?.let { if(it.isNotEmpty()) query.append("AND exists(select * from problem_tag pt WHERE pt.problem_id = p.id and pt.tag_id in (${it.joinToString() { it.toString() }})) ") }

        problemSelector.authorId
            ?.let { query.append("AND p.author_id=${it} ") }

        problemSelector.inLibrary
            ?.let { query.append("AND p.in_library=${it} ") }

        problemSelector.excludeIds
            ?.let { if(it.isNotEmpty()) query.append("AND p.id NOT IN (${it.joinToString() { it.toString() }})") }

        val pageSelector = problemSelectorWithPage.pageSelector
        val pageSize = if(pageSelector.pageSize > MAX_PAGE_SIZE) MAX_PAGE_SIZE else pageSelector.pageSize
        val offset = pageSize * pageSelector.currentPage
        val sortField = verifySortColumnOrDefault(pageSelector.sortField)
        val order = if(pageSelector.sortDirIsDesc) "DESC" else "ASC"
        query.append("ORDER BY $sortField $order OFFSET $offset LIMIT $pageSize")

        return databaseClient.sql(query.toString())
            .let { spec -> params.asSequence().fold(spec) { s, (k, v) -> s.bind(k, v) } }
            .map { row -> Problem.fromRow(row) }
            .all()

    }

    override fun getProblemCount(problemSelector: ProblemSelector): Mono<Long> {
        val query = StringBuilder("SELECT count(p.*) FROM problem p WHERE 1=1 ")
        val params = HashMap<String, String>()

        problemSelector.name
            ?.let {
                query.append("AND LOWER(p.name) LIKE :name ")
                params.put("name", "%${it.toLowerCase()}%")
            }

        problemSelector.tagIds
            ?.let { if(it.isNotEmpty()) query.append("AND exists(select * from problem_tag pt WHERE pt.problem_id = p.id and pt.tag_id in (${it.joinToString() { it.toString() }})) ") }

        problemSelector.authorId
            ?.let { query.append("AND p.author_id=${it} ") }

        problemSelector.inLibrary
            ?.let { query.append("AND p.in_library=${it} ") }

        problemSelector.excludeIds
            ?.let { if (it.isNotEmpty()) query.append("AND p.id NOT IN (${it.joinToString() {it.toString()}})") }


        return databaseClient.sql(query.toString())
            .let { spec -> params.asSequence().fold(spec) { s, (k, v) -> s.bind(k, v) } }
            .map { row -> row.get(0) as Long }
            .first()

    }

    private fun verifySortColumnOrDefault(colum: String): String {
        return sortFieldMapper.getOrDefault(colum, "name")
    }

    companion object {

        val sortFieldMapper = mapOf(
            "id" to "id",
            "name" to "name"
        )
        const val MAX_PAGE_SIZE = 100
    }
}
