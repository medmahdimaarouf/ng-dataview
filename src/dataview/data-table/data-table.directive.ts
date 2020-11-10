import { Directive, ViewChild, ElementRef, Input, Output, EventEmitter, ViewChildren, QueryList, ContentChildren, Renderer2, OnInit, EmbeddedViewRef, TemplateRef, ViewContainerRef } from '@angular/core';
import { ColumnDirective } from './directives/Column.directive/colum.directive';
import { DataSet } from '../DataSet/data-set';
import { ViewModel } from '../ViewModel/ViewModel';
import { Paginator } from '../Paginator/paginator';
import { ViewItem, ViewItemAction } from '../ViewItem/ViewItem';
import { AjaxService, AjaxSettings } from '../Ajax/ajax.service';

export class TableViewItemAction extends ViewItemAction {
  hide() {
    this._targetItem.render.setStyle(this._actionView, "visiblity", "none");
  }
  show() {
    this._targetItem.render.setStyle(this._actionView, "visiblity", "block");
  }

  set actionView(view: HTMLElement) {
    this._actionView = view;
  }
  get actionView(): HTMLElement {
    return this._actionView;
  }

  set state(state: any) {
    this._state = state;
    this.onStateChanged(this);
  }
  get state(): any {
    return this._state;
  }
  set name(name: String) {
    this._name = name;

  }

  get name(): String {
    return this._name;
  }

  bindActionEvent(event: { name: String; callback(action: ViewItemAction): any; }, render?: Renderer2) {
    render = render ? render : this._targetItem ? this._targetItem.render : render;
    if (render) {
      let fn = (data: any) => {
        this._state = event.callback(this);
      }
      render.listen(this._actionView, event.name.toString(), fn);
      this.onStateChanged = event.callback;
    } else console.warn("Unable to bind view item action " + name + ": No render provided");
  }

}

export class TableViewItem extends ViewItem {
  cellDraw: Function = null;

  set data(data: any) {
    if (this.view instanceof EmbeddedViewRef) {

    } else {

      var select_td = this.render.createElement('td');
      this.render.appendChild(this.view, select_td);
      this.render.addClass(select_td, "check-cell");
      var input = this.render.createElement("input");
      this.render.setAttribute(input, "data-style", "1");
      this.render.setAttribute(input, "data-role", "checkbox");
      this.render.appendChild(select_td, input);
      this.render.setAttribute(input, "type", "checkbox");
      this.render.setValue(input, "false");
      var tvia = new TableViewItemAction(select_td, "select", this, false);
      tvia.bindActionEvent({
        name: "click", callback: (data = tvia) => {
          var input = (<HTMLElement>data.targetItem.view).querySelector("input");
          if (input) input.click();
          console.log("selected", data.targetItem.data);
          return !data.state;
        }
      }, this.render);
      this._actions.set("select", tvia);
      for (var key in data) {
        var info = data[key];
        var td = this.cellDraw ? this.cellDraw(info, key) : this.render.createElement("td");
        this.render.appendChild(this.view, td);
        this.render.appendChild(td, this.render.createText(info.toString()));
      };
    }
    this._data = data;
  }
  get data(): any {
    if (this._data) return this._data;
    if (this.view instanceof EmbeddedViewRef) {
      // get context
    } else {
      var l_td = this.view.querySelectorAll("td");
      for (var j in l_td) {
        var td = l_td[j];
        //if (td == this._selectElement) continue;
        this._data.push(td.innerHTML);
      }
    }
    return this._data;
  }
  set view(view: HTMLElement | EmbeddedViewRef<any>) {
    this._view = view;
  }
  get view(): HTMLElement | EmbeddedViewRef<any> {
    return this._view;
  }

  addAction(action: ViewItemAction) {
    this._actions.set(action.name, action);
  }

  deleteAction(action: String | ViewItemAction) {
    return typeof action == "string" ? this._actions.delete(action) : this._actions.delete((<ViewItemAction>action).name);
  }

  getAction(name: String) {
    return this._actions.get(name);
  }



}
export class TableViewModel extends ViewModel {
  selectionMode: "All" | "Exclusif" | "None";
  itemDraw: Function = null;
  loadFromHtml() {
    if (this.viewRoot instanceof ViewContainerRef) {
      console.warn("cannot load view from embneded view ");
    } else {
      var l_tr = (this.viewRoot.nativeElement ? this.viewRoot.nativeElement : this.viewRoot).querySelectorAll("tr");
      for (var i in l_tr) {
        var tr = l_tr[i];
        var l_td = tr.querySelectorAll("td");
        var data = [];
        for (var k in l_td) { data.push(l_td[k].innerHTML) }
        this._items.push(new TableViewItem(tr, data, this.render));
      }
    }

  }
  deleteItem(item: ViewItem) {
    console.debug(item.view, ":" + (item.view instanceof ElementRef), typeof item.view);
    if (this.viewRoot instanceof ViewContainerRef && item.view instanceof EmbeddedViewRef) {

    } else
      this.render.removeChild(this.viewRoot, ((<any>item.view).nativeElement ? (<any>item.view).nativeElement : item.view));
    //don't forget to delete that fucking item from _items
    if (this._items.length == 0) this.render.appendChild(this.viewRoot, this.emtyMessageView);

  }

