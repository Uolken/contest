package com.uolken.contest.accounts.csec

import org.springframework.http.codec.multipart.FilePart
import org.springframework.stereotype.Component
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile
import reactor.core.publisher.Mono
import reactor.netty.http.server.HttpServerRequest
import java.util.*
import javax.crypto.Cipher
import javax.crypto.spec.IvParameterSpec
import javax.crypto.spec.SecretKeySpec
import kotlin.system.measureNanoTime

data class BenchmarkResult(val algorithm: String, val method: String, val encryptTime: Long, val decryptTime: Long)

@RestController
class Lab2Controller(
    private val benchmarkExecutor: BenchmarkExecutor
) {

    @PostMapping("/csec/lab2")
    fun runBenchmark( params: Map<String, Any?>): Mono<Unit> {

        val k = 4
        TODO()
        // return file.map { println(it.filename())}
    }
}


@Component
class BenchmarkExecutor {

    fun execute(data: ByteArray): List<BenchmarkResult> {
        return algorithms.flatMap { a -> modes.map { m -> a to m } }
            .mapNotNull { (algorithm, method) ->
            try {
                val cipher = Cipher.getInstance("$algorithm/$method/NoPadding")
                val key = generateKey(algorithm)
                cipher.init(
                    Cipher.ENCRYPT_MODE,
                    key,
                    getIvParameterSpec(algorithm, method)
                )
                var encryptedFile: ByteArray
                val encryptTime = measureNanoTime {
                    encryptedFile = cipher.doFinal(data)
                }
                println("$algorithm $method: $encryptTime")
                cipher.init(
                    Cipher.DECRYPT_MODE,
                    key,
                    getIvParameterSpec(algorithm, method)
                )
                var decryptedFile: ByteArray
                val decryptTime = measureNanoTime {
                    decryptedFile = cipher.doFinal(encryptedFile)
                }
                BenchmarkResult(algorithm, method, encryptTime, decryptTime)
            } catch(e: Exception) {
                null
            }
        }
    }

    fun generateKey(algorithm: String): SecretKeySpec {
        val keySize=  when (algorithm) {
            "AES" -> 16
            else -> 8
        }
        return SecretKeySpec(UUID.randomUUID().toString().toByteArray().sliceArray(0 until keySize), algorithm)
    }

    fun getIvParameterSpec(algorithm: String, method: String): IvParameterSpec? {
        if(!ivParameterSpecNeed.contains(method)) return null
        val size =  when (algorithm) {
            "AES" -> 16
            "DES" -> 8
            "RC2" -> 8
            "RC4" -> 8
            else -> 16
        }
        return IvParameterSpec(
            ByteArray(size)
        )
    }



    companion object {

        val algorithms = listOf(
            "AES",
            "DES",
            "RC2",
            "RC4",
            "RC5",
            "RSA",
        )
        val modes = listOf(
            "ECB",
            "CBC",
            "CFB",
            "OFB",
            "CTR",
            "CTS",
        )
        val ivParameterSpecNeed = listOf(
            "CBC",
            "CFB",
            "OFB",
            "CTR",
            "CTS",
        )
    }
}

