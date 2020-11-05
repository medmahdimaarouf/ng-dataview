import { ElementRef, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';
import { ViewItem } from '../ViewItem/ViewItem';

export abstract class ViewModel {
    protected _items = new Array<ViewItem>();
    protected itemTamplate: TemplateRef<any>;
    private _emtyMessageView: HTMLElement;

    constructor(protected viewRoot: ElementRef | ViewContainerRef, protected render?: Renderer2) {
        this.render.appendChild(this.viewRoot, this.emtyMessageView);
    }
    get items() { return this._items; }
    set items(items: Array<ViewItem>) { this.model = items; }

    clear() {
        console.debug("clear", this);
        this._items.forEach(item => { this.deleteItem(item) });
    }
    set model(items: Array<ViewItem>) {
        console.debug("Modelset", items.length, this)
        this.clear();

        items.forEach((it, i) => {
            this.insertItem(it);
        })

    }


    abstract loadFromHtml();

    abstract deleteItem(item: ViewItem);

    abstract insertItem(item: ViewItem);

    abstract updateItem(item: ViewItem, data: any);

    abstract createItem(data);

    isEmety() { return this._items.length == 0 }

    set emtyMessageView(view: HTMLElement | string) {
        if (this._items.length == 0) this.render.removeChild(this.viewRoot, this._emtyMessageView);
        if (typeof view === "string") {
            this._emtyMessageView = this.render.createElement("tr");
            var td = this.render.createElement("td");
            this.render.appendChild(this.emtyMessageView, td);
            this.render.setAttribute(td, "colspan", "100");
            this.render.addClass(td, "text-center");
            var span = this.render.createElement("span");
            this.render.appendChild(td, span);
            this.render.appendChild(span, this.render.createText(view))
        } else {
            this._emtyMessageView = view;
        }

        if (this._items.length == 0) this.render.appendChild(this.viewRoot, this._emtyMessageView);
    }
    get emtyMessageView() {
        if (!this._emtyMessageView) {
            this._emtyMessageView = this.render.createElement("tr");
            var td = this.render.createElement("td");
            this.render.appendChild(this._emtyMessageView, td);
            this.render.setAttribute(td, "colspan", "100");
            this.render.addClass(td, "text-center");
            var span = this.render.createElement("span");
            this.render.appendChild(td, span);
            this.render.appendChild(span, this.render.createText("Nothing to show !!"))
        }
        return this._emtyMessageView;
    }

}