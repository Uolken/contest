package com.uolken.contest.gateway.model

import com.expediagroup.graphql.generator.annotations.GraphQLName
import com.uolken.contest.problems.model.dto.TagDto

@GraphQLName("Tag")
class GraphQLTag(private val tag: TagDto) {
    val id: Long get() = tag.id
    val name: String get() = tag.name

}
