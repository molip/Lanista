"use strict";

var Shop = {}

Shop.createShopItem = function (title, image, description, price, locked)
{
    return { title: title, title2: Util.formatMoney(price), image: image, description: description, price: price, locked: locked };
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

	for (var i = 0, id; id = ['home', 'barracks', 'kennels', 'storage', 'weapon', 'armour', 'training', 'surgery', 'lab', 'merch'][i]; ++i)
	{
		var level = Model.Buildings.getNextLevel(id);
		if (level)
		{
			var levelIndex = Model.Buildings.getNextLevelIndex(id);
			var viewLevel = View.Buildings.Types[id][levelIndex];
			var item = Shop.createShopItem(viewLevel.name, viewLevel.shopImage, viewLevel.description, level.cost, !Model.Buildings.canUpgrade(id));
			item.id = id, item.levelIndex = levelIndex;
			items.push(item);
		}
	}

    Popup.show(Shop.getShopTitle('Builders\' Merchant'), items, function (item) 
	{ 
		Model.spendMoney(item.price); 
		Model.Buildings.setLevelIndex(item.id, item.levelIndex);
		Controller.updateHUD(); 
		Controller.updateTriggers(); 
	});
}
