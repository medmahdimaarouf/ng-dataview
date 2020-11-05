import { Component } from '@angular/core';
import { DataViewModule } from "../../dataview/data-view.module"
@Component({
  selector: 'app-root',
  templateUrl: './web/app.component.html',
  styleUrls: ['./web/app.component.css']
})
export class AppComponent {

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

  constructor() {

  }
}
