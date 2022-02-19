package com.uolken.contest.accounts.controller

import com.uolken.contest.accounts.exception.InvalidCredentialsException
import com.uolken.contest.accounts.model.Session
import com.uolken.contest.accounts.model.dto.request.SignInRequest
import com.uolken.contest.accounts.model.dto.request.SignUpRequest
import com.uolken.contest.accounts.model.dto.response.SessionResponse
import com.uolken.contest.accounts.service.JwtGeneratorService
import com.uolken.contest.accounts.service.SessionService
import com.uolken.contest.accounts.service.UserService
import com.uolken.contest.authentication.model.TokenInfo
import com.uolken.contest.authentication.model.dto.UserInfo
import org.springframework.http.ResponseCookie
import org.springframework.http.server.reactive.ServerHttpRequest
import org.springframework.http.server.reactive.ServerHttpResponse
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.switchIfEmpty

@RestController
@RequestMapping("/auth")
class AuthenticationController(
    private val userService: UserService,
    private val jwtGeneratorService: JwtGeneratorService,
    private val sessionService: SessionService
) {

    @PostMapping("/sign-up")
    fun signUp(
        @RequestBody signUpRequest: SignUpRequest,
        response: ServerHttpResponse,
        request: ServerHttpRequest
    ): Mono<SessionResponse> {
        TODO()
        // return userService.createStudent(
        //     signUpRequest.email,
        //     signUpRequest.firstName,
        //     signUpRequest.lastName,
        //     signUpRequest.password
        // )
        //     .map { it.toUserInfo() }
        //     .flatMap { authorize(it, request, response) }
    }

    @PostMapping("/sign-in")
    fun signIn(
        @RequestBody signInRequest: SignInRequest,
        response: ServerHttpResponse,
        request: ServerHttpRequest
    ): Mono<SessionResponse> {
        return userService.getUserByEmailWithPassword(signInRequest.email, signInRequest.password)
            .map { it.toUserInfo() }
            .flatMap { authorize(it, request, response) }
            .switchIfEmpty { Mono.error(InvalidCredentialsException(signInRequest.email)) }
    }

    @GetMapping("/who-am-i")
    fun whoAmI(
        @AuthenticationPrincipal userInfo: UserInfo?
    ): Mono<UserInfo> {
        return Mono.justOrEmpty(userInfo)
    }

    @PostMapping("/refresh")
    fun refresh(
        @CookieValue("refresh-token") refreshToken: String,
        response: ServerHttpResponse
    ): Mono<SessionResponse> {
        return sessionService.getSessionByRefreshTokenAndExtendSession(refreshToken)
            .map { session ->
                setRefreshToken(session, response)
                val jwtTokenInfo = createAndSetJwtToken(session.userInfo, response)
                SessionResponse(session.userInfo, jwtTokenInfo.expirationPeriod, session.expirationPeriod)
            }
    }

    @PostMapping("/sign-out")
    fun logout(
        @CookieValue("refresh-token", required = false) refreshToken: String?,
        response: ServerHttpResponse
    ) {
        refreshToken?.let { sessionService.deleteSession(it) }
        response.cookies.remove("token")
        response.cookies.remove("refresh-token")
    }

    private fun authorize(
        userInfo: UserInfo,
        request: ServerHttpRequest,
        response: ServerHttpResponse
    ): Mono<SessionResponse> {
        val jwtTokenInfo = createAndSetJwtToken(userInfo, response)

        return sessionService.createSession(userInfo, request)
            .doOnNext { setRefreshToken(it, response) }
            .map { SessionResponse(userInfo, jwtTokenInfo.expirationPeriod, it.expirationPeriod) }
    }

    private fun createAndSetJwtToken(
        userInfo: UserInfo,
        response: ServerHttpResponse
    ): TokenInfo {
        val jwtTokenInfo = jwtGeneratorService.getToken(userInfo)
        setJwtToken(jwtTokenInfo, response)
        return jwtTokenInfo
    }

    private fun setRefreshToken(session: Session, response: ServerHttpResponse) {
        response.addCookie(
            ResponseCookie.from("refresh-token", session.refreshToken)
                .maxAge(session.expirationPeriod)
                .httpOnly(true)
                .build()
        )
    }

    private fun setJwtToken(tokenInfo: TokenInfo, response: ServerHttpResponse) {
        response.addCookie(
            ResponseCookie.from("token", tokenInfo.token)
                .maxAge(tokenInfo.expirationPeriod)
                .httpOnly(true)
                .build()
        )
    }

}
