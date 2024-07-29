import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AdminLayoutRoutes } from './admin-layout.routing';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { UsersComponent }     from '../../pages/users/users.component';
import { GenealogyComponent } from 'src/app/pages/genealogy/genealogy.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import {MatTooltipModule} from '@angular/material/tooltip';
import { ProductsComponent } from 'src/app/pages/products/products.component';
import { EditProductComponent } from 'src/app/pages/edit-product/edit-product.component';
import { AddProductComponent } from 'src/app/pages/add-product/add-product.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { OrdersComponent } from 'src/app/pages/orders/orders.component';
import { MatTableModule} from '@angular/material/table';
import { MatPaginatorModule} from '@angular/material/paginator';
import { MatSortModule} from '@angular/material/sort';
import {MatSelectModule} from '@angular/material/select';
import { OrderViewComponent } from 'src/app/pages/order-view/order-view.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { OrdersPendingComponent } from 'src/app/pages/orders-pending/orders-pending.component';
import {MatCardModule} from '@angular/material/card';
import { PreviousMonthDataComponent } from 'src/app/pages/previous-month-data/previous-month-data.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    NgbModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatSortModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatCardModule
  ],
  declarations: [
    DashboardComponent,
    UsersComponent,
    GenealogyComponent,
    ProductsComponent,
    AddProductComponent,
    EditProductComponent,
    OrdersComponent,
    OrderViewComponent,
    OrdersPendingComponent,
    PreviousMonthDataComponent
  ]
})

export class AdminLayoutModule {}
