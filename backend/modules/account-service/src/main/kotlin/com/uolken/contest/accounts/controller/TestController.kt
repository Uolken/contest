package com.uolken.contest.accounts.controller

import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController


//@RestController
//@RequestMapping("/test")
class TestController {

    @PostMapping
    fun test(
        @RequestBody
        request: Map<String, String>
    ) {
//        val verifier = GoogleIdTokenVerifier.Builder(
//            NetHttpTransport(),
//            GsonFactory.getDefaultInstance()
//        ) // Specify the CLIENT_ID of the app that accesses the backend:
//            .setAudience(listOf("632152896553-59igsa5eo5k9un6rj6vsn6041fc7qtos.apps.googleusercontent.com")) // Or, if multiple clients access the backend:
            //.setAudience(Arrays.asList(CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3))
//            .build()

// (Receive idTokenString by HTTPS POST)

// (Receive idTokenString by HTTPS POST)
//        val idToken: GoogleIdToken = verifier.verify(request["credential"])
//        if (idToken != null) {
//            val payload: IdToken.Payload = idToken.payload
//
//             Print user identifier
//            val userId: String = payload.getSubject()
//            println("User ID: $userId")

            // Use or store profile information
            // ...
//        } else {
//            println("Invalid ID token.")
//        }
    }
}