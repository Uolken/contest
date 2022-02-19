package com.uolken.contest.solution.model

import java.util.*

data class SolutionId(val problemId: Long, val submitterId: Long)


data class SolutionInfo(
    val submitterId: Long,
    val problemId: Long,
    val tryCount: Int,
    val status: SolutionStatus
)

