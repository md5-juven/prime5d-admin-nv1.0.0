import { Component } from '@angular/core';
import { FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { RouterServiceService } from '../services/router-service.service';

@Component({
  selector: 'app-reset-page',
  templateUrl: './reset-page.component.html',
  styleUrls: ['./reset-page.component.css']
})
export class ResetPageComponent {

  constructor(private actRout: ActivatedRoute, private userService:UserService,private fb: FormBuilder,
    private navigate: RouterServiceService){}

token:string = "";
validity?:boolean;
validityForm?:boolean=true
validitySuccess?:boolean;
email:string ="";
time: number = 3;
interval:any;
updated:string="";

ngOnInit():void{
this.actRout.queryParams.subscribe(data =>{
      this.token = data['key']
    })
    
this.userService.verifyToken(this.token).subscribe({
next: data=>{
this.email = data.email;
this.validity = true;
this.validityForm = true;
},
error : err=>{
console.log("not-valid")
this.validity = false
this.validityForm = false;
}
})
}
  formPass = this.fb.group({
  password: ['', [Validators.required]],
  confirm_password: ['', [Validators.required]]
},{ 
  validator: ConfirmedValidator('password', 'confirm_password')
}
)
get passwordMatchError() {
return (
this.formPass.getError('mismatch') &&
this.formPass.get('confirm_password')?.touched
);
}

onSubmit(){
this.userService.resetPass(this.email,this.formPass.value.password,this.token).subscribe({
next: data =>{
this.updated = data;
this.validitySuccess = true;
this.validityForm = false;
this.interval = setInterval(() => {
this.time--;
if(this.time == 0){
  this.navigate.toLogin();
}
},1000)
},
error: err=>{
console.log("error")
console.log(err)
}
})
}
}


function ConfirmedValidator(source: string, target: string): ValidatorFn {
return (control: AbstractControl): ValidationErrors | null => {
const sourceCtrl = control.get(source);
const targetCtrl = control.get(target);

return sourceCtrl && targetCtrl && sourceCtrl.value !== targetCtrl.value
? { mismatch: true }
: null;
}

}
