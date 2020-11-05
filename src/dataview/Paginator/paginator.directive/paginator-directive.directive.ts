import { Directive, ElementRef, Renderer2, Input, ViewChild } from '@angular/core';
import { Paginator } from '../paginator';

@Directive({
  selector: '[dv-paginator]'
})
export class PaginatorDirectiveDirective extends Paginator {
  @ViewChild("wrapper_view_info") wrapper_view_info: ElementRef;
  @ViewChild("wrapper_view_next") wrapper_view_next: ElementRef;
  @ViewChild("wrapper_view_prev") wrapper_view_prev: ElementRef;
  @Input("distance") distance: number;
  @Input("perpage") perpage: number;
  @Input("current-page") current_page;
  @Input("next_prev") next_prev: boolean;
  info: String;

  constructor(_elementref?: ElementRef, _render?: Renderer2) {
    super(_elementref, _render, null);
  }
  _info() {
    //this._info = this.current_page * this.perpage + " items / ".toString() ;
  }

}
