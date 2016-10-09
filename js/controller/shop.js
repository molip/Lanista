"use strict";

var Shop = {}

Shop.createShopItem = function (title, image, description, price)
{
    return { title: title, title2: Util.formatMoney(price), image: image, description: description, price: price, locked: price > Model.getMoney() };
}

Shop.getShopTitle = function (name)
{
    return name + ' (money available: ' + Util.formatMoney(Model.getMoney()) + ')';
}

Shop.showShopsPopup = function ()
{
    var items = [];
    items.push({ title: 'Builders\' Merchant', image: 'images/builders.jpg', description: 'Buy building kits', handler: Shop.onBuildersMerchantClicked });
    items.push({ title: 'Animal Market', image: 'images/animals.jpg', description: 'Buy animals', locked: true });
    items.push({ title: 'People Market', image: 'images/people.png', description: 'Buy people', locked: true });
    items.push({ title: 'Armourer', image: 'images/armourer.jpg', description: 'Buy armour', locked: true });

    Popup.show('Let\'s go shopping!', items, function (item) { item.handler(); });
}

Shop.onBuildersMerchantClicked = function ()
{
    var items = [];
    items.push(Shop.createShopItem('Barracks', 'images/builders.jpg', 'For gladiators to live in.', 50));
    items.push(Shop.createShopItem('Kennels', 'images/builders.jpg', 'For animals to live in.', 200));
    items.push(Shop.createShopItem('Storage', 'images/builders.jpg', 'For stuff to live in.', 200));
    items.push(Shop.createShopItem('Weapon manufactory', 'images/builders.jpg', 'To make weapons.', 200));
    items.push(Shop.createShopItem('Armour manufactory', 'images/builders.jpg', 'To make armour.', 200));
    items.push(Shop.createShopItem('Training hall', 'images/builders.jpg', 'To train gladiators.', 200));
    items.push(Shop.createShopItem('Surgery', 'images/builders.jpg', 'To fix gladiators.', 200));
    items.push(Shop.createShopItem('Lab', 'images/builders.jpg', 'To invent stuff.', 200));
    items.push(Shop.createShopItem('Merchandising stall', 'images/builders.jpg', 'To sell stuff.', 200));

    Popup.show(Shop.getShopTitle('Builders\' Merchant'), items, function (item) { Model.spendMoney(item.price); Controller.updateHUD(); });
}
