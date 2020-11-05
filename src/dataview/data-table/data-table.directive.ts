import { Directive, ViewChild, ElementRef, Input, Output, EventEmitter, ViewChildren, QueryList, ContentChildren, Renderer2, OnInit, EmbeddedViewRef, TemplateRef, ViewContainerRef } from '@angular/core';
import { ColumnDirective } from './Column.directive/colum.directive';
import { DataSet } from '../DataSet/data-set';
import { ViewModel } from '../ViewModel/ViewModel';
import { Paginator } from '../Paginator/paginator';
import { ActionEvent, ViewItem, ViewItemAction } from '../ViewItem/ViewItem';
import { AjaxService, AjaxSettings } from '../Ajax/ajax.service';

export class TableViewItemAction extends ViewItemAction {
  set actionView(view: String | HTMLElement) {
    if (!view) {

    } else if (typeof view == "string") {

    } else {

    }
  }
  get actionView(): String | HTMLElement {
    return this._actionView;
  }
  set actionEvent(event: ActionEvent) {
    this._actionEvent = event;
  }
  get actionEvent(): ActionEvent {
    return this._actionEvent;
  }
  set state(state: boolean) {
    this._state = state;
    this.actionEvent.callback(this);
  }
  get state(): boolean {
    return this._state;
  }
  set name(name: String) {
    this._name = name;

  }
  get name(): String {
    return this._name;
  }

}

export class TableViewItem extends ViewItem {

  cellDraw: Function = null;
  _selectElement: HTMLElement;
  set selectWrapper(selector: HTMLElement | String) {
    if (typeof selector == "string") {
      if (this.view instanceof HTMLElement) selector = <any>this.view.querySelector(selector);
      else console.warn("connot select html element from Template");
    }
    if (selector) {
      this.render.listen(selector, "click", (event) => {
        //this._selected = true;
      })
    }
  }
  set data(data: any) {
    if (this.view instanceof EmbeddedViewRef) {

    } else {
      //if(this.view.nativeElement) check if view already datisfy
      var select_td = this.render.createElement("td");
      this.render.appendChild(this.view, select_td);
      //var actionEvent = new ViewItemAction(select_td,"select",);
      var tvia = new TableViewItemAction(select_td, "select", this, false, {
        name: "click", callback: (data) => {
          if (data.state) {

          } else {

          }
          data.state = !data.state;
        }
      });

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
        if (td == this._selectElement) continue;
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

  addAction(action: String | ViewItemAction) {
    throw new Error('Method not implemented.');
  }

  deleteAction(action: String | ViewItemAction) {
    return typeof action == "string" ? this._actions.delete(action) : this._actions.delete((<ViewItemAction>action).name);
  }

  getAction(name: String) {
    return this._actions.get(name);
  }



}
export class TableViewModel extends ViewModel {

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
  @Input("select-mode") _selectMode;

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
  paginator: Paginator;
  ngOnInit() {
    console.log("init");
    this._create();
  }

  constructor(private table: ElementRef, private render: Renderer2, private ajax: AjaxService) {
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
