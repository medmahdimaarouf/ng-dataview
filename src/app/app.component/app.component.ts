import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'src/dataview/data-table/data-table.directive';
import { PaginatorDirective } from 'src/dataview/Paginator/paginator.directive/paginator.directive';
@Component({
  selector: 'app-root',
  templateUrl: './web/app.component.html',
  styleUrls: ['./web/app.component.css']
})
export class AppComponent implements OnInit {

  title = 'dataview';
  headers = [
    {
      value: "name",
      title: "Name"
    }, {
      value: "lastname",
      title: "Last Name"
    }, {
      value: "email",
      title: "Email"
    }, {
      value: "tel",
      title: "Telephone"
    }
  ]
  data = [{
    name: "name1",
    lastname: "lastname1",
    email: "email1",
    tel: "tel1"
  }, {
    name: "name2",
    lastname: "lastname2",
    email: "email2",
    tel: "tel2"
  }]
  data2 = [["nnnn", "nnnnnbbb", "kkkkkk", "uuuuu", "ooooo"]]
  @ViewChild(DataTableDirective) dataTable: DataTableDirective;
  @ViewChild(PaginatorDirective) paginator: PaginatorDirective;
  constructor() {

  }
  ngOnInit() {
    console.debug(this.dataTable, this.paginator);
    this.dataTable.paginator = this.paginator;
  }
}
