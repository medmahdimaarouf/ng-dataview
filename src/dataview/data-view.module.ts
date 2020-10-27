import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataListDirective } from './data-list/data-list.directive';
import { DataTableDirective } from './data-table/data-table.directive';
import { ColumnDirective } from './data-table/Column.directive/colum.directive';
import { ItemDirectiveDirective } from './data-table/Item.directive/item-directive.directive';
import { PaginatorDirectiveDirective } from './Paginator/paginator.directive/paginator-directive.directive';



@NgModule({
  declarations: [DataListDirective, DataTableDirective, ColumnDirective, ItemDirectiveDirective, PaginatorDirectiveDirective],
  imports: [
    CommonModule
  ],
  exports: [DataListDirective, DataTableDirective, ColumnDirective
  ]

})
export class DataViewModule {
  constructor() { }
}
