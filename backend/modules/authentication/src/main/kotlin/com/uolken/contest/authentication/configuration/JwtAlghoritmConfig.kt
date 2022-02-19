package com.uolken.contest.authentication.configuration

import com.auth0.jwt.algorithms.Algorithm
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class JwtAlgorithmConfig {
    @Bean
    fun jwtAlgorithm(@Value("\${jwt.secret}") secret: String): Algorithm = Algorithm.HMAC512(secret)
}
