import { Directive, ViewChild, QueryList, ElementRef, ViewChildren, EmbeddedViewRef, EventEmitter } from '@angular/core';
import { ViewItem } from 'src/dataview/ViewItem/ViewItem';

@Directive({
  selector: '[dt-item]'
})
export class ItemDirectiveDirective {
  @ViewChildren("cell", { read: ElementRef }) cellules: QueryList<ElementRef>;

  constructor(public element?: ElementRef) {
  }

}
