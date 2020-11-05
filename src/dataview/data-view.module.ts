import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataListDirective } from './data-list/data-list.directive';
import { DataTableDirective, TableViewModel } from './data-table/data-table.directive';
import { ColumnDirective } from './data-table/Column.directive/colum.directive';
import { ItemDirectiveDirective } from './data-table/Item.directive/item-directive.directive';
import { PaginatorDirectiveDirective } from './Paginator/paginator.directive/paginator-directive.directive';
import { DataSet } from './DataSet/data-set';
import { AjaxService } from './Ajax/ajax.service';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [DataListDirective, DataTableDirective, ColumnDirective, ItemDirectiveDirective, PaginatorDirectiveDirective],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: [DataListDirective, DataTableDirective, ColumnDirective
  ],

})
export class DataViewModule {
}
