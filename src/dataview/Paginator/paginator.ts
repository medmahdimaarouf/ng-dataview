import { ElementRef, Renderer2 } from '@angular/core';
import { ViewItem } from '../ViewItem/ViewItem';
import { ViewModel } from '../ViewModel/ViewModel';
/*

<ul class="pagination">
    <li class="page-item service prev-page disabled"><a class="page-link">Prev</a></li>
    <li class="page-item active"><a class="page-link">1</a></li>
    <li class="page-item"><a class="page-link">2</a></li>
    <li class="page-item no-link"><a class="page-link">...</a></li>
    <li class="page-item"><a class="page-link">10</a></li>
    <li class="page-item service next-page"><a class="page-link">Next</a></li>
</ul>
*/
export class Paginator {
    wrapper_view_info: ElementRef;
    wrapper_view_next: ElementRef;
    wrapper_view_prev: ElementRef;
    distance: number;
    perpage: number;
    info: String;
    current_page: number;
    next_prev: boolean;
    _rows: Array<any>;
    _pages = [[]];
    _element: HTMLElement;
    constructor(private element: ElementRef, private render: Renderer2, private viewmodel: ViewModel) {
        this._element = element ? element.nativeElement : render.createElement("div");
    }

    set html_wrapper(element: HTMLElement) {
        this._element = element ? element : this.render.createElement("div");
        this._build();
    }

    prev() {
        this.current_page = this.current_page - 1 < 0 ? this.current_page : this.current_page - 1;
        this.viewmodel.model = this.currentPage;
    }

    next() {
        this.current_page = this.current_page + 1 > this._pages.length - 1 ? this.current_page : this.current_page + 1;
        this.viewmodel.model = this.currentPage;
    }

    get currentPage() {
        if (this.current_page in this._pages.keys) return this._pages[this.current_page];
        else {
            console.warn("page index is out of range");
            return [];
        }
    }

    set rows(rows: Array<ViewItem> | Array<any>) {
        this._pages = [[]];
        this._rows = rows;
        var i = 0;
        while (i + this.perpage <= rows.length - 1) {
            this._pages.push(rows.slice(i, this.perpage));
            i += this.perpage + 1;

        }
        if (i <= rows.length - 1) this._pages.push(rows.slice(i, rows.length - 1));
    }

    _clear() {
        var nodes = this._element.childNodes;
        nodes.forEach((n, i) => {
            this.render.removeChild(this._element, n);
        })
    }

    _build() {
        this._clear();
        var ul = this.render.createElement("ul");
        this.render.addClass(ul, "pagination");
        this.render.appendChild(this.element.nativeElement, ul);
    }


}
