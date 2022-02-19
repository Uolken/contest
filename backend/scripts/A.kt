import java.util.concurrent.TimeUnit

fun main() {
    val results = ArrayList<TaskInfo>()

    for (i in 1..1000) {
        val process = ProcessBuilder("/usr/bin/time", "-v", "code/out2").start()
        val bufferedWriter = process.outputStream.bufferedWriter()
//        bufferedWriter.write("2\n0 1 1\n1 1 0\n")
//        bufferedWriter.flush()
//        process.inputStream.bufferedReader().readLines().forEach { println(it) }
        process.waitFor(5, TimeUnit.SECONDS)
        process.destroy()
        val output = process.errorStream.bufferedReader().readLines().toTaskInfo()
        results.add(output)
        println(output)
    }

    println("Max time: " + results.maxOf { it.systemTime })
    println("Min time: " + results.minOf { it.systemTime })
    println("Max mem: " + results.maxOf { it.maxDataSize })
    println("Min mem: " + results.minOf { it.maxDataSize })

}

private fun List<String>.toTaskInfo(): TaskInfo {
    return TaskInfo(
        userTime = this[1].substringAfterLast(' ').toDouble(),
        systemTime = this[2].substringAfterLast(' ').toDouble(),
        cpuUsage = this[3].substringAfterLast(' ').substringBefore('%').toByteOrNull(),
        elapsedTime = this[4].substringAfterLast(' '),
        maxDataSize = this[9].substringAfterLast(' ').toLong(),
    )
}


data class TaskInfo(
    val userTime: Double,
    val systemTime: Double,
    val cpuUsage: Byte?,
    val elapsedTime: String,
    val maxDataSize: Long,
)

class B() {

}
