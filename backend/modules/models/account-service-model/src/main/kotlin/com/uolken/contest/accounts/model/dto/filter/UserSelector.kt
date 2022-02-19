package com.uolken.contest.accounts.model.dto.filter

import com.uolken.contest.authentication.model.UserRole
import com.uolken.contest.common.PageSelector

class UserSelector(
    val nameOrEmail: String?,
    val roles: List<UserRole>?,
    val course: Int?,
    val groupName: String?,
    val hasNoGroup: Boolean?,
    val excludeIds: List<Long>?,
    override val pageSize: Int,
    override val currentPage: Int,
    override val sortDirIsDesc: Boolean,
    override val sortField: String
): PageSelector

