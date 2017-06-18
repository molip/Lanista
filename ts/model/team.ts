"use strict";

namespace Model
{
	export class Item
	{
		constructor(public tag: string) { }
	}

	export class Team 
	{
		fighters: { [id: string]: Fighter } = {};
		weapons: { [id: string]: Item } = {};
		armour: { [id: string]: Item } = {};
		nextFighterID = 1;
		nextWeaponID = 1;
		nextArmourID = 1;

		constructor()
		{
			this.addArmour('chestplate');
			this.addArmour('helmet');
			this.addArmour('leg bits');
			this.addArmour('arm bits');

			this.addWeapon('halberd');
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

		addWeapon(tag: string)
		{
			Util.assert(tag in Data.Weapons.Types);
			this.weapons[this.nextWeaponID] = new Item(tag);
			++this.nextWeaponID;
		}

		addArmour(tag: string)
		{
			Util.assert(tag in Data.Armour.Types);
			this.armour[this.nextArmourID] = new Item(tag);
			++this.nextArmourID;
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

		getWeaponData(id: string)
		{
			Util.assert(id in this.weapons);
			Util.assert(this.weapons[id].tag in Data.Weapons.Types);
			return Data.Weapons.Types[this.weapons[id].tag];
		}

		getArmourData(id: string)
		{
			Util.assert(id in this.armour);
			Util.assert(this.armour[id].tag in Data.Armour.Types);
			return Data.Armour.Types[this.armour[id].tag];
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
