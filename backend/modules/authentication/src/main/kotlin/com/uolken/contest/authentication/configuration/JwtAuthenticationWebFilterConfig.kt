package com.uolken.contest.authentication.configuration

import com.uolken.contest.authentication.service.JwtDecoderService
import org.springframework.context.annotation.Bean
import org.springframework.security.authentication.ReactiveAuthenticationManager
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity
import org.springframework.security.web.server.authentication.AuthenticationWebFilter
import org.springframework.security.web.server.authentication.ServerAuthenticationConverter
import org.springframework.security.web.server.context.NoOpServerSecurityContextRepository
import reactor.core.publisher.Mono


@EnableWebFluxSecurity
@EnableReactiveMethodSecurity
class JwtAuthenticationWebFilterConfig {

    @Bean
    fun jwtServerAuthenticationConverter(jwtDecoderService: JwtDecoderService): ServerAuthenticationConverter {
        return ServerAuthenticationConverter { exchange ->
            val token = exchange.request.cookies["token"]?.first()?.value
            Mono.justOrEmpty(jwtDecoderService.decode(token))
        }
    }

    @Bean
    fun authenticationWebFilter(
        jwtServerAuthenticationConverter: ServerAuthenticationConverter,
    ): AuthenticationWebFilter {

        val authenticationWebFilter = AuthenticationWebFilter(ReactiveAuthenticationManager { Mono.just(it) })
        authenticationWebFilter.setServerAuthenticationConverter(jwtServerAuthenticationConverter)

        authenticationWebFilter.setSecurityContextRepository(NoOpServerSecurityContextRepository.getInstance())
//        authenticationWebFilter.setRequiresAuthenticationMatcher(ServerWebExchangeMatchers.pathMatchers(HttpMethod.POST, "/login"))
//        authenticationWebFilter.setAuthenticationFailureHandler(responseError())
        return authenticationWebFilter
    }

}
