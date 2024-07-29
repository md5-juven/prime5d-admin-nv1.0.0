import { Component, ElementRef, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import { MatButtonModule } from '@angular/material/button';
import { userE_DTO } from 'src/app/model/user';
import { UserService } from 'src/app/services/user.service';
import { CommonModule } from '@angular/common';
import { Bank } from 'src/app/model/bank';
import { FormsModule } from '@angular/forms';
import { DomElementSchemaRegistry } from '@angular/compiler';
import { OrderService } from 'src/app/services/order.service';
const DATE: Date = new Date();
const TODAY: string = `${DATE.getFullYear()}-${String(DATE.getMonth() + 1).padStart(2, '0')}-${DATE.getDate().toString().length === 1 ? `0${DATE.getDate()}` : `${DATE.getDate()}`}`;
@Component({
  selector: 'app-e-payments',
  templateUrl: './e-payments.component.html',
  styleUrls: ['./e-payments.component.css'],
  standalone: true,
  imports: [MatButtonModule, CommonModule, FormsModule]
})
export class EPaymentsComponent {
  fileName = 'All_E-payments.xlsx';
  bankDetails!: Bank;
  @ViewChild('closeButtionModel', {static: false}) myButton!: ElementRef;
  constructor(private userServ: UserService,private orderServ:OrderService) { }
  allUser: userE_DTO[] = [];
  walletSort: boolean = false;
  createDate = TODAY;
  statusValue: string = '';
  bill_id:String='';
  ngOnInit() {
    this.userServ.getUserEWalletInfo('').subscribe({
      next: dd => {
        this.allUser = dd;
        this.sortEwallet()
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
  sortEwallet() {
    this.walletSort ? this.allUser.sort((a, b) => (a.walletBalance - b.walletBalance)) : this.allUser.sort((a, b) => (b.walletBalance - a.walletBalance))
    this.walletSort = !this.walletSort;
  }

  getBankDetails(email: string) {
    this.userServ.getBankDetails(email).subscribe({
      next: data => {
        this.bankDetails = data;
      }
    })
  }
  onClickSubmit(data:transcation){
    console.log(data);
    if(data.amount&&data.bill_id&&data.createDate&&data.email){
      this.orderServ.updateEwallet(data).subscribe({
        next:dd=>{
          this.allUser.filter(x=>x.email==data.email).map(y=>{
            y.walletBalance=0;
            return y;
          })
        },
        error:err=>{
          console.log(err.error.message);
        }
      })
    }
    this.bill_id='';
  }
}
export interface transcation {
  amount: 0,
  bill_id:'',
  email:''
  createDate:''
}