package com.uolken.contest.gateway.mutation

import com.expediagroup.graphql.server.operations.Mutation
import com.uolken.contest.accounts.model.dto.GroupDto
import com.uolken.contest.accounts.model.dto.UserDto
import com.uolken.contest.accounts.model.dto.request.CreateUserRequest
import com.uolken.contest.accounts.model.dto.request.ResetPasswordRequest
import com.uolken.contest.gateway.RedirectableWebClient
import com.uolken.contest.gateway.configuration.graphql.RedirectableGraphQLContext
import com.uolken.contest.gateway.model.GraphQLGroup
import com.uolken.contest.gateway.model.GraphQLUser
import com.uolken.contest.gateway.redirectToPost
import org.springframework.stereotype.Component
import java.util.*
import java.util.concurrent.CompletableFuture

@Component
class UserMutation(
   private val webClient: RedirectableWebClient
): Mutation {

    fun saveUser(createUserRequest: CreateUserRequest, context: RedirectableGraphQLContext): CompletableFuture<GraphQLUser> {
        return webClient.redirectToPost("http://account-service/users/save", context, createUserRequest)
    }

    fun resetPassword(resetPasswordRequest: ResetPasswordRequest, context: RedirectableGraphQLContext): CompletableFuture<GraphQLUser> {
        return webClient.redirectToPost("http://account-service/users/password/reset", context, resetPasswordRequest)
    }
}
