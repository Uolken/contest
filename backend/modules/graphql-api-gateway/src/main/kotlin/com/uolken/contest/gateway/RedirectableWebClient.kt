package com.uolken.contest.gateway

import com.uolken.contest.gateway.configuration.graphql.RedirectableGraphQLContext
import org.slf4j.LoggerFactory
import org.springframework.core.ParameterizedTypeReference
import org.springframework.http.HttpMethod
import org.springframework.stereotype.Service
import org.springframework.util.LinkedMultiValueMap
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.util.UriComponentsBuilder
import reactor.core.publisher.Mono
import java.util.concurrent.CompletableFuture

interface RedirectableWebClient {

    fun <T> redirectToPost(
        uri: String,
        returnType: ParameterizedTypeReference<T>,
        context: RedirectableGraphQLContext? = null,
        body: Any? = null
    ): CompletableFuture<T>

    fun <T> redirectToGet(
        uri: String,
        returnType: ParameterizedTypeReference<T>,
        context: RedirectableGraphQLContext?,
        params: Map<String, Any?>?
    ): CompletableFuture<T>
}

inline fun <reified T> RedirectableWebClient.redirectToPost(
    uri: String,
    context: RedirectableGraphQLContext? = null,
    body: Any? = null
) = redirectToPost(uri, object : ParameterizedTypeReference<T>() {}, context, body)

inline fun <reified T> RedirectableWebClient.redirectToGet(
    uri: String,
    context: RedirectableGraphQLContext? = null,
    params: Map<String, Any?>? = null
): CompletableFuture<T> = redirectToGet(uri, object : ParameterizedTypeReference<T>() {}, context, params)

@Service
class RedirectableWebClientImpl(
    private val webClientBuilder: WebClient.Builder
) : RedirectableWebClient {

    override fun <T> redirectToPost(
        uri: String,
        returnType: ParameterizedTypeReference<T>,
        context: RedirectableGraphQLContext?,
        body: Any?
    ): CompletableFuture<T> {
        return doRequest(uri, HttpMethod.POST, returnType, body = body, context = context)
    }

    override fun <T> redirectToGet(
        uri: String,
        returnType: ParameterizedTypeReference<T>,
        context: RedirectableGraphQLContext?,
        params: Map<String, Any?>?
    ): CompletableFuture<T> {
        return doRequest(uri, HttpMethod.GET, returnType, params, context = context)
    }

    private fun <T> doRequest(
        uri: String,
        method: HttpMethod,
        returnType: ParameterizedTypeReference<T>,
        uriVariables: Map<String, Any?>? = null,
        body: Any? = null,
        context: RedirectableGraphQLContext? = null
    ): CompletableFuture<T> {
        log.info("Request to URI: $uri")
        val requestParams = getRequestParams(uriVariables)

        return webClientBuilder.build()
            .method(method)
            .uri("$uri$requestParams")
            .let { if(context != null) it.cookies { c -> c.addAll(context.getCookiesAsMultiValueMap()) } else it }
            .let { if(body != null) it.bodyValue(body) else it }
            .retrieve()
            .toEntity(returnType)
            .doOnNext { context?.addCookiesFrom(it) }
            .flatMap { Mono.justOrEmpty(it.body) }
            .toFuture()
    }

    //    private fun <T> doRequestForList(
    //        uri: String,
    //        method: HttpMethod,
    //        returnType: Class<T>,
    //        uriVariables: Map<String, Any>? = null,
    //        body: Any? = null,
    //        context: RedirectableGraphQLContext? = null
    //    ): CompletableFuture<List<T>> {
    //        val requestParams = getRequestParams(uriVariables)
    //        return webClientBuilder.build()
    //            .method(method)
    //            .uri("$uri?$requestParams")
    //            .let { if (context != null) it.cookies { c -> c.addAll(context.getCookiesAsMultiValueMap()) } else it }
    //            .let { if (body != null) it.bodyValue(body) else it }
    //            .retrieve()
    //            .toEntityFlux(returnType)
    //            .doOnNext { context?.addCookiesFrom(it) }
    //            .flatMap { it.body.collectList() }
    //            .cast<List<T>>()
    //            .toFuture()
    //    }

    private fun getRequestParams(uriParams: Map<String, Any?>?): String {
        uriParams ?: return ""
        return UriComponentsBuilder.newInstance().queryParams(toQueryParameters(uriParams))
            .build().toUri().toString()
    }

    companion object {

        val log = LoggerFactory.getLogger(RedirectableWebClient::class.java)
    }
}

fun toQueryParameters(map: Map<String, Any?>): LinkedMultiValueMap<String, String> {
    val linkedMultiValueMap = LinkedMultiValueMap<String, String>(map.size)
    map.filter { it.value != null }.forEach { (key, value) ->
        if (value is Iterable<*>) {
            if (value.first() is Number) {
                linkedMultiValueMap[key] = value.joinToString(",")
            } else {
                linkedMultiValueMap[key] =  value.map { it.toString() }
            }
        } else {
            linkedMultiValueMap[key] = listOf(value.toString())
        }
    }
    return linkedMultiValueMap
}
