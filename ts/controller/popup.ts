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

        export function show(title: string, items: Array<Item>, action: (item: Item)=>void)
        {
            Popup.items = items;
            Popup.action = action;
            View.showPopup(title);
        }

        export function onItemClicked(index: number)
        {
            View.hidePopup();
            var oldAction = action, oldItem = items[index];
            items = action = null;
            oldAction(oldItem);
        }

        export function onBackgroundClicked()
        {
            View.hidePopup();
            items = action = null;
        }
    }
}