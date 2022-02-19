package com.uolken.contest.gateway.loader

import com.expediagroup.graphql.server.execution.KotlinDataLoader
import com.uolken.contest.gateway.model.*
import com.uolken.contest.gateway.resolver.task.ProblemService
import com.uolken.contest.gateway.resolver.task.TagService
import com.uolken.contest.gateway.resolver.task.UserService
import com.uolken.contest.gateway.service.GroupService
import com.uolken.contest.gateway.service.SolutionService
import com.uolken.contest.gateway.service.WorkGroupAssignmentService
import com.uolken.contest.gateway.service.WorkService
import com.uolken.contest.problems.model.dto.AssignmentId
import com.uolken.contest.solution.model.SolutionId
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class DataLoaders {

    @Bean
    fun userDataLoader(userService: UserService): KotlinDataLoader<Long, GraphQLUser> =
        GenericDataLoader(userDataLoader, userService, UserService::getUsers)

    @Bean
    fun usersByGroupIdDataLoader(userService: UserService): KotlinDataLoader<Long, List<GraphQLUser>> =
        GenericDataLoader(usersByGroupIdDataLoader, userService, UserService::getUsersByGroupIds)

    @Bean
    fun tagsByProblemIdDataLoader(tagService: TagService): KotlinDataLoader<Long, List<GraphQLTag>> =
        GenericDataLoader(tagsByProblemIdDataLoader, tagService, TagService::getByProblemIds)

    @Bean
    fun tagDataLoader(tagService: TagService): KotlinDataLoader<Long, GraphQLTag> =
        GenericDataLoader(tagDataLoader, tagService, TagService::getByIds)

    @Bean
    fun testCaseCountDataLoader(problemService: ProblemService): KotlinDataLoader<Long, Long> =
        GenericDataLoader(testCaseCountDataLoader, problemService, ProblemService::getTestCaseCounts)
    @Bean
    fun problemTestCasesDataLoader(problemService: ProblemService): KotlinDataLoader<Long, List<GraphQLTestCase>> =
        GenericDataLoader(problemTestCasesDataLoader, problemService, ProblemService::getProblemTestCases)

    @Bean
    fun solutionDataLoader(solutionService: SolutionService): KotlinDataLoader<SolutionId, GraphQLSolutionInfo> =
        GenericDataLoader(solutionDataLoader, solutionService, SolutionService::getSolutionsInfo)

    @Bean
    fun groupByUserIdDataLoader(groupService: GroupService): KotlinDataLoader<Long, GraphQLGroup> =
        GenericDataLoader(groupByUserIdDataLoader, groupService, GroupService::byUserIds)

    @Bean
    fun groupDataLoader(groupService: GroupService): KotlinDataLoader<Long, GraphQLGroup> =
        GenericDataLoader(groupDataLoader, groupService, GroupService::getByIds)

    @Bean
    fun workDataLoader(workService: WorkService): KotlinDataLoader<Long, GraphQLWork> =
        GenericDataLoader(workDataLoader, workService, WorkService::getWorksByIds)

    @Bean
    fun problemsByWorkIdDataLoader(problemService: ProblemService): KotlinDataLoader<Long, List<GraphQLProblem>> =
        GenericDataLoader(problemsByWorkIdDataLoader, problemService, ProblemService::problemsByWorkIds)

    @Bean
    fun problemDataLoader(problemService: ProblemService): KotlinDataLoader<Long, GraphQLProblem> =
        GenericDataLoader(problemDataLoader, problemService, ProblemService::problemsByIds)

    @Bean
    fun assignmentsByGroupIdDataLoader(assignmentService: WorkGroupAssignmentService): KotlinDataLoader<Long, List<GraphQLWorkGroupAssignment>> =
        GenericDataLoader(assignmentsByGroupIdDataLoader, assignmentService, WorkGroupAssignmentService::assignmentsByGroupIds)

    @Bean
    fun assignmentsByWorkIdDataLoader(assignmentService: WorkGroupAssignmentService): KotlinDataLoader<Long, List<GraphQLWorkGroupAssignment>> =
        GenericDataLoader(assignmentsByWorkIdDataLoader, assignmentService, WorkGroupAssignmentService::assignmentsByWorkIds)

    @Bean
    fun assignmentByGroupIdAndWorkIdDataLoader(assignmentService: WorkGroupAssignmentService): KotlinDataLoader<AssignmentId, GraphQLWorkGroupAssignment> =
        GenericDataLoader(assignmentByGroupIdAndWorkIdDataLoader, assignmentService, WorkGroupAssignmentService::assignmentsByIds)

    companion object DataLoaderNames {

        const val userDataLoader = "userDataLoader"
        const val usersByGroupIdDataLoader = "usersByGroupIdDataLoader"
        const val tagsByProblemIdDataLoader = "tagsByProblemIdDataLoader"
        const val tagDataLoader = "tagDataLoader"
        const val testCaseCountDataLoader = "testCaseCountDataLoader"
        const val problemTestCasesDataLoader = "problemTestCasesDataLoader"
        const val solutionDataLoader = "solutionDataLoader"
        const val problemDataLoader = "problemDataLoader"
        const val problemsByWorkIdDataLoader = "problemsByWorkIdDataLoader"
        const val groupByUserIdDataLoader = "groupByUserIdDataLoader"
        const val groupDataLoader = "groupDataLoader"
        const val assignmentsByGroupIdDataLoader = "assignmentsByGroupIdDataLoader"
        const val assignmentByGroupIdAndWorkIdDataLoader = "assignmentByGroupIdAndWorkIdDataLoader"
        const val assignmentsByWorkIdDataLoader = "assignmentsByWorkIdDataLoader"
        const val workDataLoader = "workDataLoader"

    }
}
