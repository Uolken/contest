package com.uolken.contest.problems.model

import com.uolken.contest.problems.model.dto.WorkDto
import io.r2dbc.spi.Row
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import java.time.LocalDateTime
import java.util.*

data class Work(
    @Id val id: Long,
    val name: String,
    val type: WorkType,
    val start: LocalDateTime?,
    @Column("end_")
    val end: LocalDateTime?,
    val authorId: Long
) {
    fun toDto() = WorkDto(id, name, type, start, end, authorId)

    companion object {
        fun fromRow(row: Row) = Work(
            row.get("id") as Long,
            row.get("name") as String,
            WorkType.valueOf(row.get("type") as String),
            row.get("start") as? LocalDateTime,
            row.get("end_") as? LocalDateTime,
            row.get("author_id") as Long
        )
    }
}
