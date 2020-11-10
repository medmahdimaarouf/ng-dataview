import { ElementRef, EmbeddedViewRef, EventEmitter, Renderer2 } from '@angular/core';

export abstract class ViewItemAction {
    _actionView: HTMLElement;
    _state: any;
    _name: String;
    _targetItem: ViewItem;
    onStateChanged?(action: ViewItemAction): void;

    constructor(view: HTMLElement, name: String, targetItem: ViewItem, state?: boolean) {
        this._name = name;
        this._state = state;
        this._actionView = view;
        this._targetItem = targetItem;
    }
    set targetItem(item: ViewItem) { this._targetItem = item; }
    get targetItem() { return this._targetItem; }
    abstract set actionView(view: HTMLElement | String);
    abstract get actionView();
    abstract bindActionEvent(event: { name: String, callback(data): any }, render?: Renderer2);
    abstract set state(state: boolean);
    abstract get state();
    abstract set name(name: String);
    abstract get name();
    abstract hide();
    abstract show();
}
export abstract class ViewItem {
    _data: any;
    _view: any;
    _actions = new Map<String, ViewItemAction>();

    constructor(view: ElementRef | EmbeddedViewRef<any>, data: any, public render: Renderer2) {//
        this._data = data;
        this._view = view;
    }

    abstract set data(data: any);
    abstract set view(view: HTMLElement | EmbeddedViewRef<any>);
    abstract get data();
    abstract get view(): HTMLElement | EmbeddedViewRef<any>;
    abstract addAction(action: ViewItemAction);
    abstract getAction(name: String): ViewItemAction;
    abstract deleteAction(action: ViewItemAction | String);
    private _init(data, view) {
        this.view = view;
        this.data = data;
    }

}