  insertItem(item: ViewItem) {
    if (this._items.length == 0) this.render.removeChild(this.viewRoot, this.emtyMessageView);
    if (item.view instanceof EmbeddedViewRef) {
      //this.viewRoot.
    } else
      this.render.appendChild(this.viewRoot, item.view);
    this._items.push(item);
  }

  updateItem(item: ViewItem, data: any) {
    item.data = data;
  }
  createItem(data: any) {
    if (this.itemDraw) return this.itemDraw(data);
    var item;
    if (this.itemTamplate) {
      item = this.itemTamplate.createEmbeddedView(this.viewRoot);
      //set data of embdeded view
    } else {
      var tr = this.render.createElement("tr");
      this.render.appendChild(this.viewRoot, tr);
      item = new TableViewItem(tr, data, this.render);
      item.data = data;
    }
    return item;
  }

  clearView() {
    const childElements = (<ElementRef>this.viewRoot).nativeElement.children;
    for (let child of childElements) {
      this.render.removeChild(this.viewRoot, child);
    }
  }
}

@Directive({
  selector: '[DataTable]'
})
export class DataTableDirective implements OnInit {
  @ViewChildren(ColumnDirective) columns_directives: QueryList<ColumnDirective> = new QueryList;
  @ViewChildren("column", { read: ElementRef }) html_columns: QueryList<ElementRef> = new QueryList;
  @ViewChild("thead", { read: ElementRef, static: true }) thead: ElementRef;
  @ViewChild("tbody", { read: ElementRef }) tbody: ElementRef;
  @ViewChild("tfoot", { read: ElementRef }) tfoot: ElementRef;
  @Input('empty-table-title') emptyTableTitle: String = "Nothing to show";
  @Input('horizontal-scroll') horizontalScroll: boolean = false;
  @Input('search-min-length') searchMinLength: number = 1;
  @Input('search-thres-hold') searchThreshold: number = 500;
  @Input('show-rows-steps') showRowsSteps: boolean = true;
  @Input('show-search') showSearch: boolean = true;
  @Input('show-table-info') showTableInfo: boolean = true;
  @Input('show-pagination') showPagination: boolean = true;
  @Input('pagination-short-mode') paginationShortMode: boolean = true;
  @Input('static') static: boolean = false;
  @Input('data-source') data_source = [];
  @Input('header-source') header_source: any = null;
  @Input('ajax-data-source') ajax_data_source: AjaxSettings = null;
  @Input('ajax-header-source') ajax_header_source: AjaxSettings = null;
  @Input('select-mode') selectMode: "ALL" | "EXCLUSIG" | "NONE";
  @Input('numurated') numurated: boolean;
  @Output() onDraw = new EventEmitter;
  @Output() onDrawRow = new EventEmitter;
  @Output() onDrawCell = new EventEmitter;
  @Output() onAppendRow = new EventEmitter;
  @Output() onAppendCell = new EventEmitter;
  @Output() onSortStart = new EventEmitter;
  @Output() onSortStop = new EventEmitter;
  @Output() onSortItemSwitch = new EventEmitter;
  @Output() onSearch = new EventEmitter;
  @Output() onRowsCountChange = new EventEmitter;
  @Output() onDataLoad = new EventEmitter;
  @Output() onDataLoadError = new EventEmitter;
  @Output() onDataLoaded = new EventEmitter;
  @Output() onDataSaveError = new EventEmitter;
  @Output() onFilterRowAccepted = new EventEmitter;
  @Output() onFilterRowDeclined = new EventEmitter;
  @Output() onCheckClick = new EventEmitter;
  @Output() onCheckClickAll = new EventEmitter;
  @Output() onCheckDraw = new EventEmitter;
  @Output() onViewSave = new EventEmitter;
  @Output() onViewGet = new EventEmitter;
  @Output() onViewCreated = new EventEmitter;
  @Output() onTableCreate = new EventEmitter;
  @Output() onSkip = new EventEmitter;
  columns: Array<ColumnDirective>;
  wrapperInfo = null;
  wrapperSearch = null;
  wrapperRows = null;
  wrapperPagination = null;
  searchFields = [];
  heads = [];
  items = [];
  foots = [];
  filteredItems = [];
  checkType = "checkbox";
  checkStyle = 1;
  searchWrapper = null;
  rowsWrapper = null;
  infoWrapper = null;
  paginationWrapper = null;
  dataSet: DataSet;
  viewModel: TableViewModel;
  _paginator: Paginator;
  ngOnInit() {
    console.log("init");
    this._create();
  }

