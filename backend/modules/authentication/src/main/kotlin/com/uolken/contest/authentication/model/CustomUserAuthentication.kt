package com.uolken.contest.authentication.model

import com.uolken.contest.authentication.model.dto.UserInfo
import org.springframework.security.core.Authentication

class CustomUserAuthentication(
    private val userInfo: UserInfo,
    private val expired: Boolean,
    private val token: String
) : Authentication {
    override fun getName(): String = userInfo.email

    override fun getAuthorities() = listOf(userInfo.role)

    override fun getCredentials() = token

    override fun getDetails() = null

    override fun getPrincipal() = userInfo

    override fun isAuthenticated() = !expired

    override fun setAuthenticated(isAuthenticated: Boolean) = Unit

}
