package com.uolken.contest.gateway.loader

import com.expediagroup.graphql.server.execution.KotlinDataLoader
import com.uolken.contest.gateway.configuration.graphql.RedirectableGraphQLContext
import org.dataloader.DataLoader
import java.util.concurrent.CompletableFuture

class GenericDataLoader<S, K, V>(
    override val dataLoaderName: String,
    val service: S,
    val operation: S.(Set<K>, RedirectableGraphQLContext) -> CompletableFuture<Map<K, V>>
) : KotlinDataLoader<K, V> {

    override fun getDataLoader(): DataLoader<K, V> {
        return DataLoader.newMappedDataLoader { ids, env ->
            val context = env.keyContextsList.find { it is RedirectableGraphQLContext } ?: throw Exception()
            service.operation(ids, context as RedirectableGraphQLContext)
        }
    }
}
