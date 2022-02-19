package com.uolken.contest.gateway.model

import com.expediagroup.graphql.generator.annotations.GraphQLName
import com.expediagroup.graphql.server.extensions.getValueFromDataLoader
import com.uolken.contest.gateway.loader.DataLoaders
import com.uolken.contest.problems.model.WorkType
import com.uolken.contest.problems.model.dto.WorkGroupAssignmentDto
import graphql.schema.DataFetchingEnvironment
import java.time.LocalDateTime
import java.time.OffsetDateTime
import java.time.ZoneOffset
import java.util.concurrent.CompletableFuture

@GraphQLName("WorkGroupAssignment")
class GraphQLWorkGroupAssignment(private val workGroupAssignmentDto: WorkGroupAssignmentDto) {
    val start: OffsetDateTime? get() = workGroupAssignmentDto.start?.atOffset(ZoneOffset.UTC)
    val end: OffsetDateTime? get() = workGroupAssignmentDto.end?.atOffset(ZoneOffset.UTC)
    val type: WorkType get() = workGroupAssignmentDto.type

    fun work(environment: DataFetchingEnvironment): CompletableFuture<GraphQLWork> {
        return environment.getValueFromDataLoader(DataLoaders.workDataLoader, workGroupAssignmentDto.workId)
    }

    fun group(environment: DataFetchingEnvironment): CompletableFuture<GraphQLGroup> {
        return environment.getValueFromDataLoader(DataLoaders.groupDataLoader, workGroupAssignmentDto.groupId)
    }
}
