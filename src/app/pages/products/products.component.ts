import { Component } from '@angular/core';
import { Product } from 'src/app/model/product';
import { ProductServService } from 'src/app/services/product-serv.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  imageUrl:string='';
  allProduct: Product[] = [];
  stockTogle:boolean = true;
  nameTogle:boolean= true;
  fileName = 'Products-Report.xlsx';
  toRed: boolean = true;
  constructor(private productServ: ProductServService){}

  ngOnInit(): void{
    this.imageUrl = this.productServ.getImgUrl()
    this.productServ.getAllproduct().subscribe({
      next: value => {
        this.allProduct = value;
      },
    })
  }

  sortCategory(){
    this.allProduct.sort((a, b) => a.category!.localeCompare(b.category!));
  }

  sortName(){
    this.nameTogle?this.allProduct.sort((a, b) => a.name!.localeCompare(b.name!)):this.allProduct.sort((a, b) => b.name!.localeCompare(a.name!))
    this.nameTogle = !this.nameTogle
  }
  sortStock(){
    this.stockTogle?this.allProduct.sort((a,b) =>(a.stock_qty!-b.stock_qty!)):this.allProduct.sort((a,b) =>(b.stock_qty!-a.stock_qty!)) 
    this.stockTogle = !this.stockTogle
  }

  exportExcel(): void {
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Product List');
    XLSX.writeFile(wb, this.fileName);
  }
}
