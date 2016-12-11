"use strict";

namespace Model
{
	export class State
	{
		static key: string = "state.v6"
		private money: number;
		buildings: Buildings.State;
		fight: Fight.State;
		fighters: { [id: string]: Fighter };
		nextFighterID: number;

		constructor()
		{
			this.money = 1000;
			this.buildings = new Buildings.State();
			this.fight = null;
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

		startFight(teamA: Fight.Team, teamB: Fight.Team)
		{
			Util.assert(this.fight == null);
			this.fight = new Fight.State(teamA, teamB);
		}

		endFight()
		{
			Util.assert(this.fight && this.fight.finished);
			this.fight = null;
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
			if (state.fight)
				state.fight.__proto__ = Fight.State.prototype;

			for (let id in state.fighters)
			{
				let fighter = state.fighters[id];
				if (fighter.species == 'human')
					fighter.__proto__ = Person.prototype;
				else
					fighter.__proto__ = Animal.prototype;

				fighter.onLoad();
			}
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