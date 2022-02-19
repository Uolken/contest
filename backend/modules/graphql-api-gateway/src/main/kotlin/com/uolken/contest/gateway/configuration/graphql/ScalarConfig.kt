package com.uolken.contest.gateway.configuration.graphql

import com.expediagroup.graphql.generator.hooks.SchemaGeneratorHooks
import graphql.language.StringValue
import graphql.scalars.ExtendedScalars
import graphql.schema.Coercing
import graphql.schema.CoercingSerializeException
import graphql.schema.GraphQLScalarType
import graphql.schema.GraphQLType
import org.springframework.stereotype.Component
import java.time.Duration
import java.time.LocalDate
import java.time.OffsetDateTime
import java.util.*
import kotlin.reflect.KClass
import kotlin.reflect.KType


@Component
class CustomSchemaGeneratorHooks : SchemaGeneratorHooks {

    private val graphqlUUIDType = GraphQLScalarType.newScalar()
        .name("UUID")
        .description("A type representing a formatted java.util.UUID")
        .coercing(UUIDCoercing)
        .build()

    private val graphqlDurationType = GraphQLScalarType.newScalar()
        .name("DurationInSeconds")
        .coercing(DurationCoercing)
        .build()

    override fun willGenerateGraphQLType(type: KType): GraphQLType? {
        val graphQLType: GraphQLType? = when (type.classifier as? KClass<*>) {
            UUID::class -> graphqlUUIDType
            OffsetDateTime::class -> ExtendedScalars.DateTime
            LocalDate::class -> ExtendedScalars.Date
            Long::class -> ExtendedScalars.GraphQLLong
            Duration::class -> graphqlDurationType
            else -> null
        }

        return graphQLType
    }

}



object UUIDCoercing : Coercing<UUID, String> {
    override fun parseValue(input: Any?): UUID = UUID.fromString(serialize(input))

    override fun parseLiteral(input: Any?): UUID? {
        val uuidString = (input as? StringValue)?.value
        return UUID.fromString(uuidString)
    }

    override fun serialize(dataFetcherResult: Any?): String = dataFetcherResult.toString()
}

object DurationCoercing : Coercing<Duration, Long> {
    override fun parseValue(input: Any?): Duration =
        input.toString().toLongOrNull()?.let { Duration.ofSeconds(it) } ?: throw CoercingSerializeException()

    override fun parseLiteral(input: Any?): Duration =
        input.toString().toLongOrNull()?.let { Duration.ofSeconds(it) } ?: throw CoercingSerializeException()

    override fun serialize(dataFetcherResult: Any): Long = (dataFetcherResult as? Duration)?.seconds ?: throw CoercingSerializeException()
}
