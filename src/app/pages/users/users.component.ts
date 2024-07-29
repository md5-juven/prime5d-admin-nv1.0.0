import { Component } from '@angular/core';
import { userE_DTO } from 'src/app/model/user';
import { UserService } from 'src/app/services/user.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  constructor(private userServ:UserService){}
  allUser:userE_DTO[]=[];
  fileName = 'All-Users.xlsx';
  ngOnInit(){
    this.userServ.getUserEWalletInfo('').subscribe({
      next:dd=>{
        this.allUser = dd;
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

  deleteUser(userId: string){
    // const promptValue = window.prompt("Are you sure you want to delete the User, This Action is not reversble !");
    // console.log(promptValue);
    // if(promptValue){
      this.userServ.deleteUserById(userId).subscribe({
        next: user =>{
          console.log(user);
          alert("User Deleted Successfully!")
        }
      })
    // }
  }
}
