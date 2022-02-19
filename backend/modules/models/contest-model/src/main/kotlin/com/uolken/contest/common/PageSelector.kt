package com.uolken.contest.common

interface PageSelector {
    val pageSize: Int
    val currentPage: Int
    val sortDirIsDesc: Boolean
    val sortField: String
}


data class PageSelectorClass(
    val pageSize: Int,
    val currentPage: Int,
    val sortDirIsDesc: Boolean,
    val sortField: String
)
