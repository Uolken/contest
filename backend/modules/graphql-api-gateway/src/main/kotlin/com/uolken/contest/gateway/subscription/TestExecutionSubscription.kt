package com.uolken.contest.gateway.subscription

import com.expediagroup.graphql.generator.annotations.GraphQLIgnore
import com.expediagroup.graphql.server.operations.Subscription
import com.uolken.contest.solution.model.TestExecutionEvent
import com.uolken.contest.gateway.configuration.graphql.SubscriptionGraphQLContext
import com.uolken.contest.gateway.service.JwtDecoderService
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.stereotype.Component
import reactor.core.publisher.Flux
import reactor.core.publisher.FluxSink
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.ConcurrentLinkedQueue
import java.util.concurrent.ConcurrentMap

@Component
class TestExecutionSubscription(
    private val jwtDecoderService: JwtDecoderService
): Subscription {

    val subscriptions: ConcurrentMap<TestExecutionKey, ConcurrentLinkedQueue<FluxSink<TestExecutionEvent>>> = ConcurrentHashMap()

    fun problemTestExecutions(problemId: Long, context: SubscriptionGraphQLContext): Flux<TestExecutionEvent> {
        val testExecutionKey = TestExecutionKey(context.userId, problemId)

        return Flux.create(
            { subscriber: FluxSink<TestExecutionEvent> ->
                subscriptions.compute(testExecutionKey) { _, b ->
                    val concurrentLinkedQueue = b ?: ConcurrentLinkedQueue<FluxSink<TestExecutionEvent>>()
                    subscriber.onDispose {
                        subscriptions.computeIfPresent(testExecutionKey) {_, queue ->
                            queue.remove(subscriber)
                            return@computeIfPresent if (queue.isEmpty()) null else queue
                        }
                    }
                    concurrentLinkedQueue.add(subscriber)
                    concurrentLinkedQueue
                }
            },
            FluxSink.OverflowStrategy.LATEST
        )
    }

    @GraphQLIgnore
    @RabbitListener(queues = ["test-execution-events"])
    fun onTestCaseExecutionResult(result: TestExecutionEvent) {
        subscriptions[TestExecutionKey(result.submitterId, result.problemId)]?.forEach { it.next(result) }
    }
}

data class TestExecutionKey(val userId: Long, val problemId: Long)
