"use strict";

namespace Controller
{
    export namespace Popup
    {
        export class Item
        {
            constructor(public title: string, public description: string, public image: string, public locked: boolean, public handler?: any) { }
        }

        export let items: Array<Item>;
        export let action: any;

        export function show(title: string, items: Array<Item>, action)
        {
            Popup.items = items;
            Popup.action = action;
            View.showPopup(this, title);
        }

        export function onItemClicked(index: number)
        {
            View.hidePopup();
            var action = this.action, item = this.items[index];
            this.items = this.action = null;
            action(item);
        }

        export function onBackgroundClicked()
        {
            View.hidePopup();
            this.items = this.action = null;
        }
    }
}