  constructor(private table?: ElementRef, private render?: Renderer2, private ajax?: AjaxService) {
  }
  set paginator(p: Paginator) {
    this.paginator = p;
    if (this.viewModel) this.paginator.viewModel = this.viewModel;
  }
  get paginator() {
    return this.paginator;
  }
  _create() {
    this._init();
    this._setupheader();
    this._setupDataSet();
    this._setUpFooter();
  }
  _setupheader() {
    var table = this.table.nativeElement;
    var tr = null;
    if (this.columns_directives.length > 0) {
      //console.log("his.columns_directives.length > 0")
      this.heads = this.columns_directives.toArray();
      return;
    } else if (this.html_columns.length > 0) {
      //console.log("this.html_columns.length > 0");
      this.heads = [];
      this.html_columns.forEach((hl, i) => {
        var cd = new ColumnDirective(hl, this.render);
        cd.index = i;
        this.heads.push(cd);
      });
      return;
    } else if (table.querySelector('thead')) {
      //console.log("table.querySelector('thead')")
      var thead = table.querySelector('thead');
      tr = thead.querySelector('tr');
      if (!tr) {
        var tr = this.render.createElement("tr");
        this.render.appendChild(thead, tr);
      }
    } else {
      //console.log("else")
      var thead = this.render.createElement("thead");
      this.render.appendChild(table, thead);
      tr = this.render.createElement("tr")
      this.render.appendChild(thead, tr);
    }

    if (tr) {

      if (tr.querySelectorAll('th').length > 0) {
        //console.log("tr.querySelectorAll('th').length > 0");
        var th_hc = tr.querySelectorAll('th');
        this.heads = [];
        th_hc.forEach((th, i) => {
          var cd = new ColumnDirective(th, this.render);
          cd.element = th;
          cd.index = i;
          this.heads.push(cd);
        });
      }

      if (this.header_source != undefined) {
        var select_all = this.render.createElement('td');
        this.render.appendChild(tr, select_all);
        this.render.addClass(select_all, "check-cell");
        var input = this.render.createElement("input");
        this.render.setAttribute(input, "data-style", "1");
        this.render.setAttribute(input, "data-role", "checkbox");
        this.render.appendChild(select_all, input);
        this.render.setAttribute(input, "type", "checkbox");
        this.render.setValue(input, "false");
        this.render.listen(select_all, "click", (event) => {
          this.viewModel.items.forEach((item, i) => {
            console.log("select item", item);
            if (item.getAction("select")) {
              item.getAction("select").state = true;
            }
          })
        })
        this.header_source.forEach((value, i) => {
          var th = this.heads[i];
          if (!th) {
            //console.log("!th")
            th = this.render.createElement("th");
            this.render.appendChild(tr, th);
            var cd = new ColumnDirective(th, this.render);
            cd.element = th;
            cd.source = { title: value.title.toString(), index: i, sortconfs: { dir: "asc" }, classes: "sortable-column" }
            this.heads.push(cd);

          } else {
            //console.log("sddfsdf", value);
            th.source = { title: value.title.toString(), index: i, sortconfs: { dir: "asc" }, classes: "sortable-column" }
          }
        });
        this._apply();
      } else {
        this.heads.forEach((th, i) => {
          th.source = { title: "undefined", index: i, value: th._element.innerHtml, sortconfs: { dir: "asc" }, classes: "sortable-column" }
        })
      }
    }


  }
  _apply() {
    this.columns_directives.reset([...this.columns_directives.toArray(), this.heads]);
    this.columns_directives.notifyOnChanges();

  }
  _setUpPaginator() {
    //this.paginator = new Paginator(this.table, this.render, this.viewModel);
  }

  _setUpViewModel() {
    this.viewModel = new TableViewModel(this.tbody, this.render);
    this.viewModel.emtyMessageView = "No data provided ! ";
    /*
    this.viewModel.emtyMessageView = this.render.createElement("tr");
    var td = this.render.createElement("td");
    this.render.appendChild(this.viewModel.emtyMessageView, td);
    this.render.setAttribute(td, "colspan", this.heads.length.toString());
    this.render.addClass(td, "text-center");
    var span = this.render.createElement("span");
    this.render.appendChild(td, span);
    this.render.appendChild(span, this.render.createText("Nothing to show !!"))
    */
  }


  _setupDataSet() {
    this._setUpViewModel();
    this.dataSet = new DataSet(this.viewModel, this.data_source);

  }
  _setUpFooter() {

  }

  _setHtmlHeader(heads) {

  }

  _loadHeadsFromHtml() {

  }
  _loadHeadsFromDirectives() {

  }

  _init() {
    if (!this.data_source && this.ajax_data_source) {
      this.data_source = this.ajax.send(this.ajax_data_source);
    }
    if (!this.header_source && this.ajax_header_source) {

    }
    if (!this.tbody) {
      this.tbody = this.render.createElement("tbody");
      //console.log(this.table)
      this.render.appendChild(this.table.nativeElement, this.tbody);
    }
    /*
    if (this.columns_directives.length > 0) this.columns = this.columns_directives.toArray();
    else if (this.html_columns.length > 0) {
      this.html_columns.forEach((hc, i) => {
        this.columns.push(new ColumnDirective(hc, this.render));
      })
    } else if (this.thead) this._buildHeads();
    else this._loadHeadsFromHtml();
    */
  }
}
