package com.uolken.contest.gateway.resolver.task

import com.uolken.contest.gateway.RedirectableWebClient
import com.uolken.contest.gateway.configuration.graphql.RedirectableGraphQLContext
import com.uolken.contest.gateway.model.GraphQLTag
import com.uolken.contest.gateway.redirectToGet
import com.uolken.contest.problems.model.dto.TagDto
import org.springframework.stereotype.Service
import java.util.concurrent.CompletableFuture

interface TagService {
    fun getById(id: Long, context: RedirectableGraphQLContext): CompletableFuture<TagDto>

    fun getByIds(ids: Iterable<Long>, context: RedirectableGraphQLContext?): CompletableFuture<Map<Long, GraphQLTag>>
    fun getByProblemIds(
        ids: Iterable<Long>,
        context: RedirectableGraphQLContext?
    ): CompletableFuture<Map<Long, List<GraphQLTag>>>

    fun getByProblemId(problemId: Long, context: RedirectableGraphQLContext?): CompletableFuture<List<TagDto>>
}

@Service
class TagServiceImpl(
    private val redirectableWebClient: RedirectableWebClient
) : TagService {
    override fun getById(id: Long, context: RedirectableGraphQLContext): CompletableFuture<TagDto> {
        return redirectableWebClient.redirectToGet("http://problem-service/tags/${id}", context)
    }

    override fun getByIds(
        ids: Iterable<Long>,
        context: RedirectableGraphQLContext?
    ): CompletableFuture<Map<Long, GraphQLTag>> =
        redirectableWebClient.redirectToGet<List<Pair<Long, TagDto>>>(
            "http://problem-service/tags/batched",
            context,
            params = mapOf("id" to ids)
        )
            .thenApply { pairs ->
                pairs.map { it.first to GraphQLTag(it.second) }.toMap()
            }


    override fun getByProblemId(
        problemId: Long,
        context: RedirectableGraphQLContext?
    ): CompletableFuture<List<TagDto>> {
        return redirectableWebClient.redirectToGet(
            "http://problem-service/problem/$problemId/tags",
            context
        )
    }

    override fun getByProblemIds(
        ids: Iterable<Long>,
        context: RedirectableGraphQLContext?
    ): CompletableFuture<Map<Long, List<GraphQLTag>>> {
        val tags = redirectableWebClient.redirectToGet<List<Pair<Long, List<TagDto>>>>(
            "http://problem-service/problems/batched/tags",
            context,
            mapOf("problemIds" to ids)
        ).thenApply { pairs ->
            pairs.map { it.first to it.second.map { GraphQLTag(it) } }
        }

        return tags.thenApply { EmptyIfNullMap(it.toMap()) }
    }

}
