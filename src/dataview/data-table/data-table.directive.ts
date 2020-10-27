import { Directive, ViewChild, ElementRef, Input, Output, EventEmitter, ViewChildren, QueryList, ContentChildren, Renderer2, OnInit } from '@angular/core';
import { ColumnDirective } from './Column.directive/colum.directive';
import { element } from 'protractor';

@Directive({
  selector: '[DataTable]'
})
export class DataTableDirective implements OnInit {
  @ViewChildren(ColumnDirective) columns_directives: QueryList<ColumnDirective> = new QueryList;
  @ViewChildren("column", { read: ElementRef }) html_columns: QueryList<ElementRef> = new QueryList
  @ViewChild("header", { read: ElementRef, static: true }) thead: ElementRef;

  columns: Array<ColumnDirective>;

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
  @Input('data-source') data_source = null;
  @Input('header-source') header_source = null;
  @Input('ajax-data-source') ajax_data_source: null;
  @Input('ajax-header-source') ajax_header_source = null;
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
  ngOnInit() {
    this._create();
  }

  constructor(private table: ElementRef, private render: Renderer2) {
  }

  _create() {
    this._init();
    this._setupheader();
    //this._setUpBody();
    //this._setUpFooter();
  }
  _setupheader() {
    console.log("_setupheader")
    var table = this.table.nativeElement;
    var tr = null;
    if (this.columns_directives.length > 0) {
      console.log("his.columns_directives.length > 0")
      this.heads = this.columns_directives.toArray();
      return;
    } else if (this.html_columns.length > 0) {
      console.log("this.html_columns.length > 0");
      this.heads = [];
      this.html_columns.forEach((hl, i) => {
        var cd = new ColumnDirective(hl, this.render);
        cd.index = i;
        this.heads.push(cd);
      });
      return;
    } else if (table.querySelector('thead')) {
      console.log("table.querySelector('thead')")
      var thead = table.querySelector('thead');
      tr = thead.querySelector('tr');
      if (!tr) {
        var tr = this.render.createElement("tr");
        this.render.appendChild(thead, tr);
      }
    } else {
      console.log("else")
      var thead = this.render.createElement("thead");
      this.render.appendChild(table, thead);
      tr = this.render.createElement("tr")
      this.render.appendChild(thead, tr);
    }

    if (tr) {

      if (tr.querySelectorAll('th').length > 0) {
        console.log("tr.querySelectorAll('th').length > 0");
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
            console.log("!th")
            th = this.render.createElement("th");
            this.render.appendChild(tr, th);
            var cd = new ColumnDirective(th, this.render);
            cd.element = th;
            cd.source = { title: value.title.toString(), index: i, sortconfs: { dir: "asc" }, classes: "sortable-column" }
            this.heads.push(cd);

          } else {
            console.log("sddfsdf", value);
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
  _setUpBody() {
    if (this.data_source) {
      if (Array.isArray(this.data_source)) {
      } else {
        console.warn("source is not an array ", this.data_source)
      }
    }
  }
  _setUpFooter() {

  }

  _setHtmlHeader(heads) {

  }
  _setBodySource(source) {

  }

  _loadHeadsFromHtml() {

  }
  _loadHeadsFromDirectives() {

  }
  _buildFromHtml() {

  }
  _init() {
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
