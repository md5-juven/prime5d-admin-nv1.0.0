import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import {MatButtonModule} from '@angular/material/button';
import { userE_DTO } from 'src/app/model/user';
import { UserService } from 'src/app/services/user.service';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-direct-members',
  templateUrl: './direct-members.component.html',
  styleUrls: ['./direct-members.component.css'],
  standalone: true,
  imports: [MatButtonModule,CommonModule]
})
export class DirectMembersComponent {
  fileName = 'DirectMembers.xlsx';
  constructor(private userServ:UserService){}
  allUser:userE_DTO[]=[];
  ngOnInit(){
    this.userServ.directMembers.subscribe({
      next:dd=>{
        console.log(dd);
        this.allUser = dd;
        console.log(this.allUser);
               
      }
    })
  }

  exportExcel(): void{
    let element = document.getElementById('excel-table');
    const ws : XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, this.fileName);
  }
}
