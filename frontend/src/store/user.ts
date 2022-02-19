import { makeAutoObservable } from 'mobx'

class User {
  firstName = 'Иванов';

  secondName = 'Дмитрий';

  group = {
    name: 'ПИНЖ-41',
    year: 4,
  };

  get fullName(): string {
    return `${this.firstName} ${this.secondName}`
  }

  constructor() {
    makeAutoObservable(this)
  }
}

export default new User()
