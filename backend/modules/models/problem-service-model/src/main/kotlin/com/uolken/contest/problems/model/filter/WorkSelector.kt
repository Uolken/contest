package com.uolken.contest.problems.model.filter

import com.uolken.contest.problems.model.WorkType
import java.time.LocalDateTime

data class PageSelector(
    val currentPage: Int,
    val pageSize: Int,
    val sortField: String,
    val sortDirIsDesc: Boolean
)

data class WorkSelector(
    val name: String?,
    val workTypes: List<WorkType>?,
    val authorId: Long?,
    val started: Boolean?,
    val ended: Boolean?,
    val excludeIds: List<Long>?
) {
    companion object {
        val defaultSelector = WorkSelector(null, null, null, null, null, null)
    }
}

data class WorkSelectorWithPage(
    val workSelector: WorkSelector = WorkSelector.defaultSelector,
    val pageSelector: PageSelector
)

