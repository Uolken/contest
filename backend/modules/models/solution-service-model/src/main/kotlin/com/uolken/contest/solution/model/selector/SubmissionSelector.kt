package com.uolken.contest.solution.model.selector

import com.uolken.contest.common.PageSelector
import com.uolken.contest.common.PageSelectorClass
import com.uolken.contest.solution.model.SubmissionStatus
import java.time.LocalDateTime
import java.time.OffsetDateTime

data class SubmissionSelector(
    val problemIds: List<Long>?,
    val submitterIds: List<Long>?,
    val languages: List<String>?,
    val statuses: List<SubmissionStatus>?,
    val from: OffsetDateTime?,
    val to: OffsetDateTime?
)

data class SubmissionSelectorWithPage(
    val submissionSelector: SubmissionSelector,
    val pageSelector: PageSelectorClass
)

