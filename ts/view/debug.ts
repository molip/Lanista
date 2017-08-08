/// <reference path="page.ts" />

namespace View 
{
	export class DebugPage extends Page
	{
		constructor()
		{
			super('Debug');

			this.addButton('Buy all animals', this.onBuyAllAnimals);
			this.addButton('Buy all people', this.onBuyAllPeople);
			this.addButton('Buy all buildings', this.onBuyAllBuildings);
			this.addButton('Heal fighters', this.onHeal);
			this.addButton('Add 100 money', this.onAddMoney);
		}

		private addButton(caption: string, handler: () => void)
		{
			let button = document.createElement('button');
			button.innerText = caption;
			button.addEventListener('click', handler);
			this.div.appendChild(button);
			this.div.appendChild(document.createElement('br'));
		}

		onBuyAllAnimals = () =>
		{
			for (let tag in Data.Animals.Types)
			{
				Model.state.addMoney(Data.Animals.Types[tag].cost);
				Model.state.buyAnimal(tag);
			}
			Page.hideCurrent();
		}

		onBuyAllPeople = () =>
		{
			for (let tag in Data.People.Types)
			{
				Model.state.addMoney(Data.People.Types[tag].cost);
				Model.state.buyPerson(tag);
			}
			Page.hideCurrent();
		}

		onBuyAllBuildings = () =>
		{
			for (let tag in Data.Buildings.Levels)
			{
				if (Model.state.buildings.canUpgrade(tag))
				{
					var level = Data.Buildings.getLevel(tag, Model.state.buildings.getNextUpgradeIndex(tag));
					if (level.cost)
						Model.state.addMoney(level.cost);

					Model.state.buildings.buyUpgrade(tag);
				}
			}
			Page.hideCurrent();
		}

		onHeal = () =>
		{
			for (let id in Model.state.team.fighters)
				Model.state.team.fighters[id].resetHealth();

			Page.hideCurrent();
		}

		onAddMoney = () =>
		{
			Model.state.addMoney(100);

			Page.hideCurrent();
		}
	}
}
