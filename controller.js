"use strict";

var Controller = {}

Controller.onLoad = function()
{
    Canvas.draw();
}

Controller.onHomeTriggerClicked = function () 
{
    View.showInfo('Home', 'TODO: general stats etc. go here.');
}

Controller.onTownTriggerClicked = function ()
{
    var items = [];
    items.push({ title: 'Builders\' Merchant', image: 'images/builders.jpg', description: 'Buy building kits' });
    items.push({ title: 'Animal Market', image: 'images/animals.jpg', description: 'Buy animals', locked: true });
    items.push({ title: 'People Market', image: 'images/people.png', description: 'Buy people', locked: true });
    items.push({ title: 'Armourer', image: 'images/armourer.jpg', description: 'Buy armour', locked: true });

    Popup.show('Let\'s go shopping!', items, function (item) { Controller.onShopItemClicked(item); });
}

Controller.onShopItemClicked = function (item)
{
    View.showInfo(item.title, 'TODO: Shop items go here.');
}
