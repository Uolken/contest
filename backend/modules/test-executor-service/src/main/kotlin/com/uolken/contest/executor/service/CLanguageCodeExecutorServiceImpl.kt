package com.uolken.contest.executor.service

import com.uolken.contest.executor.model.BuildResult
import com.uolken.contest.problems.model.dto.TestCaseDto
import com.uolken.contest.solution.model.SubmissionDto
import com.uolken.contest.solution.model.TestCaseExecutionResult
import com.uolken.contest.solution.model.TestExecutionEvent
import com.uolken.contest.solution.model.TestExecutionEventType.*
import org.springframework.amqp.core.AmqpTemplate
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.toMono
import java.nio.file.FileSystems
import java.nio.file.Files
import java.nio.file.Path
import kotlin.io.path.ExperimentalPathApi
import kotlin.io.path.absolutePathString
import kotlin.io.path.writeText

@Service
class CLanguageCodeExecutorServiceImpl(
    private val rabbitTemplate: AmqpTemplate,
) : CodeExecutorService {

    companion object {

        val DIRECTORY: Path = FileSystems.getDefault().getPath("/tmp/")
        const val TEMP_DIRECTORY_PREFIX: String = "c_lang_executor_"
        const val CODE_FILE_NAME = "solution.c"
        const val COMPILED_CODE_FILE_NAME = "solution"
        const val MEASURING_SCRIPT = "./scripts/script.sh"
    }

    //    private fun buildCommand(directoryName: Path) = "docker run --rm -v $directoryName:/compile c-compiler".split(" ")
    private fun buildCommand(directoryName: Path) =
        "gcc -o $directoryName/$COMPILED_CODE_FILE_NAME $directoryName/$CODE_FILE_NAME"
            .split(" ")

    override fun execute(
        submission: SubmissionDto,
        cases: Flux<TestCaseDto>
    ): Mono<ExecutionResult> {
        rabbitTemplate.convertAndSend(
            "test-execution-events",
            TestExecutionEvent(submission, START_EXECUTION)
        )
        val buildResult = build(submission.code)
        val compiledCode = buildResult.compiledCodePath
            ?: return onCompilationError(submission, buildResult)

        val testCaseResults = cases.map { runTestCase(compiledCode, it) }
            .doOnNext {
                rabbitTemplate.convertAndSend(
                    "test-execution-events",
                    TestExecutionEvent(
                        submission,
                        if(it.isSucceed) TEST_CASE_SUCCEED else TEST_CASE_FAILED
                    )
                )
            }

        return testCaseResults
            .reduce(ExecutionResultAccumulator()) { accumulator, testCaseResult ->
                accumulator.update(testCaseResult)
            }.map { it.toExecutionResult() }
            .doOnNext {
                rabbitTemplate.convertAndSend(
                    "test-execution-events",
                    TestExecutionEvent(submission, if (it.testsPassed) SUBMISSION_PASSED else SUBMISSION_FAILED)
                )
            }

    }

    private fun onCompilationError(
        submission: SubmissionDto,
        buildResult: BuildResult
    ): Mono<ExecutionResult> {
        rabbitTemplate.convertAndSend(
            "test-execution-events",
            TestExecutionEvent(
                submission,
                COMPILATION_FAILED
            )
        )
        return ExecutionResult.failedCompilation(buildResult.errorStrings?.joinToString("\n")).toMono()
    }

    @OptIn(ExperimentalPathApi::class)
    fun build(code: String): BuildResult {
        val start = System.currentTimeMillis()
        val tempDirectory = Files.createTempDirectory(DIRECTORY, TEMP_DIRECTORY_PREFIX)
        val codeFile = tempDirectory.resolve(CODE_FILE_NAME)
        codeFile.writeText(code)
        val process = ProcessBuilder(buildCommand(tempDirectory)).start()
        val errorMessage = process.errorStream.bufferedReader().readLines()
        if(process.waitFor() != 0) {
            return BuildResult.failed(errorMessage)
        }
        println("Build time: ${System.currentTimeMillis() - start}")
        val buildResult = tempDirectory.resolve(COMPILED_CODE_FILE_NAME)
        return BuildResult.succeed(buildResult)
    }

    @OptIn(ExperimentalPathApi::class)
    fun runTestCase(compiledCode: Path, testCase: TestCaseDto): TestCaseExecutionResult {
        val start = System.currentTimeMillis()
        val command =
            // "firejail --noprofile --rlimit-as=200000000 --rlimit-cpu=50 /bin/bash /home/maxim/Edu/sstu/contest/backend/scripts/script.sh ${compiledCode.absolutePathString()}"
            "firejail --noprofile --whitelist=${compiledCode.absolutePathString()} --quiet --rlimit-as=200000000 --rlimit-cpu=50 /bin/bash $MEASURING_SCRIPT ${compiledCode.absolutePathString()}"
        val process = ProcessBuilder(command.split(" ")).start()

        val bufferedWriter = process.outputStream.bufferedWriter()
        bufferedWriter.write(testCase.input)
        bufferedWriter.flush()
        val output = process.inputStream.bufferedReader().readLines().joinToString("\n")

        val error = process.errorStream.bufferedReader().readLines().joinToString("\n")

        val measurements = error.split("\n")
        val timePrefix = "time(ms): "
        val memoryPrefix = "\tMaximum resident set size (kbytes): "
        val executionTime = measurements.find { it.startsWith(timePrefix) }?.substringAfter(timePrefix)?.toLong()
        val memoryUsage = measurements.find { it.startsWith(memoryPrefix) }?.substringAfter(memoryPrefix)?.toLong()
        println("Execution time: ${System.currentTimeMillis() - start}")
        return TestCaseExecutionResult(testCase, output, memoryUsage, executionTime)
    }
}
