import { ViewItem } from '../ViewItem/ViewItem';
import { ViewModel } from '../ViewModel/ViewModel';

export class DataSet {

    _items: Array<ViewItem> = [];
    constructor(private viewModel: ViewModel, private _data: Array<{} | []>) {
        this.data = _data;
        this._init();
    }


    reset() {
        this.viewModel.clear();
        this._items.forEach((item, i) => {
            item.selected = false;
        })
        this.viewModel.model = this._items;
    }

    clear() {
        this._items = [];
        this.viewModel.clear();
    }

    get items() {
        return this._items;
    }
    set data(data: Array<{} | []>) {
        var items = [];
        if (this.viewModel) {
            data.forEach((info, i) => {
                this.viewModel.insertItem(this.viewModel.createItem(info));
            });
            //this.viewModel.model = items;
        } else console.warn("Unable to attache view : view model is not provided");
    }

    get selectedItems() {
        var items = [];
        this._items.forEach((item, i) => {
            if (item.selected) items.push(item.data);
        });
        return items;
    }

    get data() {
        var data = [];
        this._items.forEach((item, i) => {
            data.push(item.data);
        })
        return data;
    }

    filter(query: String) {
        this.viewModel.model = this._items.filter(item => Object.values(item.data).toString().search(query.toString()));
    }

    sort(by, dir?: "asc" | "desc") {
        this.viewModel.model = this._items.sort(((a, b) => dir == "asc" ? a[by] - b[by] : b[by] - a[by]));
    }
    _init() {


    }


}
/*
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
    */