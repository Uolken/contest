package com.uolken.contest.problems.service

import com.uolken.contest.problems.model.Tag
import com.uolken.contest.problems.repository.TagRepository
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.cast


interface TagService {
    fun getByTaskId(taskId: Long): Flux<Tag>
    fun getById(id: Long): Mono<Tag>
    fun getByIds(ids: List<Long>): Flux<Tag>
    fun getByTaskIds(ids: List<Long>): Flux<Pair<Long, MutableList<Tag>>>
}

@Service
class TagServiceImpl(
    private val tagRepository: TagRepository
) : TagService {
    override fun getByTaskId(taskId: Long): Flux<Tag> {
        return tagRepository.findByProblemId(taskId).cast()
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
