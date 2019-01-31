import { Component, OnInit, ViewChild } from '@angular/core';
import {  NgForm } from '@angular/forms';
import { UserDataService } from '../_service/userData.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild('f') signupForm: NgForm;
  @ViewChild('a') JoinForm: NgForm;


  constructor(private userData: UserDataService, private router: Router) { }

  ngOnInit() {

  }

  onSubmit() {

    this.userData.setUser(this.signupForm.value.username);
    this.signupForm.reset();
    this.router.navigate(['/chat']);
  }
  onJoin() {

    this.userData.userJoin(this.JoinForm.value.userNameJoin, this.JoinForm.value.roomNumber);
    this.signupForm.reset();
    this.router.navigate(['/chat']);
  }


}



