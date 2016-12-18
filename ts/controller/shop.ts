"use strict";

namespace Controller
{
	export namespace Shop
	{
		function addItem(page: View.ListPage, title: string, description: string, image: string, locked: boolean, price: number, handler: any)
		{
			page.addItem(title, description + '<br>' + Util.formatMoney(price), image, locked || price > Model.state.getMoney(), handler);
		}

		function getShopTitle(name: string)
		{
			return name + ' (money available: ' + Util.formatMoney(Model.state.getMoney()) + ')';
		}

		export function showShopsPage()
		{
			let page = new View.ListPage('Let\'s go shopping!');
			page.addItem('Builders\' Merchant', 'Buy building kits', 'images/builders.jpg', false, onBuildersMerchantClicked);
			page.addItem('Animal Market', 'Buy animals', 'images/animals.jpg', false, onAnimalMarketClicked);
			page.addItem('People Market', 'Buy people', 'images/people.png', false, onPeopleMarketClicked);
			page.addItem('Armourer', 'Buy armour', 'images/armourer.jpg', true, null);
			page.show();
		}

		function onBuildersMerchantClicked()
		{
			let page = new View.ListPage(getShopTitle('Builders\' Merchant'));

			for (let id of ['home', 'arena', 'barracks', 'kennels', 'storage', 'weapon', 'armour', 'training', 'surgery', 'lab', 'merch'])
			{
				var level = Data.Buildings.getLevel(id, Model.state.buildings.getNextUpgradeIndex(id));
				if (level)
				{
					var handler = function ()
					{
						Model.state.buildings.buyUpgrade(id);
						Controller.updateHUD();
						View.ludus.updateObjects();
					};

					addItem(page, level.name, level.description, level.shopImage, !Model.state.buildings.canUpgrade(id), level.cost, handler);
					page.show();
				}
			}
		}

		function onAnimalMarketClicked()
		{
			let page = new View.ListPage(getShopTitle('Animal Market'));

			let hasKennels = Model.state.buildings.getCurrentLevelIndex('kennels') >= 0;
			for (let id in Data.Animals.Types)
			{
				var handler = function ()
				{
					Model.state.buyAnimal(id);
					Controller.updateHUD();
				};

				let type = Data.Animals.Types[id];
				addItem(page, type.name, type.description, type.shopImage, !hasKennels, type.cost, handler);
				page.show();
			}
		}
		function onPeopleMarketClicked()
		{
			let page = new View.ListPage(getShopTitle('People Market'));

			let hasBarracks = Model.state.buildings.getCurrentLevelIndex('barracks') >= 0;
			for (let id in Data.People.Types)
			{
				var handler = function ()
				{
					Model.state.buyPerson(id);
					Controller.updateHUD();
				};

				let type = Data.People.Types[id];
				addItem(page, type.name, type.description, type.shopImage, !hasBarracks, type.cost, handler);
				page.show();
			}
		}
	}
}