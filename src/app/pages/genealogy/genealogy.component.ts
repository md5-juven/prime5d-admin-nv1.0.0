import { Component, ElementRef, Renderer2 } from '@angular/core';
import * as $ from 'jquery';
import { userE_DTO } from 'src/app/model/user';
import { UserService } from 'src/app/services/user.service';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-genealogy',
  templateUrl: './genealogy.component.html',
  styleUrls: ['./genealogy.component.css']
})
export class GenealogyComponent {

  allUser:userE_DTO[]=[];
  belowUsers:any;
  fileName = 'Genealogy_List-Report.xlsx';
  constructor(private userServ: UserService){}
  ngOnInit(): void {
    this.userServ.getUserEWalletInfo('').subscribe({
      next:dd=>{
        this.allUser = dd;
      }
    })
    console.log("Inside Genealogy");
    // $(function() {
      // $('.expandChildTable').on('click', function() {
          // $(this).toggleClass('selected').closest('tr').next().toggle();
      // })
  // });
  }

  openTree(ref_id: string){
    const expandChildTables = document.querySelectorAll('.expandChildTable');
    expandChildTables.forEach(expandChildTable => {
      expandChildTable.addEventListener('click', () => {
        expandChildTable.classList.toggle('selected');
        const closestTr = expandChildTable.closest('tr');
        if (closestTr) {
          const nextElement = closestTr.nextElementSibling as HTMLElement;
          if (nextElement) {
            nextElement.style.display = (window.getComputedStyle(nextElement).display === 'none') ? 'table-row' : 'none';
          }
        }
      });
    });
    this.userServ.getGenealogyView(ref_id).subscribe({
      next: data =>{
        this.belowUsers = data;
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
