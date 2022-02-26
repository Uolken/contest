package com.uolken.contest.accounts.service

import com.uolken.contest.accounts.exception.WrongPasswordException
import com.uolken.contest.accounts.model.Group
import com.uolken.contest.accounts.model.User
import com.uolken.contest.accounts.model.dto.filter.UserSelector
import com.uolken.contest.accounts.model.dto.request.CreateUserRequest
import com.uolken.contest.accounts.model.dto.request.ResetPasswordRequest
import com.uolken.contest.accounts.repository.UserRepository
import com.uolken.contest.authentication.model.UserRole
import org.springframework.r2dbc.core.DatabaseClient
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.time.Clock
import java.time.LocalDateTime

interface UserService {

    fun getUser(id: Long): Mono<User>
    fun getUserByEmailWithPassword(email: String, password: String): Mono<User>
    fun getUsers(): Flux<User>
    fun getUsers(ids: Iterable<Long>): Flux<User>
    fun getUsers(userSelector: UserSelector): Flux<User>
    fun getByGroupId(groupId: Long): Flux<User>
    fun getUserCount(userSelector: UserSelector): Mono<Long>
    fun save(createUserRequest: CreateUserRequest): Mono<User>
    fun addStudentsToGroup(groupId: Long, studentIds: List<Long>): Mono<Long>
    fun removeStudentsFromGroup(groupId: Long, excludeStudentIds: List<Long>): Mono<Long>
    fun resetPassword(email: String, resetPasswordRequest: ResetPasswordRequest): Mono<User>
    fun createStudent(email: String, firstName: String, lastName: String, password: String): Mono<User>

}

