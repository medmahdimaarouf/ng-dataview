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
    wrapper_view_pages: ElementRef;
    wrapper_view_next: ElementRef;
    wrapper_view_prev: ElementRef;
    distance: number;
    perpage: number;
    current_page: number;
    _info: string;
    _rows: Array<any>;
    _pages = new Array<any>();
    constructor(protected element: ElementRef, protected render: Renderer2, protected viewmodel: ViewModel) {
    }
    set viewModel(viewmodel: ViewModel) {
        this.viewmodel = viewmodel;
        this._build();
    }
    get viewModel() {
        return this.viewmodel;
    }
    public set info(v: string) {
        if (this.wrapper_view_info) {
            this.render.appendChild(this.wrapper_view_info, this.render.createText(v));
        }
        this._info = v;
    }
    public get info() {
        return this._info;
    }

    public set pages(pages: Array<any>) {
        this._pages = pages;
    }

    prev() {
        this.current_page = this.current_page - 1 < 0 ? this.current_page : this.currentPage = --this.current_page;
    }

    next() {
        this.current_page = this.current_page + 1 > this._pages.length - 1 ? this.current_page : this.currentPage = ++this.current_page;

    }

    get currentPage() {
        if (this.current_page in this._pages.keys) return this._pages[this.current_page];
        else {
            console.warn("page index is out of range");
            return [];
        }
    }
    set currentPage(v: number | any) {
        if (typeof v == "number") this.current_page = v;
        this.viewmodel.model = this.currentPage;
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
        var nodes = this.wrapper_view_pages.nativeElement.childNodes;
        nodes.forEach((n, i) => {
            this.render.removeChild(this.wrapper_view_pages.nativeElement, n);
        })
    }
    _init() {
        this.render.addClass(this.element, "table-bottom");

        if (!this.wrapper_view_info) {
            this.wrapper_view_info = this.render.createElement("div");
            this.render.appendChild(this.element, this.wrapper_view_info);
            this.render.addClass(this.wrapper_view_info, "table-info");
        }
        if (!this.wrapper_view_pages) {
            var tablepagin = this.render.createElement("div");
            this.render.appendChild(this.element, tablepagin);
            this.render.addClass(tablepagin, "table-pagination");
            this.wrapper_view_pages = this.render.createElement("ul");
            this.render.appendChild(tablepagin, this.wrapper_view_pages);
            this.render.addClass(this.wrapper_view_pages, "pagination");
        }
    }
    _build() {
        this._clear();
        if (!this.wrapper_view_pages) {
            this.wrapper_view_pages = this.render.createElement("ul");
            this.render.appendChild(this.element.nativeElement, this.wrapper_view_pages);
            this.render.addClass(this.wrapper_view_pages, "pagination");
        }
        // prev init view
        var prev = this.render.createElement("li");
        this.render.appendChild(this.wrapper_view_pages, prev);
        this.render.addClass(prev, "page-item");
        this.render.addClass(prev, "prev-page");

        var txtprev = this.render.createElement("p");
        this.render.appendChild(prev, txtprev);
        this.render.addClass(txtprev, "page-link");
        this.render.appendChild(txtprev, this.render.createText("prev"));
        if (this.current_page == 0 || this.pages.length == 0) {
            this.render.addClass(prev, "disabled");
        } else {
            this.render.listen(prev, "click", () => { this.prev() })
        }
        this.pages.forEach((page, i) => {
            var page_i = this.render.createElement("li");
            this.render.appendChild(this.wrapper_view_pages, page_i);
            this.render.addClass(page_i, "page-item");
            var txtpage_i = this.render.createElement('p');
            this.render.appendChild(page_i, txtpage_i);
            this.render.addClass(txtpage_i, "page-link");
            this.render.appendChild(txtpage_i, this.render.createText(i.toString()));
            if (this.current_page == i) {
                this.render.addClass(page_i, "disabled");
            } else {
                this.render.listen(page_i, "click", () => {
                    this.currentPage = i;
                })
            }
        })
        var next = this.render.createElement("li");
        this.render.appendChild(this.wrapper_view_pages, next);
        this.render.addClass(next, "page-item");
        this.render.addClass(next, "next-page");
        var txtnext = this.render.createText("p");
        this.render.appendChild(next, txtnext);
        this.render.appendChild(txtnext, this.render.createText("next"));
        this.render.addClass(txtnext, "page-link");
        if (this.current_page == this.pages.length - 1) {
            this.render.addClass(next, "disabled");
        } else {
            this.render.listen(next, "click", () => { this.next() });
        }
    }


}
