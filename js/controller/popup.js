"use strict";
var Controller;
(function (Controller) {
    var Popup = (function () {
        function Popup() {
        }
        Popup.show = function (title, items, action) {
            Popup.items = items;
            Popup.action = action;
            View.showPopup(this, title);
        };
        Popup.onItemClicked = function (index) {
            View.hidePopup();
            var action = this.action, item = this.items[index];
            this.items = this.action = null;
            action(item);
        };
        Popup.onBackgroundClicked = function () {
            View.hidePopup();
            this.items = this.action = null;
        };
        return Popup;
    }());
    Controller.Popup = Popup;
})(Controller || (Controller = {}));
