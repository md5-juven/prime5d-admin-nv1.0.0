import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { TokenManageService } from '../services/token-manage.service';
import { LoginFm } from '../model/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterServiceService } from '../services/router-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private userServ : UserService,private token:TokenManageService,private routerServ:RouterServiceService){}

  login: LoginFm ={
    email : '',
    password: ''
  }

  loginSub(){

   const oldToken = window.sessionStorage.getItem("token");
    if(this.login.email.length>12 && this.login.password.length>3){
      this.userServ.login(this.login).subscribe({
        next:dd=>{
          console.log(dd)
          this.token.saveToken(dd.token);
          this.token.saveEmail(dd.email);
          this.token.setSAI(dd.sai);
          this.token.setRole(dd.role);
          this.userServ.LoginUpdate(true);
          this.routerServ.toDashboard();
          // this.snackBar.open('Logged in Successfully', 'Ok', {
          //   horizontalPosition : 'center',
          //   verticalPosition:'bottom',
          //   duration: 2500
          // });
        },
        error:err=>{
          alert("Wrong Credentials, LogIn Again");
          this.login.password='';
        }
      })
    }
  }
}
