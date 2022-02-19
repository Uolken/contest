package com.uolken.contest.accounts.model.dto.request

data class UpdateGroupRequest(
    val id: Long?,
    val name: String,
    val studentIds: List<Long>
)
