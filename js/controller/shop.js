"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Controller;
(function (Controller) {
    var Shop;
    (function (Shop) {
        var Item = (function (_super) {
            __extends(Item, _super);
            function Item(title, description, image, locked, price, handler, data) {
                _super.call(this, title, title + '<br>' + Util.formatMoney(price), image, locked, handler);
                this.price = price;
                this.handler = handler;
                this.data = data;
            }
            return Item;
        }(Controller.Popup.Item));
        function getShopTitle(name) {
            return name + ' (money available: ' + Util.formatMoney(Model.state.getMoney()) + ')';
        }
        function showShopsPopup() {
            var items = [];
            items.push(new Controller.Popup.Item('Builders\' Merchant', 'Buy building kits', 'images/builders.jpg', false, onBuildersMerchantClicked));
            items.push(new Controller.Popup.Item('Animal Market', 'Buy animals', 'images/animals.jpg', true));
            items.push(new Controller.Popup.Item('People Market', 'Buy people', 'images/people.png', true));
            items.push(new Controller.Popup.Item('Armourer', 'Buy armour', 'images/armourer.jpg', true));
            Controller.Popup.show('Let\'s go shopping!', items, function (item) { item.handler(); });
        }
        Shop.showShopsPopup = showShopsPopup;
        function onBuildersMerchantClicked() {
            var items = [];
            for (var i = 0, id; id = ['home', 'barracks', 'kennels', 'storage', 'weapon', 'armour', 'training', 'surgery', 'lab', 'merch'][i]; ++i) {
                var level = Data.Buildings.getLevel(id, Model.state.buildings.getNextUpgradeIndex(id));
                if (level) {
                    var item = new Item(level.name, level.description, level.shopImage, !Model.state.buildings.canUpgrade(id), level.cost, null, { id: id });
                    items.push(item);
                }
            }
            Controller.Popup.show(getShopTitle('Builders\' Merchant'), items, function (item) {
                Model.state.buildings.buyUpgrade(item.data.id);
                Controller.updateHUD();
                View.Canvas.updateObjects();
            });
        }
    })(Shop = Controller.Shop || (Controller.Shop = {}));
})(Controller || (Controller = {}));
