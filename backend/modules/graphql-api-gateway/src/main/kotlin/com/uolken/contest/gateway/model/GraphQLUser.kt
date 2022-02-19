package com.uolken.contest.gateway.model

import com.expediagroup.graphql.generator.annotations.GraphQLName
import com.expediagroup.graphql.server.extensions.getValueFromDataLoader
import com.uolken.contest.accounts.model.dto.UserDto
import com.uolken.contest.authentication.model.UserRole
import com.uolken.contest.gateway.loader.DataLoaders
import graphql.schema.DataFetchingEnvironment
import java.util.concurrent.CompletableFuture

@GraphQLName("User")
class GraphQLUser(private val user: UserDto) {

    val id: Long get() = user.id
    val email: String get() = user.email
    val role: UserRole get() = user.role
    val firstName: String get() = user.firstName
    val lastName: String get() = user.lastName

    fun group(environment: DataFetchingEnvironment): CompletableFuture<GraphQLGroup?> =
        user.groupId?.let { environment.getValueFromDataLoader(DataLoaders.groupDataLoader, user.groupId) }
            ?: CompletableFuture.completedFuture(null)
}
