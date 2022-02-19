package com.uolken.contest.gateway.configuration.graphql

import com.expediagroup.graphql.server.spring.subscriptions.SpringSubscriptionGraphQLContextFactory
import com.uolken.contest.gateway.service.JwtDecoderService
import org.springframework.stereotype.Component
import org.springframework.web.reactive.socket.WebSocketSession

@Component
class SubscriptionGraphQLContextFactory(
    private val jwtDecoderService: JwtDecoderService
) : SpringSubscriptionGraphQLContextFactory<SubscriptionGraphQLContext>() {

    override suspend fun generateContext(request: WebSocketSession): SubscriptionGraphQLContext {
        val auth = request.handshakeInfo.cookies["token"]?.first()?.value
        val userId = jwtDecoderService.decodeUserId(auth) ?: throw Exception()
        return SubscriptionGraphQLContext(request, userId)
    }
}
