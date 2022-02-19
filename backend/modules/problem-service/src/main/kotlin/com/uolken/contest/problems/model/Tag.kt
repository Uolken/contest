package com.uolken.contest.problems.model

import com.uolken.contest.problems.model.dto.TagDto
import org.springframework.data.annotation.Id

open class Tag(
    @Id val id: Long,
    val name: String
) {
    fun toDto() = TagDto(id, name)
}
