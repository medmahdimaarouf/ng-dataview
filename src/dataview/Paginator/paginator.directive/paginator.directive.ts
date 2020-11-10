import { Directive, ElementRef, Renderer2, Input, ViewChild, OnInit } from '@angular/core';
import { ViewModel } from 'src/dataview/ViewModel/ViewModel';
import { Paginator } from '../paginator';

@Directive({
  selector: '[Paginator]'
})
export class PaginatorDirective extends Paginator implements OnInit {
  @ViewChild("wrapper_view_info") wrapper_view_info: ElementRef;

  @Input("distance") distance: number;
  @Input("perpage") perpage: number;
  @Input("current-page") current_page;
  @Input("next_prev") next_prev: boolean;
  @Input("view-model") set _viewmodel(v: ViewModel) {
    this.viewModel = v;
  }
  constructor(_elementref?: ElementRef, _render?: Renderer2) {
    super(_elementref, _render, null);
  }

  ngOnInit() {
    if (this.viewmodel) {
      this._init();
      this._build();
    }
  }


}
