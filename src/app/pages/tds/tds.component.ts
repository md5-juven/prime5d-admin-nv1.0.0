import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';
import * as XLSX from 'xlsx';
import { FormsModule } from '@angular/forms';
import { OrderService } from 'src/app/services/order.service';
import { TDS } from 'src/app/model/gst';
const DATE:Date = new Date();
const TODAY:string = `${DATE.getFullYear()}-${String(DATE.getMonth()+1).padStart(2, '0')}-${DATE.getDate().toString().length===1?`0${DATE.
getDate()}`:`${DATE.getDate()}`}`;


@Component({
  selector: 'app-tds',
  templateUrl: './tds.component.html',
  styleUrls: ['./tds.component.css'],
  standalone: true,
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule,FormsModule, CommonModule ]
})


export class TdsComponent {

  fileName = 'TDSReport.xlsx';
  from?:string;
  to?:string;
  tdsData: TDS[] = [];
  constructor(private orderServ: OrderService){}

  ngOnInit(){
    this.to = this.from = TODAY;
  }
  
  getDate(){
    console.log(`${this.from} to ${this.to}`); 
    if(this.from!=null && this.to!=null){
      this.orderServ.getListofTDS(this.from, this.to).subscribe({
        next: data =>{
          this.tdsData = data;
          console.log(this.tdsData);         
        }
      })
    }
  }
  exportExcel(): void{
    let element = document.getElementById('excel-table');
    const ws : XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.fileName);
  }
}
