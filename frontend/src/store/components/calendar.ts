import { makeAutoObservable } from 'mobx'
import { DateTime } from 'luxon'

class Calendar {


  constructor() {
    makeAutoObservable(this)
  }

  // showPreviousMonth() {
  //   this.showedMonth = this.showedMonth.minus({ month: 1 })
  // }
  //
  // showNextMonth() {
  //   this.showedMonth = this.showedMonth.plus({ month: 1 })
  // }
  //
  // selectDay(day: DateTime) {
  //   this.selectedDate = day
  // }
}

export default new Calendar()
