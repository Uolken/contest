import { makeAutoObservable } from 'mobx'
import { DateTime } from 'luxon'

class TaskGroups {
  // taskGroups: TaskGroup[] = []

  constructor() {
    makeAutoObservable(this)
    // this.fetchTaskGroups()
  }

  fetchTaskGroups() {
    setTimeout(() => {
      // this.taskGroups = [
      //   {
      //     id: 1,
      //     name: '',
      //     startDate: DateTime.now(),
      //     endDate: DateTime.now().plus({ hour: 1 }),
      //     type: ActionType.CLASS_WORK,
      //     authorId: 123,
      //     tasks: [],
      //   },
      //   {
      //     id: 2,
      //     name: '',
      //     startDate: DateTime.now().plus({ day: 1 }),
      //     endDate: DateTime.now().plus({ day: 8 }).plus({ hour: 1 }),
      //     type: ActionType.CLASS_WORK,
      //     authorId: 123,
      //     tasks: [],
      //   },
      // ]
    }, 2000)
  }
}

export default new TaskGroups()
