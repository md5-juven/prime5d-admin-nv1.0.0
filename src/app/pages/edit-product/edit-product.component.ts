import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductServService } from 'src/app/services/product-serv.service';
import { Product } from 'src/app/model/product';



@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})

export class EditProductComponent {
  constructor(private productServ: ProductServService,private actRout:ActivatedRoute, private snackBar: MatSnackBar, private route: Router) { }
  img_url:string = '';
  product: Product = {}
  updatePhotoString?: string;
  isUpdatePhoto: boolean = false;
  updatePhoto?: File;
  add_stock!: number;
 

  onSelectFile(event: any) {
    if (event.target.files) {
      let readFile = new FileReader();
      let file = event.target.files[0];
      this.updatePhoto = file;
      readFile.readAsDataURL(file);
      readFile.onload = (e: any) => {
        this.isUpdatePhoto = true;
        this.updatePhotoString = e.target.result;
      }
    }
  }

  ngOnInit():void{
    this.img_url = this.productServ.getImgUrl();
    this.actRout.paramMap.subscribe(data=>{
      let n_id = data.get('id') ?? null
      // console.log(n_id)
      this.productServ.getProductEdit(n_id!).subscribe(
        {
          next:dd=> this.product = dd,
          error:err=>console.log(err)
        }
      )
    })
    // setTimeout(()=>{
    //   console.log(this.product);
    // },50)
  }

  updateProduct(){
    this.product.stock_qty = this.add_stock;
    if(this.isUpdatePhoto&&this.updatePhoto){
      this.productServ.updateProductWithImg(this.product,this.updatePhoto).subscribe(
        {
          next:dd=>{
            alert(dd)
            this.route.navigate(['products'])},
          error:err=>{console.log(err);}
        }
      )
    }else{
      this.productServ.updateProductWithOutImg(this.product).subscribe({
        next:dd=>{
          alert(dd)},
        error:err=>{console.log(err);}
      })
    }
  }

  deleteProduct(product_id: string){
    this.productServ.deleteProduct(product_id).subscribe({
      next : d =>{
        this.snackBar.open('Product Deleted', '', {
          horizontalPosition : 'center',
          verticalPosition:'top',
          duration: 1000
        });
        this.route.navigateByUrl("/products");
      }
    })

  }
}
