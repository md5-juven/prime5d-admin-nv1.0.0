import { Component } from '@angular/core';
import { data } from 'jquery';
import { GST } from 'src/app/model/gst';
import { TransactionDTO } from 'src/app/model/orders';
import { OrderService } from 'src/app/services/order.service';
import * as XLSX from 'xlsx';
const DATE:Date = new Date();
const TODAY:string = `${DATE.getFullYear()}-${String(DATE.getMonth()+1).padStart(2, '0')}-${DATE.getDate().toString().length===1?`0${DATE.getDate()}`:`${DATE.getDate()}`}`;


@Component({
  selector: 'app-orders-pending',
  templateUrl: './orders-pending.component.html',
  styleUrls: ['./orders-pending.component.css']
})
export class OrdersPendingComponent {
  fileName = 'Transaction_Pending-Report.xlsx';
  listOfPayments: TransactionDTO[] = [];
  paymentIDValue: any;
  buttonValue: boolean = true;
constructor(private orderServ: OrderService) { }
from?: string;
to?: string;
ngOnInit() {
  this.to = this.from = TODAY;
  this.getOrdersPending();
}
getOrdersPending() {
  this.orderServ.getTransactionPending(this.from!, this.to!).subscribe({
    next: data =>{
      this.listOfPayments = data;
    }
  })
}

changeStatus(orderId: any){
  const value = this.listOfPayments.filter(item => item.orderId === orderId);
  for(let v of value){
    if(this.paymentIDValue === v.paymentId ){
      v.status = 'Paid';
      console.log(v);
      this.orderServ.approvePayment(v).subscribe({
        next: data =>{
        
        }
      })
    }else{
      alert("Payment-ID/Transaction-ID Did Not Match, Contact Customer Immediately!");
      if(confirm('Do you want to Decline the Payment and ask the Customer to re-enter, Please Click OK !')){
        v.status = 'ReTry';
        this.orderServ.approvePayment(v).subscribe({
          next: data =>{
            
          }
        })
      }
    }
  }
}

onRetry(orderId: any){
  const value = this.listOfPayments.filter(item => item.orderId === orderId);
  for(let v of value){
    v.status = 'ReTry';
    this.orderServ.approvePayment(v).subscribe({
      next: data =>{
        console.log(data);
      }
    })
  }
}


exportExcel(): void {
  let element = document.getElementById('excel-table');
  const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, this.fileName);
}

}
