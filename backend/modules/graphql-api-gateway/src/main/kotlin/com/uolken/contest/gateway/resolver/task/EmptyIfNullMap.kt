package com.uolken.contest.gateway.resolver.task

class EmptyIfNullMap<K, C>(private val map: Map<K, List<C>>): Map<K, List<C>> by map {
    override fun get(key: K) = map.getOrDefault(key, emptyList())
}
class DefaultIfNullMap<K, V>(private val map: Map<K, V>, private val default:V): Map<K, V> by map {
    override fun get(key: K) = map.getOrDefault(key, default)
}
