import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouterServiceService {

  constructor(private router : Router) { }
  toDashboard(){
    this.router.navigate(['dashboard'])
  }
  toLogin(){
    this.router.navigate(['login']);
  }  
}
