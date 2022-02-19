package com.uolken.contest.problems.config

import com.uolken.contest.authentication.JwtAuthentication
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Import
import org.springframework.security.config.web.server.SecurityWebFiltersOrder
import org.springframework.security.config.web.server.ServerHttpSecurity
import org.springframework.security.web.server.SecurityWebFilterChain
import org.springframework.security.web.server.authentication.AuthenticationWebFilter

@Configuration
@Import(JwtAuthentication::class)
class WebSecurityConfig {

    @Bean
    fun securityWebFilterChain(
        authenticationWebFilter: AuthenticationWebFilter,
        serverHttpSecurity: ServerHttpSecurity
    ): SecurityWebFilterChain {
        return serverHttpSecurity
            .addFilterAt(authenticationWebFilter, SecurityWebFiltersOrder.AUTHENTICATION)
            .authorizeExchange()
            .anyExchange()
            .permitAll()
//            .authenticated()
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
