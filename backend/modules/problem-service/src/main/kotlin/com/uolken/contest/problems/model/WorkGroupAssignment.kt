package com.uolken.contest.problems.model

import com.uolken.contest.problems.model.dto.WorkGroupAssignmentDto
import io.r2dbc.spi.Row
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import java.time.LocalDateTime

data class WorkGroupAssignment(
    val workId: Long,
    val groupId: Long,
    val type: WorkType,
    val start: LocalDateTime?,
    @Column("end_")
    val end: LocalDateTime?,
) {
    fun toDto() = WorkGroupAssignmentDto(workId, groupId, type, start, end)

    companion object {
        fun fromRow(row: Row) :WorkGroupAssignment = WorkGroupAssignment(
            row.get("work_id") as Long,
            row.get("group_id") as Long,
            WorkType.valueOf(row.get("type") as String),
            row.get("start") as LocalDateTime?,
            row.get("end_") as LocalDateTime?
        )
    }
}


