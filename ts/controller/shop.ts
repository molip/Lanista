namespace Controller
{
	export namespace Shop
	{
		function getShopTitle(name: string)
		{
			return name + ' (money available: ' + Util.formatMoney(Model.state.getMoney()) + ')';
		}

		export function showShopsPage()
		{
			let page = new View.ShopPage('Let\'s go shopping!');

			populateBuildings(page);
			populateAnimals(page)
			populatePeople(page)
			populateArmour(page)
			populateWeapons(page)

			page.show();
		}

		function populateBuildings(page: View.ShopPage)
		{
			let table = page.addTable('Buildings');

			for (let tag in Data.Buildings.Levels)
				if (Model.state.buildings.getNextUpgradeIndex(tag) >= 0)
					page.addItem(new Controller.Shop.BuildingItem(tag), table);
		}

		function populateAnimals(page: View.ShopPage)
		{
			let table = page.addTable('Animals');
			for (let tag in Data.Animals.Types)
				page.addItem(new Controller.Shop.AnimalItem(tag), table);
		}

		function populatePeople(page: View.ShopPage)
		{
			let table = page.addTable('People');
			for (let tag in Data.People.Types)
				page.addItem(new Controller.Shop.PeopleItem(tag), table);
		}

		function populateArmour(page: View.ShopPage)
		{
			let table = page.addTable('Armour');
			for (let tag in Data.Armour.Types)
				page.addItem(new Controller.Shop.ArmourItem(tag), table);
		}

		function populateWeapons(page: View.ShopPage)
		{
			let table = page.addTable('Weapons');
			for (let tag in Data.Weapons.Types)
				page.addItem(new Controller.Shop.WeaponItem(tag), table);
		}
	}
}
