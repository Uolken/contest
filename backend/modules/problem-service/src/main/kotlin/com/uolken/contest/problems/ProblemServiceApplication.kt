package com.uolken.contest.problems

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.security.reactive.ReactiveUserDetailsServiceAutoConfiguration
import org.springframework.boot.runApplication
import org.springframework.cloud.client.discovery.EnableDiscoveryClient


@SpringBootApplication(exclude = [ReactiveUserDetailsServiceAutoConfiguration::class])
@EnableDiscoveryClient
class ProblemServiceApplication

fun main(args: Array<String>) {
    runApplication<ProblemServiceApplication>(*args)
}
