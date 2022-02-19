package com.uolken.contest.problems.service

import com.uolken.contest.problems.model.Tag
import com.uolken.contest.problems.model.dto.TagDto
import com.uolken.contest.problems.repository.TagRepository
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.cast
import reactor.kotlin.core.publisher.toFlux

interface TagService {
    fun getByTaskId(taskId: Long): Flux<Tag>
    fun getAll(): Flux<Tag>
    fun getById(id: Long): Mono<Tag>
    fun getByIds(ids: List<Long>): Flux<Tag>
    fun getByTaskIds(ids: List<Long>): Flux<Pair<Long, MutableList<Tag>>>
    fun setProblemTags(problemId: Long, tags: List<TagDto>)
}

@Service
class TagServiceImpl(
    private val tagRepository: TagRepository
) : TagService {
    override fun getByTaskId(taskId: Long): Flux<Tag> {
        return tagRepository.findByProblemId(taskId).cast()
    }

    override fun getAll(): Flux<Tag> {
        return tagRepository.findAll()
    }

    override fun getById(id: Long): Mono<Tag> {
        return tagRepository.findById(id)
    }

    override fun getByIds(ids: List<Long>): Flux<Tag> {
        return tagRepository.findAllById(ids)
    }

    override fun getByTaskIds(ids: List<Long>): Flux<Pair<Long, MutableList<Tag>>> {
//        val groupBy1 = tagRepository.findByTaskIds(ids).groupBy { it.taskId }
//        val join = Flux.fromIterable(ids)
//            .join(
//                groupBy1,
//                {
//                    Mono.just(it)
//                },
//                {
//                    Mono.just(it.key())
//                },
//                { a, b ->
//                    a to
//                            b.map {
//                        Tag(it.id ?: -1, it.name ?: "")
//                    }.collectList().toFuture().get()
//                })
        return tagRepository.findByProblemIds(ids).groupBy({ it.problemId }, { Tag(it.id, it.name)})
            .flatMap { group -> group.collectList().map { group.key() to it } }
    }

    override fun setProblemTags(problemId: Long, tags: List<TagDto>) {
        val tagIds = tags.map { it.id }
        val removedTags = if (tags.isEmpty()) tagRepository.removeProblemTags(problemId)
        else {
            tagRepository.removeProblemTags(problemId, tagIds)
        }
        removedTags.flatMapMany {
            tags.toFlux()
                .flatMap { if (it.id != 0L) Mono.just(it.id) else tagRepository.save(Tag(0, it.name)).map {it.id} }
                .flatMap { tagRepository.setProblemTags(problemId, it) }
        }.subscribe()
    }
    //        val flatMap = Flux.fromIterable(ids)
//            .subscribeOn(Schedulers.parallel())
//            .groupJoin(
//                tagRepository.findByTaskIds(ids),
//                { Mono.just(it) },
//                { Mono.just(it.taskId) },
//                { a, b ->
//                    b.collectList().map { a to it }
////                    b.map {
////                        Tag(it.id, it.name)
////                    }.collectList().map { a to it }
//                })



//        val gjoin = flatMap
//        return gjoin.flatMap { it }
//            .collectList()
//        val groupBy = tagRepository.findByTaskIds(ids)
//            .groupBy { it.taskId }
//            .flatMap { group ->
//                group.flatMap { tag ->
//                    if (tag.id == null || tag.name == null) Mono.empty()
//                    else Mono.just(Tag(tag.id, tag.name))
//                }.collectList()
//            }


//        return groupBy


}
