package com.uolken.contest.problems.model.filter

data class ProblemSelectorWithPage(
    val pageSelector: PageSelector,
    val problemSelector: ProblemSelector
)

data class ProblemSelector(
    val name: String?,
    val authorId: Long?,
    val tagIds: List<Long>?,
    val inLibrary: Boolean?,
    val excludeIds: List<Long>?
)
