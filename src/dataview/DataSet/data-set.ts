import { ElementRef, TemplateRef, Renderer2 } from '@angular/core';

export interface DataSetItem {
    view: HTMLElement,
    data: {} | [] // array of Strings OR Object 
}

export class DataSet {
    _theme: "table" | "list" = "table";
    _ui_target_wrapper: ElementRef = null;
    _items: Array<DataSetItem> = [];
    _default_items: Array<DataSetItem> = [];
    _data: Array<{} | []>;
    _item_template: TemplateRef<any> = null;
    itemDraw: Function = null;
    cellDraw: Function = null;


    constructor(private render: Renderer2) {
    }


    set data(data: Array<{} | []>) {
        if (this._ui_target_wrapper) {
            if (this._item_template) {
                data.forEach((elm, i) => {
                    var e = this._item_template.createEmbeddedView(this._ui_target_wrapper);
                    // .........
                    // this._default_items.push({ view: e., data: elm });
                });
            }
            else {
                data.forEach((info, i) => {
                    var tr = this.itemDraw ? this.itemDraw(info, i) : this._theme == "table" ? this._create_table_item(Object.values(info)) : this._create_list_item(Object.values(info));// LIST THEME MISSED
                    this._default_items.push({ view: tr, data: info });
                })
            }
            this._data = data;

        } else console.warn("Unable to attache view : data source target view is undefined");
    }
    get data() {
        if (this._data) return this._data;
        if (this._items) {
            return []
        }
    }

    filter(query: String) {
        var items = this._items.filter(item => Object.values(item).toString().search(query.toString()));
        this._apply_changes(items);
    }

    sort(by, dir: "asc" | "desc") {
        var items = this._items.sort(((a, b) => dir == "asc" ? a[by] - b[by] : b[by] - a[by]));
        this._apply_changes(items);
    }

    _init() {
        if (!this._ui_target_wrapper) this._ui_target_wrapper = this.render.createElement(this._theme == "table" ? "body" : "div")
        if (this._ui_target_wrapper.nativeElement.hasChildNodes && this._data.length == 0) this._data = this._load_data_from_html();

    }
    _draw() {

    }

    _load_data_from_html() {
        var data = [];
        var l_tr = this._ui_target_wrapper.nativeElement.querySelectorAll("tr");
        for (var i in l_tr) {
            var tr = l_tr[i];
            var l_td = tr.querySelectorAll("td");
            var values = [];
            for (var j in l_td) {
                var td = l_td[j];
                values.push(td.innerHtml);
            }
            data.push(values);
        }

        return data;
    }
    _create_table_item(cellules: Array<String>) {
        var tr = this.render.createElement("tr");
        this.render.appendChild(this._ui_target_wrapper.nativeElement, tr);
        cellules.forEach((cellule, i) => {
            var td = this.cellDraw ? this.cellDraw(cellule, i) : this.render.createElement("td");
            this.render.appendChild(tr, td);
            this.render.appendChild(td, this.render.createText(cellule.toString()));
        });
        return tr;

    }
    _create_list_item(cellules: Array<String>) {
        var div = this.render.createElement("div");
        cellules.forEach((cellule, i) => {
            var subdiv = this.cellDraw ? this.cellDraw(cellule, i) : this.render.createElement("td");
            this.render.appendChild(div, subdiv);
            this.render.appendChild(subdiv, this.render.createText(cellule.toString()));
        });
        this.render.appendChild(this._ui_target_wrapper, div);
        return div;
    }


    _apply_changes(items) {
        //var new_items = this._paginate(items);
    }
}