@Service
class UserServiceImpl(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val databaseClient: DatabaseClient,
    private val clock: Clock,
) : UserService {

    override fun getUser(id: Long): Mono<User> {
        return userRepository.findById(id)
    }

    override fun getUserByEmailWithPassword(email: String, password: String): Mono<User> {
        return userRepository.findByEmail(email)
            .filter { passwordEncoder.matches(password, it.encryptedPassword) }
    }

    override fun getUsers(): Flux<User> {
        return userRepository.findAll()
    }

    override fun getUsers(ids: Iterable<Long>): Flux<User> {
        return userRepository.findAllById(ids)
    }

    override fun getUsers(userSelector: UserSelector): Flux<User> {
        val query = StringBuilder("SELECT u.* FROM users u LEFT JOIN groups g ON u.group_id=g.id WHERE 1=1 ")
        val params = HashMap<String, String>()
        userSelector.nameOrEmail
            ?.let {
                query.append(
                    "AND (LOWER(u.email) LIKE :nameOrEmail " +
                        "OR LOWER(u.first_name) LIKE :nameOrEmail " +
                        "OR LOWER(u.last_name) LIKE :nameOrEmail) "
                )
                params.put("nameOrEmail", "%${it.toLowerCase()}%")

            }
        userSelector.roles
            ?.let { if(it.isNotEmpty()) query.append("AND u.role IN (${it.joinToString(",") {"\'$it\'"}}) ") }

        userSelector.course
            ?.let { query.append("AND g.year=${Group.courseToAdmissionYear(it, LocalDateTime.now(clock))} ") }

        userSelector.groupName
            ?.let {
                query.append("AND LOWER(g.name) LIKE :groupName ")
                params.put("groupName", "%${it.toLowerCase()}%")
            }

        userSelector.hasNoGroup
            ?.let {
                if (it) {
                    query.append("AND g.id is NULL ")
                }
            }

        userSelector.excludeIds
            ?.let { if (it.isNotEmpty()) query.append("AND u.id NOT IN (${it.joinToString() {it.toString()}})") }

        val pageSize = if(userSelector.pageSize > MAX_PAGE_SIZE) MAX_PAGE_SIZE else userSelector.pageSize
        val offset = pageSize * userSelector.currentPage
        val sortField = verifySortColumnOrDefault(userSelector.sortField)
        val order = if(userSelector.sortDirIsDesc) "DESC" else "ASC"
        query.append("ORDER BY $sortField $order OFFSET $offset LIMIT $pageSize")

        return databaseClient.sql(query.toString())
            .let { spec -> params.asSequence().fold(spec) { s, (k, v) -> s.bind(k, v) } }
            .map { row -> User.fromRow(row) }
            .all()
    }

    private fun verifySortColumnOrDefault(sortField: String): String {
        return sortFieldMapper.getOrDefault(sortField, "last_name")
    }

    override fun getByGroupId(groupId: Long): Flux<User> {
        return userRepository.findByGroupId(groupId)
    }

    override fun getUserCount(userSelector: UserSelector): Mono<Long> {
        val query = StringBuilder("SELECT count(u.*) FROM users u LEFT JOIN groups g ON u.group_id=g.id WHERE 1=1 ")
        val params = HashMap<String, String>()
        userSelector.nameOrEmail
            ?.let {
                query.append(
                    "AND (LOWER(u.email) LIKE :nameOrEmail " +
                        "OR LOWER(u.first_name) LIKE :nameOrEmail " +
                        "OR LOWER(u.last_name) LIKE :nameOrEmail) "
                )
                params.put("nameOrEmail", "%${it.toLowerCase()}%")

            }
        userSelector.roles
            ?.let { if(it.isNotEmpty()) query.append("AND u.role IN (${it.joinToString(",") {"\'$it\'"}}) ") }

        userSelector.course
            ?.let { query.append("AND g.year=${Group.courseToAdmissionYear(it, LocalDateTime.now(clock))} ") }

        userSelector.groupName
            ?.let {
                query.append("AND LOWER(g.name) LIKE :groupName ")
                params.put("groupName", "%${it.toLowerCase()}%")
            }

        userSelector.hasNoGroup
            ?.let {
                if (it) {
                    query.append("AND g.id is NULL ")
                }
            }

        userSelector.excludeIds
            ?.let { if (it.isNotEmpty()) query.append("AND u.id NOT IN (${it.joinToString() {it.toString()}})") }

        return databaseClient.sql(query.toString())
            .let { spec -> params.asSequence().fold(spec) { s, (k, v) -> s.bind(k, v) } }
            .map { row -> row.get(0) as Long }
            .first()
    }

    override fun save(createUserRequest: CreateUserRequest): Mono<User> {
        return userRepository.save(
            User(
                0,
                createUserRequest.email,
                createUserRequest.firstName,
                createUserRequest.lastName,
                createUserRequest.role,
                createUserRequest.groupId,
                passwordEncoder.encode(createUserRequest.email)
            )
        )
    }

    override fun createStudent(email: String, firstName: String, lastName: String, password: String): Mono<User> {
        return userRepository.save(
            User(
                0,
                email,
                firstName,
                lastName,
                UserRole.STUDENT,
                null,
                passwordEncoder.encode(password)
            )
        )
    }

    override fun addStudentsToGroup(groupId: Long, studentIds: List<Long>): Mono<Long> {
        return if (studentIds.isNotEmpty()) userRepository.setGroupIdForUsers(groupId, studentIds)
        else Mono.just(0)
    }

    override fun removeStudentsFromGroup(groupId: Long, excludeStudentIds: List<Long>): Mono<Long> {
        return if (excludeStudentIds.isEmpty()) userRepository.setGroupIdNull(groupId)
        else userRepository.setGroupIdNull(groupId, excludeStudentIds)
    }

    override fun resetPassword(email: String, resetPasswordRequest: ResetPasswordRequest): Mono<User> {
        return userRepository.findByEmail(email).doOnNext { user ->
            if (!passwordEncoder.matches(resetPasswordRequest.password, user.encryptedPassword)) {
                throw WrongPasswordException(user.email)
            }
            userRepository.setPassword(email, passwordEncoder.encode(resetPasswordRequest.newPassword)).subscribe()
        }
    }

    companion object {
        const val MAX_PAGE_SIZE = 100
        val sortFieldMapper = mapOf(
            "id" to "id",
            "lastName" to "last_name",
            "firstName" to "first_name",
            "email" to "email",
            "groupName" to "g.name",
            "course" to "g.year",
        )
    }
}
