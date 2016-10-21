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
                var level = Model.state.buildings.getNextLevel(id);
                if (level) {
                    var levelIndex = Model.state.buildings.getNextLevelIndex(id);
                    var viewLevel = View.Data.Buildings.getLevel(id, levelIndex);
                    var item = new Item(viewLevel.name, viewLevel.description, viewLevel.shopImage, !Model.state.buildings.canUpgrade(id), level.cost, null, { id: id, levelIndex: levelIndex });
                    items.push(item);
                }
            }
            Controller.Popup.show(getShopTitle('Builders\' Merchant'), items, function (item) {
                Model.state.spendMoney(item.price);
                Model.state.buildings.setLevelIndex(item.data.id, item.data.levelIndex);
                Controller.updateHUD();
                Controller.updateTriggers();
            });
        }
    })(Shop = Controller.Shop || (Controller.Shop = {}));
})(Controller || (Controller = {}));
