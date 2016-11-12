"use strict";

namespace Controller
{
	export namespace Shop
	{
		function addItem(popup: View.ListPopup, title: string, description: string, image: string, locked: boolean, price: number, handler: any)
		{
			popup.addItem(title, description + '<br>' + Util.formatMoney(price), image, locked || price > Model.state.getMoney(), handler);
		}

		function getShopTitle(name: string)
		{
			return name + ' (money available: ' + Util.formatMoney(Model.state.getMoney()) + ')';
		}

		export function showShopsPopup()
		{
			let popup = new View.ListPopup('Let\'s go shopping!');
			popup.addItem('Builders\' Merchant', 'Buy building kits', 'images/builders.jpg', false, onBuildersMerchantClicked);
			popup.addItem('Animal Market', 'Buy animals', 'images/animals.jpg', false, onAnimalMarketClicked);
			popup.addItem('People Market', 'Buy people', 'images/people.png', false, onPeopleMarketClicked);
			popup.addItem('Armourer', 'Buy armour', 'images/armourer.jpg', true, null);
			popup.show();
		}

		function onBuildersMerchantClicked()
		{
			let popup = new View.ListPopup(getShopTitle('Builders\' Merchant'));

			for (let id of ['home', 'arena', 'barracks', 'kennels', 'storage', 'weapon', 'armour', 'training', 'surgery', 'lab', 'merch'])
			{
				var level = Data.Buildings.getLevel(id, Model.state.buildings.getNextUpgradeIndex(id));
				if (level)
				{
					var handler = function ()
					{
						Model.state.buildings.buyUpgrade(id);
						Controller.updateHUD();
						View.Canvas.updateObjects();
					};

					addItem(popup, level.name, level.description, level.shopImage, !Model.state.buildings.canUpgrade(id), level.cost, handler);
					popup.show();
				}
			}
		}

		function onAnimalMarketClicked()
		{
			let popup = new View.ListPopup(getShopTitle('Animal Market'));

			let hasKennels = Model.state.buildings.getCurrentLevelIndex('kennels') >= 0;
			for (let id in Data.Animals.Types)
			{
				var handler = function ()
				{
					Model.state.buyAnimal(id);
					Controller.updateHUD();
				};

				let type = Data.Animals.Types[id];
				addItem(popup, type.name, type.description, type.shopImage, !hasKennels, type.cost, handler);
				popup.show();
			}
		}
		function onPeopleMarketClicked()
		{
			let popup = new View.ListPopup(getShopTitle('People Market'));

			let hasBarracks = Model.state.buildings.getCurrentLevelIndex('barracks') >= 0;
			for (let id in Data.People.Types)
			{
				var handler = function ()
				{
					Model.state.buyPerson(id);
					Controller.updateHUD();
				};

				let type = Data.People.Types[id];
				addItem(popup, type.name, type.description, type.shopImage, !hasBarracks, type.cost, handler);
				popup.show();
			}
		}
	}
}