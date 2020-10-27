import { ElementRef, Renderer2 } from '@angular/core';
import { DataSet } from '../DataSet/data-set';

export class Paginator {
    wrapper_view_info: ElementRef;
    wrapper_view_next: ElementRef;
    wrapper_view_prev: ElementRef;
    distance: number;
    perpage: number;
    info: String;
    current_page: number;
    next_prev: boolean;
    data_source: DataSet;
    constructor(private element: ElementRef, private render: Renderer2) {
    }
}
