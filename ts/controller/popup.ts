"use strict";

namespace Controller
{
    export class Popup
    {
        static items: Array<any>;
        static action: any;

        static show(title, items, action)
        {
            Popup.items = items;
            Popup.action = action;
            View.showPopup(this, title);
        }

        static onItemClicked(index)
        {
            View.hidePopup();
            var action = this.action, item = this.items[index];
            this.items = this.action = null;
            action(item);
        }

        static onBackgroundClicked()
        {
            View.hidePopup();
            this.items = this.action = null;
        }
    }
}