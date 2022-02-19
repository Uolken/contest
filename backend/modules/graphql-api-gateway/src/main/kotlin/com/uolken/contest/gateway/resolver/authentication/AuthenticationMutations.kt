package com.uolken.contest.gateway.resolver.authentication

import com.expediagroup.graphql.generator.hooks.SchemaGeneratorHooks
import com.expediagroup.graphql.server.operations.Mutation
import com.uolken.contest.accounts.model.dto.request.SignInRequest
import com.uolken.contest.accounts.model.dto.request.SignUpRequest
import com.uolken.contest.accounts.model.dto.response.SessionResponse
import com.uolken.contest.authentication.model.dto.UserInfo
import com.uolken.contest.gateway.RedirectableWebClient
import com.uolken.contest.gateway.configuration.graphql.RedirectableGraphQLContext
import com.uolken.contest.gateway.redirectToGet
import com.uolken.contest.gateway.redirectToPost
import com.uolken.contest.solution.model.dto.SolveProblemRequest
import graphql.language.*
import graphql.scalars.ExtendedScalars
import graphql.schema.*
import org.springframework.stereotype.Component
import java.time.Duration
import java.time.LocalDateTime
import java.util.*
import java.util.concurrent.CompletableFuture
import kotlin.reflect.KClass
import kotlin.reflect.KType



@Component
class AuthenticationMutations(
    private val webClient: RedirectableWebClient
) : Mutation {
    fun login(signInRequest: SignInRequest, context: RedirectableGraphQLContext): CompletableFuture<SessionResponse> {
        return webClient.redirectToPost("http://account-service/auth/sign-in", context, signInRequest)
    }

    fun registration(signUpRequest: SignUpRequest, context: RedirectableGraphQLContext): CompletableFuture<SessionResponse> {
        return webClient.redirectToPost("http://account-service/auth/sign-up", context, signUpRequest)
    }

    fun logout(context: RedirectableGraphQLContext): CompletableFuture<Boolean> {
        return webClient.redirectToPost<Void?>("http://account-service/auth/sign-out", context)
            .thenApply { true }
    }

    fun refreshToken(context: RedirectableGraphQLContext): CompletableFuture<SessionResponse> {
        return webClient.redirectToPost("http://account-service/auth/refresh", context)
    }

    fun whoAmI(context: RedirectableGraphQLContext): CompletableFuture<UserInfo> {
        return webClient.redirectToGet("http://account-service/auth/who-am-i", context)
    }
}

