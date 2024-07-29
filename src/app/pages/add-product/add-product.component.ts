import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/model/product';
import { ProductServService } from 'src/app/services/product-serv.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {

  constructor(private productServ: ProductServService, private route: Router) {}
  product: Product = {}
  updatePhotoString: string='';
  isUpdate:boolean = false;
  updatePhoto?: File;
  
  onSelectFile(event: any) {
  if (event.target.files) {
    let file = event.target.files[0];
    this.updatePhoto = file;
    let readFile = new FileReader();
    readFile.readAsDataURL(event.target.files[0]);
    readFile.onload = (e: any) => {
      // this.isUpdatePhoto = true;
      this.updatePhotoString = e.target.result;
    }
  }
}
ngDoCheck(){
  if(this.product.name&&this.product.category&&this.product.description&&this.product.gst
    &&this.product.hsn&&this.product.mrp&&this.product.stock_qty&&this.product.unit&&this.updatePhoto?.size!>0){
      this.isUpdate= true;
    }else{
      this.isUpdate= false;
    }
}
addNewProduct() {
    this.productServ.createNewProduct(this.product,this.updatePhoto!).subscribe({
      next: dd=>{
        console.log(dd)
        alert("product added")
        this.route.navigate(['products'])
      },
      error:err=>{
        console.log(err);
      }
    })
}
canExit(){
  console.log('App product')
  if(!this.isUpdate){
    if(this.product.name||this.product.category||this.product.description||this.product.gst
      ||this.product.hsn||this.product.mrp||this.product.stock_qty||this.product.unit||this.updatePhoto!=null){
      return confirm("You have unsaved Changes. Do you really want to discard there changes ?")
    }else{
      return true;
    }
  }else{
    return true;
  }
}
}
