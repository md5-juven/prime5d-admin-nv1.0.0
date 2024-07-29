import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenManageService } from './token-manage.service';
import { Observable } from 'rxjs';
import { Authentication, LoginFm, userE_DTO } from '../model/user';
import { Transaction } from '../model/transactions';

// const HOST: string = 'http://localhost';
const HOST: string = 'https://prime5d.in'

const A_URL = HOST + ':8081/mlm/admin/';
const USER_URL: string = HOST + ':8081/mlm/user/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class UserService {
  isLoggedIn?: boolean;
  constructor(private http: HttpClient, private tokenM: TokenManageService) { }

  LoginUpdate(data: boolean) {
    this.isLoggedIn = data;
  }

  login(data: LoginFm): Observable<Authentication> {
    return this.http.post<Authentication>(`${A_URL}login`, data, httpOptions);
  }

  getUserEWalletInfo(m:string): Observable<userE_DTO[]> {
    let param = new HttpParams().append('month',m);
    let httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tokenM.getToken() })
    return this.http.get<userE_DTO[]>(`${A_URL}get/AllUserInfo`, {
      headers: httpHeaders,
      params:param
    })
  }
  getTransactions(from: string, to: string): Observable<Transaction[]> {
    let httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tokenM.getToken() })
    return this.http.get<Transaction[]>(`${A_URL}get/transaction/all?from=${from}&to=${to}`, {
      headers: httpHeaders
    })
  }
  getDashboardInfo(): Observable<string> {
    let httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tokenM.getToken() })
    return this.http.get(`${A_URL}get/dashboard/info`, {
      headers: httpHeaders,
      responseType: 'text'
    })
  }
  get directMembers(): Observable<userE_DTO[]> {
    let httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tokenM.getToken() })
    return this.http.get<userE_DTO[]>(`${A_URL}get/direct/member`, {
      headers: httpHeaders
    })
  }

  resetPass(email: string, password: string, token: string) {
    return this.http.post(USER_URL + 'reset_password/forget?key=' + token, { email, password }, { responseType: 'text' })
  }

  verifyToken(token: string): Observable<any> {
    return this.http.get(USER_URL + 'reset_password/forget?key=' + token)
  }
  forgotPass(email: string): Observable<any> {
    return this.http.post(USER_URL + 'forget_password?email=' + email, null, {
      responseType: 'text'
    });
  }

  getBankDetails(email: string): Observable<any> {
    let httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tokenM.getToken() })
    return this.http.get(A_URL + 'BankDetails/' + email, {
      headers: httpHeaders
    })
  }

  getGenealogyView(ref_id: string) {
    let httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tokenM.getToken() })
    let param = new HttpParams().append('rfc', ref_id)
    return this.http.get(A_URL + 'get/Genealogy/L2', {
      headers: httpHeaders,
      params: param
    })
  }

  getUserNameByEmail(email: string){
    let httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tokenM.getToken() })
    return this.http.get(USER_URL + 'get/email/'+email, {
      headers: httpHeaders,
      responseType: 'text'
    })
  }

  deleteUserById(userId: string){
    let httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tokenM.getToken() })
    return this.http.delete(A_URL + 'delete/user/'+ userId, {
      headers: httpHeaders,
      responseType: 'text'
    })
  }

}
