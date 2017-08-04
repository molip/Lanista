namespace Controller
{
	export namespace Shop
	{
		export abstract class Item
		{
			constructor(public tag: string, public title: string, public description: string, public image: string, public cost: number) { }

			abstract canBuy(): boolean;
			abstract buy(): void;
		}

		export class BuildingItem extends Item
		{
			constructor(tag: string)
			{
				let levelIndex = Model.state.buildings.getNextUpgradeIndex(tag);
				let level = Data.Buildings.getLevel(tag, levelIndex);
				Util.assert(level != null);
				super(tag, level.name, level.description, Util.getImage('buildings', tag + levelIndex), level.cost);
			}

			canBuy()
			{
				return Model.state.buildings.canUpgrade(this.tag);
			}

			buy()
			{
				Model.state.buildings.buyUpgrade(this.tag);
			}

		}

		export class AnimalItem extends Item
		{
			constructor(tag: string)
			{
				let data = Data.Animals.Types[tag];
				Util.assert(data != null);
				super(tag, data.name, data.getDescription(), Util.getImage('animals', tag), data.cost);
			}

			canBuy()
			{
				return Model.state.team.getAnimals().length < Model.state.buildings.getCapacity('kennels');
			}

			buy()
			{
				Model.state.buyAnimal(this.tag);
			}
		}

		export class PeopleItem extends Item
		{
			constructor(tag: string)
			{
				let data = Data.People.Types[tag];
				Util.assert(data != null);
				super(tag, data.name, data.getDescription(), Util.getImage('people', tag), data.cost);
			}

			canBuy()
			{
				return Model.state.team.getPeople().length < Model.state.buildings.getCapacity('barracks');
			}

			buy()
			{
				Model.state.buyPerson(this.tag);
			}
		}

		export class ArmourItem extends Item
		{
			constructor(tag: string)
			{
				let data = Data.Armour.Types[tag];
				Util.assert(data != null);
				super(tag, data.name, data.getDescription(), Util.getImage('items', tag), data.cost);
			}

			canBuy()
			{
				return Model.state.team.getItemCount() < Model.state.buildings.getCapacity('storage');
			}

			buy()
			{
				Model.state.buyArmour(this.tag);
			}
		}

		export class WeaponItem extends Item
		{
			constructor(tag: string)
			{
				let data = Data.Weapons.Types[tag];
				Util.assert(data != null);
				super(tag, data.name, data.getDescription(), Util.getImage('items', tag), data.cost);
			}

			canBuy()
			{
				return Model.state.team.getItemCount() < Model.state.buildings.getCapacity('storage');
			}

			buy()
			{
				Model.state.buyWeapon(this.tag);
			}
		}
	}
}
