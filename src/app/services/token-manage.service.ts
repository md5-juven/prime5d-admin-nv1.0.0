import { Injectable } from '@angular/core';

const TOKEN_KEY = 't_id';
const EMAIL_KEY = 'em_id';
const SAI = "sai";
const ROLE = 'role'

@Injectable({
  providedIn: 'root'
})
export class TokenManageService {

  constructor() { }
  logOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token:string):void{
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): any {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public saveEmail(email: string): void {
    window.sessionStorage.removeItem(EMAIL_KEY);
    window.sessionStorage.setItem(EMAIL_KEY, email);
  }

  public getEmail(): string | null {
    return window.sessionStorage.getItem(EMAIL_KEY);
  }

  public getSAI(): string | null {
    return window.sessionStorage.getItem(SAI);
  }

  public setSAI(sai: string): void {
    window.sessionStorage.setItem(SAI, sai);
  }
  public getRole(): string | null {
    return window.sessionStorage.getItem(ROLE);
  }

  public setRole(role: string): void {
    window.sessionStorage.setItem(ROLE, role);
  }
}
