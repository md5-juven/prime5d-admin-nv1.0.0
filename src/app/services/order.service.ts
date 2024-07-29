import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenManageService } from './token-manage.service';
import { ORDERS, Shipment, TransactionDTO } from '../model/orders';
import { Transaction } from '../model/transactions';
import { transcation } from '../pages/e-payments/e-payments.component';
import { PaymentMade } from '../model/paymentMade';
import { GST, TDS } from '../model/gst';

// const HOST: string = 'http://localhost';
const HOST: string = 'https://prime5d.in'

const ORDER_URL: string = HOST + ":8084/mlm/admin/sales/v1/"



@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient, private tokenM: TokenManageService) { }

  getListOfOrder(from: string, to: string): Observable<Array<ORDERS>> {
    let param = new HttpParams().append("from", from).append("to", to);
    let httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tokenM.getToken() })
    return this.http.get<Array<ORDERS>>(`${ORDER_URL}get/All/Orders`, {
      headers: httpHeaders,
      params: param
    })
  }

  getListOfPaymentsMade(from: string, to: string): Observable<Array<PaymentMade>> {
    let param = new HttpParams().append("from", from).append("to", to);
    let httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tokenM.getToken() })
    return this.http.get<Array<PaymentMade>>(`${ORDER_URL}get/bankTrans`, {
      headers: httpHeaders,
      params: param
    })
  }

  getListOfGST(from: string, to: string): Observable<Array<GST>> {
    let param = new HttpParams().append("from", from).append("to", to);
    let httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tokenM.getToken() })
    return this.http.get<Array<GST>>(`${ORDER_URL}get/Gst/Purchase`, {
      headers: httpHeaders,
      params: param
    })
  }

  getListofTDS(from: string, to: string): Observable<Array<TDS>> {
    let param = new HttpParams().append("from", from).append("to", to);
    let httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tokenM.getToken() })
    return this.http.get<Array<TDS>>(`${ORDER_URL}get/tds`, {
      headers: httpHeaders,
      params: param
    })
  }

  getOrderByID(order_id: string): Observable<ORDERS> {
    let httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tokenM.getToken() })
    return this.http.get<ORDERS>(`${ORDER_URL}getOrderList/${order_id}`, {
      headers: httpHeaders
    })
  }
  getInvoice(Sg: string): Observable<ORDERS> {
    let param = new HttpParams().append("sg", Sg);
    let httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tokenM.getToken() })
    return this.http.get<ORDERS>(`${ORDER_URL}invoice/orderView`, {
      headers: httpHeaders,
      params: param
    })
  }

  changeStatus(orderId: string, status: string, shipInfo: Shipment): Observable<any> {
    let param = new HttpParams().append("st", status);
    let httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tokenM.getToken() });
    // return new Observable;
    return this.http.post(`${ORDER_URL}update/Order/Status/${orderId}`, shipInfo, {
      headers: httpHeaders,
      responseType: 'text',
      params: param
    })
  }
  updateEwallet(data: transcation): Observable<any> {
    let httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tokenM.getToken() });
    return this.http.post(`${ORDER_URL}update/eWallet`, data, {
      headers: httpHeaders,
    })
  }

  getTransactionPending(from: string, to: string): Observable<any> {
    let param = new HttpParams().append("from", from).append("to", to);
    let httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tokenM.getToken() })
    return this.http.get(`${ORDER_URL}get/TransactionDetails`, {
      headers: httpHeaders,
      params: param
    })
  }

  approvePayment(value: any){
    let httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tokenM.getToken() })
    return this.http.put(`${ORDER_URL}update/approve/payment`, value, {
      headers: httpHeaders
    })
  }
}
