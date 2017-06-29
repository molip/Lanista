"use strict";

namespace Model
{
	export enum ItemType { Weapon, Armour };

	export class Item
	{
		constructor(public type: ItemType, public tag: string) { }
	}

	export class Team 
	{
		fighters: { [id: string]: Fighter } = {};
		items: { [id: string]: Item } = {};
		nextFighterID = 1;
		nextItemID = 1;

		constructor()
		{
		}

		onLoad()
		{
			for (let id in this.fighters)
			{
				let fighter = this.fighters[id];
				Fighter.initPrototype(fighter);
				fighter.onLoad();
			}
		}

		addAnimal(tag: string)
		{
			Util.assert(tag in Data.Animals.Types);
			this.fighters[this.nextFighterID] = new Animal(this.nextFighterID, tag, this.getUniqueFighterName(Data.Animals.Types[tag].name));
			++this.nextFighterID;
		}

		addPerson(tag: string)
		{
			Util.assert(tag in Data.People.Types);
			this.fighters[this.nextFighterID] = new Person(this.nextFighterID, tag, this.getUniqueFighterName(Data.People.Types[tag].name));
			++this.nextFighterID;
		}

		addItem(type: ItemType, tag: string)
		{
			let data = type == ItemType.Armour ? Data.Armour.Types : Data.Weapons.Types;
			Util.assert(tag in data);
			this.items[this.nextItemID] = new Item(type, tag);
			++this.nextItemID;
		}

		getPeople()
		{
			let people: Person[] = [];
			for (let id in this.fighters)
				if (this.fighters[id] instanceof Person)
					people.push(this.fighters[id]);
			return people;
		}

		getAnimals()
		{
			let animals: Animal[] = [];
			for (let id in this.fighters)
				if (this.fighters[id] instanceof Animal)
					animals.push(this.fighters[id]);
			return animals;
		}

		getFighterIDs()
		{
			let ids: string[] = [];
			for (let id in this.fighters)
				ids.push(id);
			return ids;
		}

		getItem(id: string)
		{
			Util.assert(id in this.items);
			return this.items[id];
		}

		getItemData(id: string)
		{
			let item = this.getItem(id);
			let data = item.type == ItemType.Armour ? Data.Armour.Types : Data.Weapons.Types;
			Util.assert(item.tag in data);
			return data[item.tag];
		}

		getArmourData(id: string)
		{
			let data = this.getItemData(id) as Data.Armour.Type;
			Util.assert(data != null);
			return data;
		}

		getWeaponData(id: string)
		{
			let data = this.getItemData(id) as Data.Weapons.Type;
			Util.assert(data != null);
			return data;
		}

		private getUniqueFighterName(name: string)
		{
			let find = (name: string) =>
			{
				for (let id in this.fighters)
					if (this.fighters[id].name == name)
						return true;
				return false;
			}

			let tryName = '';

			let i = 1;
			while (true)
			{
				let tryName = name + ' ' + i.toString();
				if (!find(tryName))
					return tryName;
				++i;
			}
		}
	}
}
