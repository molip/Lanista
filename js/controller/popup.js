"use strict";
var Controller;
(function (Controller) {
    var Popup;
    (function (Popup) {
        var Item = (function () {
            function Item(title, description, image, locked, handler) {
                this.title = title;
                this.description = description;
                this.image = image;
                this.locked = locked;
                this.handler = handler;
            }
            return Item;
        }());
        Popup.Item = Item;
        function show(title, items, action) {
            Popup.items = items;
            Popup.action = action;
            View.showPopup(this, title);
        }
        Popup.show = show;
        function onItemClicked(index) {
            View.hidePopup();
            var action = this.action, item = this.items[index];
            this.items = this.action = null;
            action(item);
        }
        Popup.onItemClicked = onItemClicked;
        function onBackgroundClicked() {
            View.hidePopup();
            this.items = this.action = null;
        }
        Popup.onBackgroundClicked = onBackgroundClicked;
    })(Popup = Controller.Popup || (Controller.Popup = {}));
})(Controller || (Controller = {}));
