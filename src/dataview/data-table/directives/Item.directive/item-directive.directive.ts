import { Directive, QueryList, ElementRef, ViewChildren } from '@angular/core';

@Directive({
  selector: '[dt-item]'
})
export class ItemDirectiveDirective {
  @ViewChildren("cell", { read: ElementRef }) cellules: QueryList<ElementRef>;

  constructor(public element?: ElementRef) {
  }

}
