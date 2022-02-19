package com.uolken.contest.gateway.configuration.graphql

import com.expediagroup.graphql.server.spring.execution.SpringGraphQLContext
import com.expediagroup.graphql.server.spring.execution.SpringGraphQLContextFactory
import org.springframework.http.HttpCookie
import org.springframework.http.HttpEntity
import org.springframework.http.server.reactive.ServerHttpRequest
import org.springframework.http.server.reactive.ServerHttpResponse
import org.springframework.stereotype.Component
import org.springframework.util.LinkedMultiValueMap
import org.springframework.util.MultiValueMap
import org.springframework.web.reactive.function.server.ServerRequest


class RedirectableGraphQLContext(request: ServerRequest) : SpringGraphQLContext(request) {
    private val request: ServerHttpRequest = request.exchange().request
    private val response: ServerHttpResponse = request.exchange().response

    fun getCookies(): MultiValueMap<String, HttpCookie> = request.cookies
    fun addCookiesFrom(entity: HttpEntity<*>) {
        response.headers.addAll(entity.headers)

    }

    fun getCookiesAsMultiValueMap(): MultiValueMap<String, String> {
        return LinkedMultiValueMap(getCookies().mapValues { (_, cookies) -> cookies.map { it.value } })
    }
}

@Component
class MyGraphQLContextFactory : SpringGraphQLContextFactory<RedirectableGraphQLContext>() {
    override suspend fun generateContext(request: ServerRequest): RedirectableGraphQLContext {
        return RedirectableGraphQLContext(request)
    }
}
