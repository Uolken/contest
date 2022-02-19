package com.uolken.contest.gateway

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.cloud.client.discovery.EnableDiscoveryClient
import org.springframework.cloud.client.loadbalancer.LoadBalanced
import org.springframework.context.annotation.Bean
import org.springframework.web.reactive.function.client.WebClient


@SpringBootApplication
@EnableDiscoveryClient
class GatewayServiceApplication {

    @Bean
    @LoadBalanced
    fun loadBalancedWebClientBuilder(): WebClient.Builder  {
        return WebClient.builder()
    }

    @Bean
    fun objectMapper(): ObjectMapper {
        val javaTimeModule = JavaTimeModule()
        return jacksonObjectMapper()
            .registerModule(javaTimeModule)
    }
//
//    @Bean
//    fun corsConfigurer(): WebMvcConfigurer {
//        GraphQLWebAutoConfiguration
//        return object : WebMvcConfigurer {
//            override fun addCorsMappings(registry: CorsRegistry) {
//                registry.addMapping("/graphql").allowedOrigins("http://localhost:3000")
//            }
//        }
//    }
}

fun main(args: Array<String>) {
    runApplication<GatewayServiceApplication>(*args)
}

//
//@Component
//class WidgetMutation : Mutation {
//    fun updateWidget(id: Long, value: String): Boolean = true
//}


//@Component
//class WidgetSubscription : Subscription {
//    fun widgetChanges(id: Long): Flux<Widget> = getPublisherOfUpdates(id)
//}
