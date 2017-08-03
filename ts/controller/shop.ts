namespace Controller
{
	export namespace Shop
	{
		//function addItem(page: View.ShopPage, title: string, description: string, image: string, locked: boolean, price: number, handler: any)
		//{
		//	page.addItem(title, description + '<br>' + Util.formatMoney(price), image, locked || price > Model.state.getMoney(), handler);
		//}

		function getShopTitle(name: string)
		{
			return name + ' (money available: ' + Util.formatMoney(Model.state.getMoney()) + ')';
		}

		export function showShopsPage()
		{
			let page = new View.ShopPage('Let\'s go shopping!');
			//page.addItem('Builders\' Merchant', 'Buy building kits', 'images/builders.jpg', false, onBuildersMerchantClicked);
			//page.addItem('Animal Market', 'Buy animals', 'images/animals.jpg', false, onAnimalMarketClicked);
			//page.addItem('People Market', 'Buy people', 'images/people.png', false, onPeopleMarketClicked);
			//page.addItem('Armourer', 'Buy armour', 'images/armourer.jpg', false, onArmourMarketClicked);
			//page.addItem('Weaponer', 'Buy weapons', 'images/weapons.png', false, onWeaponMarketClicked);

			for (let tag in Data.Buildings.Levels)
				if (Model.state.buildings.getNextUpgradeIndex(tag) >= 0)
					page.addItem(new Controller.Shop.BuildingItem(tag));

			page.show();
		}

		//function onBuildersMerchantClicked()
		//{
		//	let page = new View.ShopPage(getShopTitle('Builders\' Merchant'));

		//	for (let tag in Data.Buildings.Levels)
		//	{
		//		let index = Model.state.buildings.getNextUpgradeIndex(tag);
		//		let level = Data.Buildings.getLevel(tag, index);
		//		if (level)
		//		{
		//			var handler = function ()
		//			{
		//				Model.state.buildings.buyUpgrade(tag);
		//				Controller.updateHUD();
		//				View.ludus.updateObjects();
		//			};

		//			addItem(page, level.name, level.description, Util.getImage('buildings', tag + index), !Model.state.buildings.canUpgrade(tag), level.cost, handler);
		//			page.show();
		//		}
		//	}
		//}

		//function onAnimalMarketClicked()
		//{
		//	let page = new View.ShopPage(getShopTitle('Animal Market'));

		//	let disable = Model.state.team.getAnimals().length >= Model.state.buildings.getCapacity('kennels');
		//	for (let tag in Data.Animals.Types)
		//	{
		//		var handler = function ()
		//		{
		//			Model.state.buyAnimal(tag);
		//			Controller.updateHUD();
		//		};

		//		let type = Data.Animals.Types[tag];
		//		addItem(page, type.name, type.getDescription(), Util.getImage('animals', tag), disable, type.cost, handler);
		//		page.show();
		//	}
		//}
		//function onPeopleMarketClicked()
		//{
		//	let page = new View.ShopPage(getShopTitle('People Market'));

		//	let disable = Model.state.team.getPeople().length >= Model.state.buildings.getCapacity('barracks');
		//	for (let tag in Data.People.Types)
		//	{
		//		var handler = function ()
		//		{
		//			Model.state.buyPerson(tag);
		//			Controller.updateHUD();
		//		};

		//		let type = Data.People.Types[tag];
		//		addItem(page, type.name, type.getDescription(), Util.getImage('people', tag), disable, type.cost, handler);
		//		page.show();
		//	}
		//}

		//function onArmourMarketClicked()
		//{
		//	let page = new View.ShopPage(getShopTitle('Armourer'));

		//	let disable = Model.state.team.getItemCount() >= Model.state.buildings.getCapacity('storage');
		//	for (let tag in Data.Armour.Types)
		//	{
		//		var handler = function ()
		//		{
		//			Model.state.buyArmour(tag);
		//			Controller.updateHUD();
		//		};

		//		let type = Data.Armour.Types[tag];
		//		addItem(page, type.name, type.getDescription(), Util.getImage('items', tag), disable, type.cost, handler);
		//		page.show();
		//	}
		//}

		//function onWeaponMarketClicked()
		//{
		//	let page = new View.ShopPage(getShopTitle('Weaponer'));

		//	let disable = Model.state.team.getItemCount() >= Model.state.buildings.getCapacity('storage');
		//	for (let tag in Data.Weapons.Types)
		//	{
		//		var handler = function ()
		//		{
		//			Model.state.buyWeapon(tag);
		//			Controller.updateHUD();
		//		};

		//		let type = Data.Weapons.Types[tag];
		//		addItem(page, type.name, type.getDescription(), Util.getImage('items', tag), disable, type.cost, handler);
		//		page.show();
		//	}
		//}
	}
}