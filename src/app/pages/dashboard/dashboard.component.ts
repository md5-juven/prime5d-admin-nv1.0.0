import { Component } from '@angular/core';
import { data } from 'jquery';
import { Dashboard } from 'src/app/model/user';
import { UserService } from 'src/app/services/user.service';


@Component({
    selector: 'dashboard-cmp',
    moduleId: module.id,
    templateUrl: 'dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
})

export class DashboardComponent{
    data:Dashboard | undefined;
    value: number = 0;
    constructor(private userServ:UserService){}
    ngOnInit(){

        this.userServ.getDashboardInfo().subscribe({
            next:dd=>{
                this.data = JSON.parse(dd);
                console.log(this.data);
                if(this.data){
                    this.value = this.data.Today - this.data.Yesterday;
                }
            }
        })
    }
}
