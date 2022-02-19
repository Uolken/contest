package com.uolken.contest.accounts.configuration

import com.fasterxml.jackson.databind.*
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration


@Configuration
class ObjectMapperConfig {
    @Bean
    fun objectMapper(): ObjectMapper {
//
//        val javaTimeModule = JavaTimeModule()
//        DurationSerializer
//        javaTimeModule.addSerializer(DurationStyle.ISO8601)
//        object: StdSerializer<Duration>(Duration::class.java) {
//            override fun serialize(value: Duration, gen: JsonGenerator?, provider: SerializerProvider?) {
//                DurationStyle.ISO8601.print(value)
//            }
//        }
//
//        jacksonObjectMapper()
//
//
//        DurationSerializer.INSTANCE
        val javaTimeModule = JavaTimeModule()

//        javaTimeModule.addSerializer(Duration::class.java, object : JsonSerializer<Duration>() {
//            override fun serialize(value: Duration, gen: JsonGenerator, serializers: SerializerProvider) {
//                gen.writeString(DurationStyle.ISO8601.print(value))
//            }
//        })

        return jacksonObjectMapper()
            .registerModule(javaTimeModule)
    }


}

//fun main() {
//    DurationStyle.ISO8601.parse()
//}