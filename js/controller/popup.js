"use strict";

var Popup = { items: null, action: null };

Popup.show = function (title, items, action) {
    this.items = items;
    this.action = action;
    View.showPopup(this, title);
}

Popup.onItemClicked = function (index) {
    View.hidePopup();
    var action = this.action, item = this.items[index];
    this.items = this.action = null;
    action(item);
}

Popup.onBackgroundClicked = function () {
    View.hidePopup();
    this.items = this.action = null;
}
