package com.uolken.contest.gateway.configuration.graphql

import com.expediagroup.graphql.generator.execution.GraphQLContext
import org.springframework.web.reactive.socket.WebSocketSession
import java.util.*

class SubscriptionGraphQLContext(
    val request: WebSocketSession,
    var userId: Long
): GraphQLContext
