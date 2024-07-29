import { Component, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { ORDERS, Shipment } from 'src/app/model/orders';
import { RouterServiceService } from 'src/app/services/router-service.service';
import { OrderService } from 'src/app/services/order.service';
import { getLocaleFirstDayOfWeek } from '@angular/common';
const DATE: Date = new Date();
const TODAY: string = `${DATE.getFullYear()}-${String(
  DATE.getMonth() + 1
).padStart(2, '0')}-${DATE.getDate().toString().length === 1
  ? `0${DATE.getDate()}`
  : `${DATE.getDate()}`
  }`;
const STATUS: string[] = [
  'Placed',
  'Progressing',
  'Shipped',
  'Delivered'
];
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent {
  fileName = 'Orders.xlsx';
  status: string[] = [
    'Placed',
    'Progressing',
    'Shipped',
    'Delivered'
  ];
  displayedColumns: string[] = [
    'order_id',
    'Date',
    'paymentId',
    'noOfItems',
    'total_amount',
    'status',
    'view',
  ];
  pImg?: string;
  from: string = '';
  to: string = '';
  selected?: boolean;
  dataSource!: MatTableDataSource<ORDERS>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private snackBar: MatSnackBar,
    private route: RouterServiceService,
    private orderServ: OrderService
  ) {}
  orderList: ORDERS[] = [];
  shipmentInfo: Shipment = {};
  currOrder: string = '';
  currState: string = '';
  ngOnInit() {
    this.from = TODAY;
    this.to = TODAY;
    this.getOrderList();
  }
  currentState(id: string, st: string) {
    this.currOrder = id;
    this.currState = st;
  }
  changeSelect() {
    this.selected = false;
    this.shipmentInfo.shipmentId = '';
    this.shipmentInfo.shipmentProvider = '';
  }
  changes(orderId: string, $event: any) {
    if (confirm('The status will be changed, Are you sure?')) {
      if ($event === 'Shipped') {
        this.selected = true;
      } else {
        for (let a of this.orderList) {
          if (a.order_id === orderId) {
            this.orderServ.changeStatus(orderId, a.status!, this.shipmentInfo).subscribe({
              next: data => {
                alert(`${orderId} status ${a.status} ${data}`)
              }
            })
          }
        }
      }
    } else {
      console.log('fales');

      this.selected = false;
      this.orderList = this.orderList.map((x) => {
        if (x.order_id == this.currOrder) {
          x.status = this.currState;
        }
        return x;
      });

      // this.orderList = this.orderList.map(d => {
      //   if (d.order_id == orderId) {
      //     let data1: Map<string, Date> = new Map(Object.entries(d.statusTime!));
      //     let data: any = d.statusTime!;
      //     console.log(data);

      //     let dates1 = Array.from(data1.values()).map(data => new Date(data).getTime());
      //     console.log(dates1);
      //     let high = Math.max.apply(null, dates1);
      //     console.log(new Date(high));
      //     console.log(Object.keys(data).find(key => new Date(data[key]) == new Date(high)));
      //   }
      //   return d;
      // });
    }
  }
  getOrderList() {
    this.orderList = [];
    console.log(this.from, this.to);
    this.orderServ.getListOfOrder(this.from, this.to).subscribe({
      next: dd => {
        console.log(dd);

        for (let i = dd.length - 1; i >= 0; i--) {
          this.orderList.push(dd[i])
        }
        // this.orderList = dd;
        this.dataSource = new MatTableDataSource(dd);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  ship(orderId: string) {
    this.viewShipInfo(orderId);
    console.log(`shipment`);
    this.viewShipInfo(orderId);
    console.log(this.shipmentInfo);
    if (this.shipmentInfo.shipmentId && this.shipmentInfo.shipmentProvider) {
      for (let a of this.orderList) {
        if (a.order_id === orderId) {
          this.orderServ.changeStatus(orderId, a.status!, this.shipmentInfo).subscribe({
            next: data => {
              console.log(data);
              alert(`${orderId} status ${a.status} ${data}`)
            }
          })
        }
      }
    }
    this.orderList = this.orderList.map((x) => {
      if (x.order_id == this.currOrder) {
        x.status = this.currState;
      }
      return x;
    });
    console.log(this.orderList);
    this.changeSelect();
  }
  viewShipInfo(id: string) {
    this.orderList
      .filter((d) => d.order_id == id)
      .map((c) => {
        this.shipmentInfo.shipmentId = c.shipmentId;
        this.shipmentInfo.shipmentProvider = c.shipmentProvider;
      });
  }
  exportExcel(): void {
    let element = document.getElementById('excel-table');
    let ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const range = XLSX.utils.decode_range(ws['!ref']!);
    //remove H and I colums
    for (let R = range.s.r; R <= range.e.r; ++R) {
      const cellAddress = { c: 7, r: R };
      const cellAddress1 = { c: 8, r: R };
      const cell = XLSX.utils.encode_cell(cellAddress);
      const cell1 = XLSX.utils.encode_cell(cellAddress1);
      delete ws[cell];
      delete ws[cell1];
    }
    for (let R = range.s.r+1; R <= range.e.r; ++R) {
      const OrderIdCellAddress = { c: 1, r: R };
      const OrderIdCell = XLSX.utils.encode_cell(OrderIdCellAddress);
      const cellAddress = { c: 6, r: R };
      const cell = XLSX.utils.encode_cell(cellAddress);
      let data  = this.orderList.filter(x=>x.order_id === ws[OrderIdCell].v).map(d=>d.status);
      ws[cell] = {v:data[0]}
    }
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.fileName);
  }
}
