"use strict";

namespace Model
{
	const minutesPerDay = 60 * 12;

	export enum Phase { Dawn, News, Event, Fight, Day, Dusk }

	export class State
	{
		static readonly key: string = "state.v15"

		private money = 1000;
		phase: Phase = Phase.Dawn;
		buildings = new Buildings.State();
		fight: Fight.State = null;
		fighters: { [id: string]: Fighter } = {};
		news: News[] = [];
		events: Event[] = [];
		nextFighterID = 1;
		time: number = 0; // Minutes.
		speed: number = 1; // Game minutes per second. 

		constructor()
		{
			this.news.push(new News("It's the first day. There will be a fight tomorrow."));
			this.events.push(new FightEvent(1));
		}

		update(seconds: number)
		{
			Util.assert(this.phase == Phase.Day);
			let changed = this.addMinutes(seconds * this.speed);
			Model.saveState();
			return changed;
		}

		skipToNextDay()
		{
			let newTime = (this.getDay() + 1) * minutesPerDay;
			let changed = this.addMinutes(newTime - this.time);
			Model.saveState();
			return changed;
		}

		private addMinutes(minutes: number)
		{
			let oldDay = this.getDay();
			this.time += minutes;
			let hoursPassed = minutes / 60;

			let changed = this.updateActivities(hoursPassed);

			if (this.getDay() > oldDay)
			{
				this.phase = Phase.Dusk;
			}
		}

		isNight() { return this.phase == Phase.Dawn || this.phase == Phase.Dusk; }

		advancePhase()
		{
			switch (this.phase)
			{
				case Phase.Dawn:
					this.phase = Phase.News;
					if (this.news.length == 0)
						this.advancePhase();
					break;
				case Phase.News:
					this.news.length = 0;
					this.phase = Phase.Event;
					if (this.getEventsForToday().length == 0)
						this.advancePhase();
					break;
				case Phase.Event:
					Util.assert(this.fight == null); // Otherwise startFight sets the phase. 
					let today = this.getDay();
					this.events = this.events.filter(e => e.day != today);
					this.phase = Phase.Day;
					break;
				case Phase.Day:
					this.phase = Phase.Dusk;
					break;
				case Phase.Dusk:
					this.phase = Phase.Dawn;
					break;
			}

			Model.saveState();
		}

		getEventsForToday()
		{
			let today = this.getDay();
			return this.events.filter(e => e.day == today);
		}

		updateActivities(hours: number)
		{
			let workPower: { [id: string]: number } = {}; // Activity -> power.
			let workers: { [id: string]: Fighter[] } = {}; // Activity -> workers.

			for (let id in Data.Activities.Types)
			{
				workPower[id] = Data.Activities.Types[id].freeWork;
				workers[id] = [];
			}

			let UpdateExperience = function (activity: string)
			{
				if (activity in workers)
					for (let i = 0, fighter: Fighter; fighter = workers[activity][i]; ++i)
						fighter.addExperience(activity, hours);
			};

			for (let id in this.fighters)
			{
				let fighter = this.fighters[id];
				let activity = fighter.getActivity();
				Util.assert(activity in Data.Activities.Types);
				if (Data.Activities.Types[activity].job)
				{
					workPower[activity] += 1 + fighter.getExperience(activity) * Data.Misc.ExperienceBenefit;
					workers[activity].push(fighter);
				}
				else
				{
					// TODO: Practising, convalescing, recreation
				}
			}

			// Building, training animals, training gladiators, crafting, repairing:

			let redraw = false;

			if ('build' in workPower && this.buildings.update(hours * workPower['build']))
			{
				UpdateExperience('build');
				redraw = true;
			}

			return redraw;
		}

		setSpeed(speed: number)
		{
			if (speed > this.speed)
			{
				this.time = Math.floor(this.time / speed) * speed;
			}
			this.speed = speed;
		}

		getDay()
		{
			return Math.floor(this.time / minutesPerDay);
		}

		getTimeString()
		{
			let dusk = this.phase == Phase.Dusk;

			let days = this.getDay() - (dusk ? 1 : 0);
			let hours = dusk ? 12 : Math.floor((this.time % minutesPerDay) / 60);
			let mins = dusk ? 0 : Math.floor(this.time % 60);

			return 'Day ' + (days + 1).toString() + ' ' + ('00' + (hours + 6)).slice(-2) + ':' + ('00' + mins).slice(-2);
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

		buyAnimal(tag: string)
		{
			Util.assert(tag in Data.Animals.Types);
			this.spendMoney(Data.Animals.Types[tag].cost);
			this.fighters[this.nextFighterID] = new Animal(this.nextFighterID, tag, this.getUniqueFighterName(Data.Animals.Types[tag].name));
			++this.nextFighterID;
			Model.saveState();
		}

		buyPerson(tag: string)
		{
			Util.assert(tag in Data.People.Types);
			this.spendMoney(Data.People.Types[tag].cost);
			this.fighters[this.nextFighterID] = new Person(this.nextFighterID, tag, this.getUniqueFighterName(Data.People.Types[tag].name));
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

		getFighterIDs()
		{
			let ids: string[] = [];
			for (let id in this.fighters)
				ids.push(id);
			return ids;
		}

		startFight(teamA: Fight.Team, teamB: Fight.Team)
		{
			Util.assert(this.fight == null);
			Util.assert(this.phase == Phase.Event);
			this.fight = new Fight.State(teamA, teamB);
			this.phase = Phase.Fight;
			Model.saveState();
		}

		endFight()
		{
			Util.assert(!!this.fight);
			Util.assert(this.time / minutesPerDay == this.getDay()); // Fight must happen at dawn.

			this.fight = null;
			this.time += minutesPerDay; // Skip to tomorrow.
			this.phase = Phase.Dusk;
			Model.saveState();
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

			for (let event of state.events)
				setEventPrototype(event);

			if (state.phase == Phase.Dusk) // Skip it. 
				state.phase = Phase.Dawn;
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