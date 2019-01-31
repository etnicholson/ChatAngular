import { Component, OnInit, OnDestroy, HostListener, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { AlertifyService } from '../_service/alertify.service';
import { UserDataService } from '../_service/userData.service';
import * as signalR from '@aspnet/signalr';
import {MatListModule} from '@angular/material/list';
import { Message } from './model/message';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';




@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked  {

  @ViewChild('a') messageForm: NgForm;
  @ViewChild('chatHistory') chatHistory: ElementRef;

  user = {
    username: '',
    roomNumber: 0
  };
  messageTextbox: string;
  userList: Array<string> = [];
  messages: Message[] = [];

  private hubConnection: signalR.HubConnection;


  constructor(private userData: UserDataService, private alertify: AlertifyService, private router: Router ) {}

  ngOnInit() {
    this.scrollToBottom();
    this.user.username = this.userData.getUser();
    this.user.roomNumber = this.userData.getRoom();
    if (this.user.roomNumber === 0) {
      this.router.navigate(['/']);
    }
    console.log(this.user.roomNumber);
    console.log(this.user.username);
    this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl('http://localhost:11007/chatHub')
        .build();

    this.hubConnection.on('Join', (message: string) => this.alertify.success(message));
    this.hubConnection.on('Left', (message: string) => this.alertify.error(message));
    this.hubConnection.on('UserJoin', (updateList: Array<string>) => this.setUserList(updateList));
    this.hubConnection.on('ReceiveMessages', (m: Message[]) => this.messages = m);
    this.hubConnection.on('ReceiveMessage', (m: Message) => this.pushMessage(m));

    this.hubConnection
    .start()
    .then(() =>  this.ready())
    .catch(err => console.log('Error while starting connection: ' + err));

  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    this.hubConnection.onclose(() => this.hubConnection.invoke('RemoveUser', this.user.roomNumber, this.user.username));
  }

  ready() {
    this.hubConnection.invoke('AddToGroup', this.user.roomNumber, this.user.username);

  }
  setUserList(updateList: Array<string>) {
    this.userList = updateList;

  }

  pushMessage(m: Message) {

    console.log(this.chatHistory);
    this.messages.push(m);
    // tslint:disable-next-line:max-line-length
    this.scrollToBottom();
    console.log(this.chatHistory);
  }
  sendMessage(messageTextbox: string) {
    this.messageForm.reset();
    this.hubConnection.invoke('SendMessage', this.user.username, messageTextbox, this.user.roomNumber);
  }


  scrollToBottom(): void {
    try {
        this.chatHistory.nativeElement.scrollTop = this.chatHistory.nativeElement.scrollHeight;
    } catch (err) { }
  }

  @HostListener('window:unload', ['$event'])
  unloadHandler(event) {

    this.hubConnection.invoke('RemoveUser', this.user.roomNumber, this.user.username);
  }

}
