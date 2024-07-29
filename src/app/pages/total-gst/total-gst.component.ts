import { Component } from '@angular/core';
import { GST } from 'src/app/model/gst';
import { PaymentMade } from 'src/app/model/paymentMade';
import { OrderService } from 'src/app/services/order.service';
import * as XLSX from 'xlsx';
const DATE:Date = new Date();
const TODAY:string = `${DATE.getFullYear()}-${String(DATE.getMonth()+1).padStart(2, '0')}-${DATE.getDate().toString().length===1?`0${DATE.getDate()}`:`${DATE.getDate()}`}`;

@Component({
  selector: 'app-total-gst',
  templateUrl: './total-gst.component.html',
  styleUrls: ['./total-gst.component.css']
})
export class TotalGstComponent {

  fileName = 'GST-Report.xlsx';
  constructor(private orderServ: OrderService) { }
  allTrans: GST[] = [];
  from?: string;
  to?: string;
  ngOnInit() {
    this.to = this.from = TODAY;
    this.getPayments();
  }
  getPayments() {
    if (this.from != null && this.to != null) {
      this.orderServ.getListOfGST(this.from!, this.to!).subscribe({
        next: dd => {
          this.allTrans = dd;
          console.log(dd);
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
