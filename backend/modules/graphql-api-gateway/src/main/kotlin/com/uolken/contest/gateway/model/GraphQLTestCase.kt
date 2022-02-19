package com.uolken.contest.gateway.model

import com.expediagroup.graphql.generator.annotations.GraphQLName
import com.uolken.contest.problems.model.dto.TestCaseDto

@GraphQLName("TestCase")
data class GraphQLTestCase(private val testCase: TestCaseDto) {
    val id: Long get() = testCase.id
    val input: String get() = testCase.input
    val outputs: List<String> get() = testCase.outputs
}
