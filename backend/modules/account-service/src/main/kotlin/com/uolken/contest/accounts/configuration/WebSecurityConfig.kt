package com.uolken.contest.accounts.configuration

import com.uolken.contest.authentication.JwtAuthentication
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Import
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity
import org.springframework.security.config.web.server.SecurityWebFiltersOrder
import org.springframework.security.config.web.server.ServerHttpSecurity
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.server.SecurityWebFilterChain

import org.springframework.security.web.server.authentication.AuthenticationWebFilter


@EnableWebFluxSecurity
@EnableReactiveMethodSecurity
@Import(JwtAuthentication::class)
class WebSecurityConfig {

    @Bean
    fun encoder(): PasswordEncoder {
        return BCryptPasswordEncoder()
    }

    @Bean
    fun securityWebFilterChain(
        authenticationWebFilter: AuthenticationWebFilter,
        serverHttpSecurity: ServerHttpSecurity
    ): SecurityWebFilterChain {
        return serverHttpSecurity
            .addFilterAt(authenticationWebFilter, SecurityWebFiltersOrder.AUTHENTICATION)
            .authorizeExchange()
            .pathMatchers(
                "/auth/who-am-i",
                "/auth/sign-in",
                "/auth/sign-up",
                "/auth/refresh",
                "/users",
                "/auth/sign-out",
                "/csec/lab2"
            )
            .permitAll()
            .anyExchange()
            .authenticated()
            .and()
            .disableAll()
            .build()
    }
}

private fun ServerHttpSecurity.disableAll(): ServerHttpSecurity {
    return this.cors().disable()
        .csrf().disable()
        .httpBasic().disable()
        .formLogin().disable()
        .logout().disable()
}
