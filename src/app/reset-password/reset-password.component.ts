import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {

  email: string = '';
  loader: boolean = true;
  sent: boolean = false;
  constructor(private userServ: UserService ) { }
  onSubmit() {
    this.loader = false;
      this.userServ.forgotPass("breddy567@gmail.com").subscribe({
        next:dd=>{
          console.log(dd);
          this.sent = true;
          alert('Sent Successfully, Check your Inbox!');
        },
        error: err =>{
          console.log(err);
          
        }
      });
  }
}
