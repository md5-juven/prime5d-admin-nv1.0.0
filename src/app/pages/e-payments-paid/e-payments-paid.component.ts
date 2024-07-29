import { Component } from '@angular/core';
import { PaymentMade } from 'src/app/model/paymentMade';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import * as XLSX from 'xlsx';
const DATE: Date = new Date();
const TODAY: string = `${DATE.getFullYear()}-${String(DATE.getMonth() + 1).padStart(2, '0')}-${DATE.getDate().toString().length === 1 ? `0${DATE.getDate()}` : `${DATE.getDate()}`}`;

@Component({
  selector: 'app-e-payments-paid',
  templateUrl: './e-payments-paid.component.html',
  styleUrls: ['./e-payments-paid.component.css']
})
export class EPaymentsPaidComponent {

  fileName = 'PaymentsPaid.xlsx';
  username: any;
  constructor(private orderServ: OrderService, private userServ: UserService) { }
  allTrans: PaymentMade[] = [];
  from?: string;
  to?: string;
  ngOnInit() {
    this.to = this.from = TODAY;
    this.getPayments();
  }
  getPayments() {
    if (this.from != null && this.to != null) {
      this.orderServ.getListOfPaymentsMade(this.from!, this.to!).subscribe({
        next: dd => {
          this.allTrans = dd;
          console.log(dd);
        }
      })
    }
  }

  fetchName(email: any){
    this.userServ.getUserNameByEmail(email).subscribe({
      next: data =>{
        this.username = data;
      }
    })
  }
  exportExcel(): void {
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.fileName);
  }

}
