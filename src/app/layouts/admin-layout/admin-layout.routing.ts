import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { UsersComponent } from '../../pages/users/users.component';
import { GenealogyComponent } from 'src/app/pages/genealogy/genealogy.component';
import { ProductsComponent } from 'src/app/pages/products/products.component';
import { DirectMembersComponent } from 'src/app/pages/direct-members/direct-members.component';
import { TransactionsComponent } from 'src/app/pages/transactions/transactions.component';
import { EPaymentsComponent } from 'src/app/pages/e-payments/e-payments.component';
import { TdsComponent } from 'src/app/pages/tds/tds.component';
import { EditProductComponent } from 'src/app/pages/edit-product/edit-product.component';
import { AddProductComponent } from 'src/app/pages/add-product/add-product.component';
import { OrdersComponent } from 'src/app/pages/orders/orders.component';
import { OrderViewComponent } from 'src/app/pages/order-view/order-view.component';
import { authGuard } from 'src/app/services/auth.guard';
import { EPaymentsPaidComponent } from 'src/app/pages/e-payments-paid/e-payments-paid.component';
import { TotalGstComponent } from 'src/app/pages/total-gst/total-gst.component';
import { OrdersPendingComponent } from 'src/app/pages/orders-pending/orders-pending.component';
import { PreviousMonthDataComponent } from 'src/app/pages/previous-month-data/previous-month-data.component';


export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent, canActivate: [authGuard]},
    { path: 'user',           component: UsersComponent, canActivate: [authGuard] },
    { path: 'genealogy',      component: GenealogyComponent, canActivate: [authGuard]},
    { path: 'products',       component: ProductsComponent, canActivate: [authGuard]},
    { path: 'direct_members', component: DirectMembersComponent, canActivate: [authGuard]},
    { path: 'transactions',   component: TransactionsComponent, canActivate: [authGuard]},
    { path: 'e_payments',     component: EPaymentsComponent, canActivate: [authGuard]},
    { path: 'e_payments_paid', component:EPaymentsPaidComponent, canActivate: [authGuard]},
    { path: 'tds',            component:TdsComponent, canActivate: [authGuard]},
    { path: 'add_product',    component: AddProductComponent, canActivate: [authGuard]},
    { path: 'edit_product/:id',   component: EditProductComponent, canActivate: [authGuard]},
    { path: 'orders',         component: OrdersComponent, canActivate: [authGuard]},
    { path: 'order_view/:id',    component: OrderViewComponent, canActivate: [authGuard]},
    { path: 'total_gst',        component: TotalGstComponent, canActivate: [authGuard]},
    { path: 'ordersPending',        component: OrdersPendingComponent, canActivate: [authGuard]},
    { path: 'prev_month',        component: PreviousMonthDataComponent, canActivate: [authGuard]},
    
];
