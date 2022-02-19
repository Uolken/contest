package com.uolken.contest.authentication.model

import org.springframework.security.core.GrantedAuthority

enum class UserRole : GrantedAuthority {
    ADMIN, STUDENT, TEACHER, GUEST;

    // it's needed as compile time constants to use in annotations
    companion object Constants {
        const val CONST_ADMIN = "ROLE_ADMIN"
        const val CONST_STUDENT = "ROLE_STUDENT"
        const val CONST_TEACHER = "ROLE_TEACHER"
        const val CONST_GUEST = "ROLE_GUEST"
    }

    override fun getAuthority(): String {
        return "ROLE_${this.name}"
    }
}
