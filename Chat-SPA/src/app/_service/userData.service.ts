import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {


user = '';
roomNumber = 0;

constructor() { }

getUser() {

  return this.user;

}

getRoom() {

  return this.roomNumber;


}

setUser(sUser) {
 this.user = sUser;
 this.roomNumber = this.getRandomInt(1000, 9999);

}
  getRandomInt(min, max) {

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

userJoin(username: string, r: number) {
  this.user = username;
  this.roomNumber = r;

}

}
