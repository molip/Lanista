"use strict";
var Controller;
(function (Controller) {
    var Shop;
    (function (Shop) {
        function createShopItem(title, image, description, price, locked) {
            return { title: title, title2: Util.formatMoney(price), image: image, description: description, price: price, locked: locked, data: {} };
        }
        Shop.createShopItem = createShopItem;
        function getShopTitle(name) {
            return name + ' (money available: ' + Util.formatMoney(Model.state.getMoney()) + ')';
        }
        function showShopsPopup() {
            var items = [];
            items.push({ title: 'Builders\' Merchant', image: 'images/builders.jpg', description: 'Buy building kits', handler: onBuildersMerchantClicked });
            items.push({ title: 'Animal Market', image: 'images/animals.jpg', description: 'Buy animals', locked: true });
            items.push({ title: 'People Market', image: 'images/people.png', description: 'Buy people', locked: true });
            items.push({ title: 'Armourer', image: 'images/armourer.jpg', description: 'Buy armour', locked: true });
            Controller.Popup.show('Let\'s go shopping!', items, function (item) { item.handler(); });
        }
        Shop.showShopsPopup = showShopsPopup;
        function onBuildersMerchantClicked() {
            var items = [];
            for (var i = 0, id; id = ['home', 'barracks', 'kennels', 'storage', 'weapon', 'armour', 'training', 'surgery', 'lab', 'merch'][i]; ++i) {
                var level = Model.state.buildings.getNextLevel(id);
                if (level) {
                    var levelIndex = Model.state.buildings.getNextLevelIndex(id);
                    var viewLevel = View.Data.Buildings.Types[id][levelIndex];
                    var item = Shop.createShopItem(viewLevel.name, viewLevel.shopImage, viewLevel.description, level.cost, !Model.state.buildings.canUpgrade(id));
                    item.data['id'] = id, item.data['levelIndex'] = levelIndex;
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
