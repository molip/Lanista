namespace Controller
{
	export namespace Shop
	{
		export type Basket = NumberMap;

		export abstract class Item
		{
			constructor(public type: string, public tag: string, public title: string, public description: string, public image: string, public cost: number) { }

			canBuy() { return true; }
			abstract buy(): void;
			abstract getMaxTypeCount(): number;

			canAddToBasket(basket: Basket)
			{
				return basket.get(this.type) < this.getMaxTypeCount();
			}
		}

		export class BuildingItem extends Item
		{
			constructor(tag: string)
			{
				let levelIndex = Model.state.buildings.getNextUpgradeIndex(tag);
				let level = Data.Buildings.getLevel(tag, levelIndex);
				Util.assert(level != null);
				super('building:' + tag, tag, level.name, level.description, Util.getImage('buildings', tag + levelIndex), level.cost);
			}

			getMaxTypeCount()
			{
				return 1;
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
				super('animal', tag, data.name, data.getDescription(), Util.getImage('animals', tag), data.cost);
			}

			getMaxTypeCount()
			{
				return Model.state.buildings.getCapacity('kennels') - Model.state.team.getAnimals().length;
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
				super('person', tag, data.name, data.getDescription(), Util.getImage('people', tag), data.cost);
			}

			getMaxTypeCount()
			{
				return Model.state.buildings.getCapacity('barracks') - Model.state.team.getPeople().length;
			}

			buy()
			{
				Model.state.buyPerson(this.tag);
			}
		}

		abstract class AccessoryItem extends Item
		{
			constructor(public tag: string, public title: string, public description: string, public cost: number)
			{
				super('accessory', tag, title, description, Util.getImage('items', tag), cost);
			}

			getMaxTypeCount()
			{
				return Model.state.buildings.getCapacity('storage') - Model.state.team.getItemCount();
			}
		}

		export class ArmourItem extends AccessoryItem
		{
			constructor(tag: string)
			{
				let data = Data.Armour.Types[tag];
				Util.assert(data != null);
				super(tag, data.name, data.getDescription(), data.cost);
			}

			buy()
			{
				Model.state.buyArmour(this.tag);
			}
		}

		export class WeaponItem extends AccessoryItem
		{
			constructor(tag: string)
			{
				let data = Data.Weapons.Types[tag];
				Util.assert(data != null);
				super(tag, data.name, data.getDescription(), data.cost);
			}

			buy()
			{
				Model.state.buyWeapon(this.tag);
			}
		}
	}
}
