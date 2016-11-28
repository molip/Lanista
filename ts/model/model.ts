"use strict";

namespace Model
{
	export class State
	{
		static key: string = "state.v4"
		private money: number;
		buildings: Buildings.State;
		fighters: { [id: string]: Fighter };
		nextFighterID: number;

		constructor()
		{
			this.money = 1000;
			this.buildings = new Buildings.State();
			this.fighters = {};
			this.nextFighterID = 1;
		}

		update(seconds: number)
		{
			let changed = this.buildings.update(seconds);
			Model.saveState();
			return changed;
		}

		getMoney(): number { return state.money; }

		spendMoney(amount: number) 
		{
			Util.assert(amount >= 0 && state.money >= amount);
			state.money -= amount;
			Model.saveState();
		}

		addMoney(amount: number)
		{
			Util.assert(amount >= 0);
			state.money += amount;
			Model.saveState();
		}

		buyAnimal(typeID: string)
		{
			Util.assert(typeID in Data.Animals.Types);
			this.spendMoney(Data.Animals.Types[typeID].cost);
			this.fighters[this.nextFighterID] = new Animal(this.nextFighterID, typeID);
			++this.nextFighterID;
			Model.saveState();
		}

		buyPerson(typeID: string)
		{
			Util.assert(typeID in Data.People.Types);
			this.spendMoney(Data.People.Types[typeID].cost);
			this.fighters[this.nextFighterID] = new Person(this.nextFighterID, typeID);
			++this.nextFighterID;
			Model.saveState();
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
	}

	export let state: State;

	export function init()
	{
		let str = localStorage.getItem(State.key);
		if (str)
		{
			state = JSON.parse(str);
			state.__proto__ = State.prototype;
			state.buildings.__proto__ = Buildings.State.prototype;

			for (let id in state.fighters)
				if (state.fighters[id].species == 'human')
					state.fighters[id].__proto__ = Person.prototype;
				else
					state.fighters[id].__proto__ = Animal.prototype;
		}
		else
			resetState();
	}

	export function saveState()
	{
		localStorage.setItem(State.key, JSON.stringify(state));
	}

	export function resetState()
	{
		state = new State();
		localStorage.removeItem(State.key);
	}
}