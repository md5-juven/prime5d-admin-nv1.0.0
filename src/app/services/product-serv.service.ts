import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenManageService } from './token-manage.service';
import { Product } from '../model/product';

function _global_window(): any {
  return window;
}

// const HOST: string = 'http://localhost';
const HOST: string = 'https://prime5d.in'

const ADMIN_PRODUCT:string =HOST+":8082/mlm/admin/product/"
const PRODUCT_URL: string = HOST+':8082/product/';
const PRODUCT_IMG_URL: string = `${PRODUCT_URL}get/UnitProduct/image?Image_id=`;


@Injectable({
  providedIn: 'root'
})
export class ProductServService {
  
  
  constructor(private http: HttpClient, private tokenM: TokenManageService ) { }

  // public createTransaction(amount: any) {
  //   let httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tokenM.getToken() })
  //   return this.http.get(PAYMENT_URL + "createTransaction/" + amount, {
  //     headers: httpHeaders
  //   });
  // }

  getImgUrl(): string {
    return PRODUCT_IMG_URL
  }
  getAllproduct(): Observable<any> {
    return this.http.get(PRODUCT_URL + "get/AllProduct")
  }

  getProductImageById(data: string): Observable<any> {
    let img = this.http.get(PRODUCT_URL + "get/UnitProduct/image?Image_id=" + data);
    console.log(img)
    return img;
  }
  getProductImageByName(data: string): Observable<any> {
    return this.http.get(PRODUCT_URL + "get/UnitProduct/image/j/" + data);
  }
  getProductFromDisplay(): Observable<any> {
    return this.http.get(PRODUCT_URL + "get/product/ads")
  }

  get nativeWindow(): any {
    return _global_window();
  }

  getProductEdit(product:string):Observable<any>{
    let httpHeaders = new HttpHeaders({'Authorization' : 'Bearer ' +this.tokenM.getToken()})
    return this.http.get(PRODUCT_URL+"get/UnitProduct?Product_id="+product,{
      headers:httpHeaders
    })
  }

  createNewProduct(data:Product,img:File){
    let httpHeaders = new HttpHeaders({'Authorization' : 'Bearer ' +this.tokenM.getToken()})
    const formdata:FormData = new FormData();
    formdata.append("data",JSON.stringify(data))
    formdata.append("img_file",img)
    return this.http.post(`${ADMIN_PRODUCT}add/newProduct`,formdata,{
      headers: httpHeaders,
      responseType: 'text'
    })
  }
  updateProductWithImg(data:Product,img:File){
    let httpHeaders = new HttpHeaders({'Authorization' : 'Bearer ' +this.tokenM.getToken()})
    const formdata:FormData = new FormData();
    formdata.append("data",JSON.stringify(data))
    formdata.append("img_file",img)
    return this.http.put(`${ADMIN_PRODUCT}update/i/product`,formdata,{
      headers: httpHeaders,
      responseType: 'text'
    })
  }
  updateProductWithOutImg(data:Product){
    let httpHeaders = new HttpHeaders({'Authorization' : 'Bearer ' +this.tokenM.getToken()});
    return this.http.put(`${ADMIN_PRODUCT}update/product`,data,{
      headers:httpHeaders,
      responseType:"text"
    })
  }

  deleteProduct(product_id:string){
    let httpHeaders = new HttpHeaders({'Authorization' : 'Bearer ' +this.tokenM.getToken()});
    return this.http.delete(`${ADMIN_PRODUCT}delete/${product_id}`, {
      headers:httpHeaders,
      responseType:"text" 
    })
  }
  
  getProductById(product_id: any): Observable<any>{
    return this.http.get(`${PRODUCT_URL}get/UnitProduct?Product_id=+${product_id}`);
  }

  getRandomProductCategory(category: string): Observable<any>{
    return this.http.get(PRODUCT_URL+"get/byCategory?cty="+category);
  }
  
}
