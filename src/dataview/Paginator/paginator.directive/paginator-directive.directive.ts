import { Directive, ElementRef, Renderer2, Input, ViewChild } from '@angular/core';
import { Paginator } from '../paginator';

@Directive({
  selector: '[dv-paginator]'
})
export class PaginatorDirectiveDirective extends Paginator {
  @ViewChild("") wrapper_view_info: ElementRef;
  @ViewChild("") wrapper_view_next: ElementRef;
  @ViewChild("") wrapper_view_prev: ElementRef;
  @Input("") distance: number;
  @Input("") perpage: number;
  @Input("current-page") current_page;
  @Input("") next_prev: boolean;
  info: String;
  constructor(_elementref?: ElementRef, _render?: Renderer2) {
    super(_elementref, _render);
  }

}
