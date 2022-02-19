package com.uolken.contest.executor

import com.fasterxml.jackson.databind.ObjectMapper
import com.uolken.contest.problems.model.dto.TestCaseDto
import com.uolken.contest.solution.model.SubmissionDto
import org.springframework.amqp.core.*
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.amqp.rabbit.connection.ConnectionFactory
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter
import org.springframework.amqp.support.converter.MessageConverter
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController


@SpringBootApplication
class TestExecutorService

fun main(args: Array<String>) {
    runApplication<TestExecutorService>(*args)
}


@Configuration
class RabbitMQConfig {

    @Bean
    fun queue(): Queue {
        return Queue("solution-test", false)
    }

}
