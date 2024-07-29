import { Component, OnInit } from '@angular/core';

export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const ROUTES: RouteInfo[] = [
  { path: '/dashboard',     title: 'Dashboard',         icon:'nc-align-center',       class: '' },
  { path: '/user', title: 'Users',     icon:'nc-single-02',    class: '' },
  { path: '/direct_members',          title: 'Direct Members',      icon:'nc-single-02',  class: '' },
  { path: '/products',         title: 'Product List',        icon:'nc-tile-56',    class: '' },
  { path: '/transactions',         title: 'TRANSACTIONS',             icon:'nc-diamond',    class: '' },
  { path: '/e_payments',          title: 'E-PAYMENTS',              icon:'nc-money-coins',      class: '' },
  { path: '/e_payments_paid',    title: 'PAYMENTS PAID',  icon:'nc-money-coins', class:''},
  { path: '/orders',         title: 'ORDERS',             icon:'nc-delivery-fast',    class: '' },
  { path: '/total_gst',         title: 'GST REPORT',             icon:'nc-single-copy-04',    class: '' },
  { path: '/tds',         title: 'TDS/ADMIN REPORTS',             icon:'nc-chart-pie-36',    class: '' },
  { path: '/ordersPending',         title: 'TRANSACTION PENDING',             icon:'nc-money-coins',    class: '' },
  { path: '/genealogy',    title: 'Genealogy View',        icon:'nc-single-copy-04', class: '' },
  { path: '/prev_month',    title: 'Previous Month Data',        icon:'nc-single-copy-04', class: '' },
  // { path: '/upgrade',       title: 'Upgrade to PRO',    icon:'nc-spaceship',  class: 'active-pro' },
];

@Component({
  moduleId: module.id,
  selector: 'sidebar-cmp',
  templateUrl: './sidebar.component.html'
})

export class SidebarComponent implements OnInit {
  public menuItems!: any[];
  ngOnInit() {
      this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
}
