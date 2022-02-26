import { makeAutoObservable } from 'mobx'
import { ReactComponent as CommonIcon } from '../../images/icons/common-icon.svg'
import { ReactComponent as TasksIcon } from '../../images/icons/tasks-icon.svg'
import { ReactComponent as LogoutIcon } from '../../images/icons/logout.svg'
import { ReactComponent as TaskIcon } from '../../images/icons/task-icon.svg'
import { ReactComponent as CheckMarkIcon } from '../../images/icons/exam-icon.svg'
import { ReactComponent as ContestIcon } from '../../images/icons/contest-icon.svg'
import { ReactComponent as LibraryIcon } from '../../images/icons/library-icon.svg'
import { ReactComponent as CalendarIcon } from '../../images/icons/calendar-icon.svg'
import { ReactComponent as SettingsIcon } from '../../images/icons/settings-icon.svg'
import { ReactComponent as GroupIcon } from '../../images/icons/group.svg'
import { ReactComponent as StudentIcon } from '../../images/icons/student.svg'
import sessionInfo from "../sessionInfo"

class SideBar {
  isHovered = false

  studentGroup = [
    {
      name: 'Общее',
      page: '/common',
      Icon: CommonIcon,
    },
    {
      name: 'Работы',
      page: '/works',
      Icon: TasksIcon,
    },
    {
      name: 'Решения',
      page: '/submissions',
      Icon: CheckMarkIcon,
    },
    // {
    //   name: 'Соревнования',
    //   page: '/contests',
    //   Icon: ContestIcon,
    // },
    {
      name: 'Библиотека задач',
      page: '/library',
      Icon: LibraryIcon,
    },
    // {
    //   name: 'Календарь',
    //   page: '/calendar',
    //   Icon: CalendarIcon,
    // },
  ]

  teacherGroup = [
    {
      name: "Группы",
      page: "/teaching/groups",
      Icon: GroupIcon,
    },
    {
      name: "Студенты",
      page: "/teaching/students",
      Icon: StudentIcon,
    },
    {
      name: "Работы",
      page: "/teaching/works",
      Icon: TasksIcon,
    },
    {
      name: "Задачи",
      page: "/teaching/problems",
      Icon: TaskIcon,
    },
  ]

  secondGroup = [
    {
      name: 'Настройки',
      page: '/settings',
      Icon: SettingsIcon,
    },
  ]

  bottomGroup = [
    {
      name: "Выйти",
      action: () => {
        // console.log("logout")
        sessionInfo.logout()
      },
      Icon: LogoutIcon
    }
  ]

  constructor() {
    makeAutoObservable(this)
  }
}

export default new SideBar()
