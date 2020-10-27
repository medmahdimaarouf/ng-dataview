import { Directive, Input, ElementRef, Output, Renderer2, AfterViewInit, ContentChildren, ContentChild, ViewChild } from '@angular/core';
import { EventEmitter } from '@angular/core'

@Directive({
  selector: '[dt-column]',
})
export class ColumnDirective implements AfterViewInit {
  @ViewChild("title_wrapper") title_wrapper: HTMLElement;
  @ViewChild("sort_wrapper", { read: ElementRef }) sort_wrapper: Array<ElementRef> = null;

  @Output("onSort") onSorte = new EventEmitter();
  @Output("onSelected") onSelected = new EventEmitter();

  @Input("source") _source;
  @Input("index") _index: number | String;
  @Input("value") _value: String;
  @Input("classes") _classes: string;

  @Input("title") _title: String;
  @Input("size") _size: number;
  @Input("visibility") _visibility: String;
  @Input("sort-dir") _sortDir: "asc" | "desc";
  @Input("sort-template") _sort_template: any;

  _element: HTMLElement;

  set source(value: {
    element?: HTMLElement,
    index: number,
    value?: string,
    classes?: string,
    title?: string,
    size?: number,
    visibility?: string,
    sortconfs?: {
      dir?: "asc" | "desc",
      template?: string | HTMLElement,
      event?: any
    },
  }) {
    if (value.sortconfs) this.sortDir = value.sortconfs.dir;
    if (value.sortconfs) this.sort_template = value.sortconfs.template;
    if (value.title) this.title = value.title;
    if (value.value) this.value = value.value;
    if (value.classes) this.classes = value.classes;
    if (value.size) this.size = value.size;
    if (value.visibility) this.visibility = value.visibility;
    if (value.element) this.element = value.element;
  }
  set index(value: number | String) {
    if (!value) return;
    this._index = value;
  }
  set value(value: String) {
    if (!value) return;
    if (!this._title) this._title = value;
    this._value = value;
  };
  set classes(value: string) {
    if (!value) return;
    if (this._element) {
      this.render.addClass(this._element, value);
    }
    this._classes = value;
  };
  set title(value: String) {
    if (!value) return;
    if (this.title_wrapper) this.title_wrapper.innerText = value.toString();
    else if (this._element) {
      console.log("value1", value);

      var clstw = this._element.getElementsByClassName("dt-title")
      if (clstw.length > 0) {
        console.log("element by clases title");
        for (var i in clstw) {
          var elm = clstw[i];
          console.log("test", elm)
          this.render.appendChild(elm, this.render.createText(value.toString()));
        }
      }
      else {
        console.log(value);
        this.render.appendChild(this._element, this.render.createText(value.toString()));
      }
    }
    this._title = value;
  }
  set size(s: number) {
    if (!s) return;
    if (this._element) this.render.setStyle(this._element, "width", s.toString() + "px");
    this._size = s;
  }
  set visibility(value: String) {
    this._visibility = value || "block";
    if (this._element)
      this.render.setStyle(this._element, "visibility", this._visibility);
  }
  set sortDir(value: "asc" | "desc") {
    if (value == "asc" && this._sort_template) {
      (<HTMLElement>this.sort_template).classList.remove("dt-sort");
      (<HTMLElement>this.sort_template).classList.remove("dt-sort-down");
      (<HTMLElement>this.sort_template).classList.toggle("dt-sort-up");
    } else if (this._sort_template) {
      (<HTMLElement>this.sort_template).classList.remove("dt-sort");
      (<HTMLElement>this.sort_template).classList.remove("dt-sort-up");
      (<HTMLElement>this.sort_template).classList.toggle("dt-sort-down");

    }
    this._sortDir = value || "asc";
  }
  set sort_template(value: any) {
    if (!value) {
      value = this.render.createElement("span");
      this.render.addClass(value, "dt-sort");
    }
    if (this._element) {
      this.render.appendChild(this._element, value);//this._element.append(value);// % render required here %
      this._sort_template = <HTMLElement>this._element.lastElementChild;

      this.render.listen(this._sort_template, "click", (event) => {
        this._sortDir = (this._sortDir == "desc") ? "asc" : "desc";
        this.onSorte.emit({ event: event, column: this });
      })
    }
  }

  set element(value: HTMLElement) {
    if (!value) return;
    if (value.hasAttribute("index")) this.index = this._element.getAttribute("index");
    else if (value.parentElement) {
      Array.from(value.parentElement.getElementsByTagName(value.tagName)).forEach((el, i) => {
        if (el === value) {
          this.index = i; return;
        }
      })
    }

    if (this.index) console.warn("cannot set column index from given element !");
    if (value.hasAttribute("value")) this._value = value.getAttribute("value");
    else this._value = value.innerText;
    if (value.hasAttribute("title")) this._title = value.getAttribute("title");
    else this._title = this._value;
    this._size = parseFloat(value.style.width.replace("px", ""));
    this._visibility = value.style.visibility;
    this._classes = value.classList.value;

    this.render.listen(value, "click", (event) => {
      this.onSelected.emit({ data: event, colum: this });
    })
    this._element = value;

  }
  constructor(private elementRef: ElementRef, private render: Renderer2) {
    this.element = elementRef.nativeElement;
  }
  ngAfterViewInit() {

  }

  clone() {
    //return {render:this.render,element:this.element}
  }

}
