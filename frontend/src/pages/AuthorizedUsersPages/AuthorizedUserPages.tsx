import { observer } from 'mobx-react-lite'
import { Redirect, Switch } from 'react-router-dom'
import React from 'react'
import MainWithSideBar from '../../layouts/MainWithSideBar/MainWithSideBar'
import sideBar from '../../store/components/sideBar'
import AuthorizedRoute from '../../routes/AuthorizedRoute'
import MyWorksPage from './MyWorksPage/MyWorksPage'
import ProfilePage from './ProfilePage/ProfilePage'
import CommonInfoPage from './CommonInfoPage/CommonInfoPage'
import sessionInfo from '../../store/sessionInfo'
import ProblemPage from "./ProblemPage/ProblemPage"
import WorkPage from "./WorkPage/WorkPage"
import LibraryPage from "./LibraryPage/LibraryPage"
import WorkProblemPage from "./WorkProblemPage/WorkProblemPage"
import LibraryProblemPage from "./LibraryProblemPage/LibraryProblemPage"
import TeacherRoute from "../../routes/TeacherRoute"
import GroupsManagementPage from "./teacherPages/GroupsManagementPage/GroupsManagementPage"
import NewGroupPage from "./teacherPages/GroupsManagementPage/NewGroupPage/NewGroupPage"
import GroupManagementPage from "./teacherPages/GroupManagementPage/GroupManagementPage"
import StudentsManagementPage from "./teacherPages/StudentsManagementPage/StudentsManagementPage"
import StudentManagementPage from "./teacherPages/StudentManagementPage/StudentManagementPage"
import WorksManagementPage from "./teacherPages/WorksManagementPage/WorksManagementPage"
import WorkManagementPage from "./teacherPages/WorkManagementPage/WorkManagementPage"
import StudentWorkManagementPage
  from "./teacherPages/StudentWorkManagementPage/StudentWorkManagementPage"
import StudentWorkProblemManagementPage
  from "./teacherPages/StudentWorkProblemManagementPage/StudentWorkProblemManagementPage"
import ProblemsManagementPage from "./teacherPages/ProblemsManagementPage/ProblemsManagementPage"
import ProblemManagementPage from "./teacherPages/ProblemManagementPage/ProblemManagementPage"
import WorkCreationPage from "./teacherPages/WorkCreationPage/WorkCreationPage"
import SubmissionPage from "./SubmissionPage/SubmissionPage"
import CreateStudentPage from "./teacherPages/CreateStudentPage/CreateStudentPage"
import MySubmissionsPage from "./MySubmissionsPage/MySubmissionsPage"
import SettingsPage from "./SettingsPage/SettingsPage"

const AuthorizedUserPages = observer(() => {
  return (
    <MainWithSideBar>
      <Switch>
        <AuthorizedRoute path="/common" component={CommonInfoPage} />
        <AuthorizedRoute exact path="/works" component={MyWorksPage} />
        <AuthorizedRoute exact path="/works/:workId" component={WorkPage} />
        <AuthorizedRoute exact path="/works/:workId/problems/:problemId" component={WorkProblemPage} />
        {/*<AuthorizedRoute exact path="/works/:workId/problems/:problemId/submissions/:submissionId" component={SubmissionPage} />*/}
        {/*<AuthorizedRoute path="/exams" component={MyWorksPage} />*/}
        {/*<AuthorizedRoute path="/contests" component={MyWorksPage} />*/}
        <AuthorizedRoute exact path="/library" component={LibraryPage} />
        <AuthorizedRoute exact path="/library/:problemId" component={LibraryProblemPage} />
        <AuthorizedRoute path="/submissions" component={MySubmissionsPage} />
        <AuthorizedRoute path="/settings" component={SettingsPage} />
        <TeacherRoute exact path="/teaching/groups" component={GroupsManagementPage} />
        <TeacherRoute exact path="/teaching/students" component={StudentsManagementPage} />
        <TeacherRoute exact path="/teaching/students/new" component={CreateStudentPage} />
        <TeacherRoute exact path="/teaching/students/:studentId" component={StudentManagementPage} />
        <TeacherRoute exact path="/teaching/students/:studentId/works/:workId" component={StudentWorkManagementPage} />
        {/*<TeacherRoute exact path="/teaching/students/:studentId/works/:workId/problems/:problemId" component={StudentWorkProblemManagementPage} />*/}
        <TeacherRoute exact path="/teaching/groups/new" component={NewGroupPage} />
        <TeacherRoute exact path="/teaching/groups/:groupId" component={GroupManagementPage} />
        <TeacherRoute exact path="/teaching/works" component={WorksManagementPage} />
        <TeacherRoute exact path="/teaching/works/:workId" component={WorkManagementPage} />
        <TeacherRoute exact path="/teaching/problems/" component={ProblemsManagementPage} />
        <TeacherRoute exact path="/teaching/problems/:problemId" component={ProblemManagementPage} />

        <Redirect to="/common" />
      </Switch>
    </MainWithSideBar>
  )
})
export default AuthorizedUserPages
