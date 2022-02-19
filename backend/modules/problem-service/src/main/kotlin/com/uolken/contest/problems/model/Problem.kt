package com.uolken.contest.problems.model

import com.uolken.contest.common.OpenDataClass
import io.r2dbc.postgresql.codec.Json
import io.r2dbc.spi.Row
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.data.annotation.Id

@OpenDataClass
// @SpringBootApplication
data class Problem(
    @Id val id: Long,
    val name: String,
    val text: String,
    val authorId: Long,
    val examples: Json,
    val inLibrary: Boolean
) {

    // fun copy(
    //     id: Long? = null,
    //     name: String? = null,
    //     text: String? = null,
    //     authorId: Long? = null,
    //     examples: Json? = null,
    //     inLibrary: Boolean? = null,
    // ) = Problem(
    //     id ?: this.id,
    //     name ?: this.name,
    //     text ?: this.text,
    //     authorId ?: this.authorId,
    //     examples ?: this.examples,
    //     inLibrary ?: this.inLibrary
    // )

    companion object {

        fun fromRow(row: Row) = Problem(
            row["id"] as Long,
            row["name"] as String,
            row["text"] as String,
            row["author_id"] as Long,
            row["examples"] as Json,
            row["in_library"] as Boolean,
        )
    }
}


