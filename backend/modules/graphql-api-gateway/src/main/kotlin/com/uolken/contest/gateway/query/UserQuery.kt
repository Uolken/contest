package com.uolken.contest.gateway.query

import com.expediagroup.graphql.server.extensions.getValueFromDataLoader
import com.expediagroup.graphql.server.operations.Query
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.convertValue
import com.uolken.contest.accounts.model.dto.UserDto
import com.uolken.contest.accounts.model.dto.filter.UserSelector
import com.uolken.contest.accounts.model.dto.request.CreateUserRequest
import com.uolken.contest.gateway.RedirectableWebClient
import com.uolken.contest.gateway.configuration.graphql.RedirectableGraphQLContext
import com.uolken.contest.gateway.loader.DataLoaders
import com.uolken.contest.gateway.model.GraphQLUser
import com.uolken.contest.gateway.redirectToGet
import com.uolken.contest.gateway.redirectToPost
import graphql.schema.DataFetchingEnvironment
import org.springframework.security.core.userdetails.User
import org.springframework.stereotype.Component
import java.util.concurrent.CompletableFuture

@Component
class UserQuery(
    private val webClient: RedirectableWebClient,
    private val objectMapper: ObjectMapper
): Query {

    fun user(userId: Long, environment: DataFetchingEnvironment): CompletableFuture<GraphQLUser> {
        return environment.getValueFromDataLoader(DataLoaders.userDataLoader, userId)
    }

    fun users(selector: UserSelector, context: RedirectableGraphQLContext): CompletableFuture<List<GraphQLUser>> {
        val params = objectMapper.convertValue<Map<String, Any?>>(selector)
        return webClient.redirectToGet<List<UserDto>>("http://account-service/users", context, params).thenApply {
            it.map { GraphQLUser(it) }
        }
    }

    fun userCount(selector: UserSelector, context: RedirectableGraphQLContext): CompletableFuture<Long> {
        val params = objectMapper.convertValue<HashMap<String, Any?>>(selector)
        return webClient.redirectToGet("http://account-service/users/count", context, params)
    }

}
