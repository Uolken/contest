package com.uolken.contest.accounts.model

import com.uolken.contest.accounts.model.dto.UserDto
import com.uolken.contest.authentication.model.UserRole
import com.uolken.contest.authentication.model.dto.UserInfo
import io.r2dbc.spi.Row
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table

@Table("users")
data class User(
    @Id
    val id: Long,
    val email: String,
    val firstName: String,
    val lastName: String,
    val role: UserRole,
    val groupId: Long?,
    private val password: String
) {
    val encryptedPassword: String
        get() = password

    fun toDto() = UserDto(id, email, firstName, lastName, role, groupId)
    fun toUserInfo() = UserInfo(id, email, role, groupId)

    companion object {
        fun fromRow(row: Row) = User(
            row["id"] as Long,
            row["email"] as String,
            row["first_name"] as String,
            row["last_name"] as String,
            UserRole.valueOf(row["role"] as String),
            row["group_id"] as? Long,
            ""
        )
    }
}

