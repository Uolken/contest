package com.uolken.contest.executor.model

import java.nio.file.Path

class BuildResult private constructor(
    val compiledCodePath: Path?,
    val errorStrings: List<String>?
) {

    val isSucceed: Boolean
        get() = compiledCodePath != null

    companion object {
        fun succeed(compiledCodePath: Path) = BuildResult(compiledCodePath, null)
        fun failed(errorStrings: List<String>) = BuildResult(null, errorStrings)
    }
}
