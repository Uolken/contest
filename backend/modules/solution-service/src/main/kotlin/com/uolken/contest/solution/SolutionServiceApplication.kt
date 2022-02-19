package com.uolken.contest.solution

import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.CommandLineRunner
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.cloud.client.discovery.EnableDiscoveryClient

@SpringBootApplication
@EnableDiscoveryClient
class SolutionServiceApplication

fun main(args: Array<String>) {
    runApplication<SolutionServiceApplication>(*args)
}
