import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { Transaction } from 'src/app/model/transactions';
import { UserService } from 'src/app/services/user.service';
import * as XLSX from 'xlsx';
const DATE:Date = new Date();
const TODAY:string = `${DATE.getFullYear()}-${String(DATE.getMonth()+1).padStart(2, '0')}-${DATE.getDate().toString().length===1?`0${DATE.getDate()}`:`${DATE.getDate()}`}`;
@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
  standalone: true,
  imports:[MatButtonModule,CommonModule,FormsModule]
})
export class TransactionsComponent {

  fileName = 'TransactionReport.xlsx';
  constructor(private userServ:UserService){}

  allTrans:Transaction[]=[];
  username: string = '';
  from?:string;
  to?:string;

  ngOnInit(){
    this.to = this.from = TODAY;
    this.getTrans();
  }
  getTrans(){
    if(this.from!=null && this.to!=null){
      this.userServ.getTransactions(this.from!,this.to!).subscribe({
        next:dd=>{
          this.allTrans = dd;
          console.log(this.allTrans);
          
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
  exportExcel(): void{
    let element = document.getElementById('excel-table');
    const ws : XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transaction List');
    XLSX.writeFile(wb, this.fileName);
  }
}
