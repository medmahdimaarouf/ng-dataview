import { ElementRef, EmbeddedViewRef, EventEmitter, Renderer2 } from '@angular/core';
import { map } from 'rxjs/operators';
export interface ActionEvent {
    name: String,
    callback?(event): any
}
export abstract class ViewItemAction {
    _actionView: HTMLElement;
    _actionEvent: ActionEvent;
    _state: boolean;
    _name: String;
    _targetItem: ViewItem;
    constructor(view: HTMLElement, name, targetItem: ViewItem, state: boolean, event: ActionEvent) {
        this._name = name;
        this._state = state;
        this._actionView = view;
        this._actionEvent = event;
        this._targetItem = targetItem;
    }

    abstract set actionView(view: HTMLElement | String);
    abstract get actionView();
    abstract set actionEvent(event: ActionEvent);
    abstract get actionEvent();
    abstract set state(state: boolean);
    abstract get state();
    abstract set name(name: String);
    abstract get name();
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
    abstract addAction(action: ViewItemAction | String);
    abstract getAction(name: String);
    abstract deleteAction(action: ViewItemAction | String);
    private _init(data, view) {
        this.view = view;
        this.data = data;
    }

}