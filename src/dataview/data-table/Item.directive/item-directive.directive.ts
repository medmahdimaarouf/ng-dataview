import { Directive, ViewChild, QueryList, ElementRef, ViewChildren } from '@angular/core';
import { DataSetItem } from 'src/dataview/DataSet/data-set';

@Directive({
  selector: '[dt-item]'
})
export class ItemDirectiveDirective implements DataSetItem {
  @ViewChildren("cell", { read: ElementRef }) cellules: QueryList<ElementRef>;

  constructor(public element?: ElementRef) {

  }
  view: HTMLElement;
  data: {};

}
