import { LiteralPrimitive } from '@angular/compiler';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { userE_DTO } from 'src/app/model/user';
import { UserService } from 'src/app/services/user.service';
import * as XLSX from 'xlsx';

const monthNames: string[] = [" ", "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
@Component({
  selector: 'app-previous-month-data',
  templateUrl: './previous-month-data.component.html',
  styleUrls: ['./previous-month-data.component.css']
})
export class PreviousMonthDataComponent {
  private m: string | null = null;
  private fileName = 'userStatusOf-'
  private fileext = '.xlsx'
  private currentDate: Date = new Date();
  private queryParamsList: any = {};
  mDate: string = '';
  allUser: userE_DTO[] = [];
  monthListNumber: number[] = [];
  monthListName: monthData[] = [];

  constructor(private userServ: UserService, private activeRoute: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.activeRoute.queryParamMap.subscribe(dad => {
      let month = dad.get('month') ?? null;
      let d = dad.get('dt') ?? null;
      if (month != null && d != null) {
        this.m = month
        this.mDate = d;
        this.statusHistory(month)
      }
    })
    this.monthSet();
  }
  private statusHistory(n: string) {
    this.userServ.getUserEWalletInfo(n).subscribe({
      next: dd => {
        this.allUser = dd;
      }
    })
  }

  private monthSet() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 3)
    for (let i = 0; i < 3; i++) {
      let m = this.currentDate.getMonth() + 1;
      let temp: monthData = {
        number: m,
        text: monthNames[m] + "-" + this.currentDate.getFullYear(),
      }
      this.monthListName.push(temp);
      this.currentDate.setMonth(this.currentDate.getMonth() + 1)
    }
  }
  ngAfterViewChecked() {
    if (this.allUser.length > 1) {
      document.getElementById('exportXLXS')?.classList.remove('disabled')
      document.getElementById('exportXLXS')?.classList.toggle('btn-outline-secondary', false)
      document.getElementById('exportXLXS')?.classList.toggle('btn-outline-success', true)
    }
  }
  exportExcel(): void {
    if (this.allUser.length > 1) {
      let element = document.getElementById('excel-table');
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, this.mDate);
      XLSX.writeFile(wb, this.fileName + this.mDate + this.fileext);
    }
  }
  monthUpdate(n: any) {
    this.queryParamsList.month = n.number;
    this.queryParamsList.dt = n.text;
    this.router.navigate([], {
      relativeTo: this.activeRoute,
      queryParams: this.queryParamsList,
      queryParamsHandling: 'merge'
    })

  }

}
interface monthData {
  number: number;
  text: string;
}
