package com.uolken.contest.common

fun <T : Comparable<T>> maxOfNullable(a: T?, b: T?): T? {
    if (a == null) return b
    if (b == null) return a
    return if (a > b) a else b
}



