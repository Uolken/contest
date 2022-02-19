package com.uolken.contest.accounts.model

import com.uolken.contest.accounts.model.dto.GroupDto
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDateTime
import java.time.Month

//inline class Id<T>(val value: Long)

@Table("groups")
data class Group(
    @Id
    val id: Long,
    val name: String,
    val admissionYear: Int
) {
    fun toDto() = GroupDto(id, name)
    companion object {
        fun courseToAdmissionYear(course: Int, now: LocalDateTime): Int =
            now.year - course + if (now.month >= Month.SEPTEMBER) 1 else 0


        fun admissionYearToCourse(year: Int, now: LocalDateTime): Int =
            now.year - year + if (now.month >= Month.SEPTEMBER) 1 else 0
    }
}

