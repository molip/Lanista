namespace Model
{
	const minutesPerDay = 60 * 12;

	export enum Phase { Dawn, News, Event, Fight, Day, Dusk }

	export class State
	{
		static readonly key: string = "state.v19";

		private money = Data.Misc.StartingMoney;
		phase: Phase = Phase.Dawn;
		buildings = new Buildings.State();
		team: Team = new Team();
		fight: Fight.State = null;
		news: News[] = [];
		events: Event[] = [];
		time: number = 0; // Minutes.
		speed: number = 1; // Game minutes per second. 

		constructor()
		{
			for (let data of Data.Events.Events)
			{
				let awayData = Util.dynamicCast(data, Data.Events.AwayFightEvent)
				if (awayData)
				{
					const event = new AwayFightEvent(awayData.day, awayData.injuryThreshold, awayData.fameRequired, awayData.name);
					this.news.push(new EventNews(event));
					this.events.push(event);
				}
			}
		}

		onLoad()
		{
			Util.setPrototype(this.buildings, Buildings.State);

			if (this.fight)
			{
				Util.setPrototype(this.fight, Fight.State);
				this.fight.onLoad();
			}

			Util.setPrototype(this.team, Team);
			this.team.onLoad();

			for (let event of this.events)
				Event.initPrototype(event);

			if (this.phase == Phase.Dusk) // Skip it. 
				this.phase = Phase.Dawn;
		}

		update(seconds: number)
		{
			Util.assert(this.phase == Phase.Day);
			let changed = this.addMinutes(seconds * this.speed, true);
			Model.saveState();
			return changed;
		}

		skipToNextDay(doWork: boolean)
		{
			Util.assert(this.phase == Phase.Day || this.phase == Phase.Fight);

			let newTime = (this.getDay() + 1) * minutesPerDay;
			let changed = this.addMinutes(newTime - this.time, doWork);
			this.phase = Phase.Dusk;
			Model.invalidate();
			return changed;
		}

		private addMinutes(minutes: number, doWork: boolean)
		{
			let oldDay = this.getDay();
			this.time += minutes;
			let hoursPassed = minutes / 60;

			let changed = doWork && this.updateActivities(hoursPassed);

			if (this.getDay() > oldDay)
			{
				this.phase = Phase.Dusk;
			}

			Model.invalidate();

			return changed;
		}

		private deleteEventsForToday()
		{
			this.events = this.events.filter(e => e.day != this.getDay());
			Model.invalidate();
		}

		isNight() { return this.phase == Phase.Dawn || this.phase == Phase.Dusk; }

		cancelNight()
		{
			Util.assert(this.isNight());
			this.phase = Phase.Dawn;
			this.advancePhase();
			Model.invalidate();
		}

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
					if (this.getEventsForDay(this.getDay()).length == 0)
						this.advancePhase();
					break;
				case Phase.Event:
					Util.assert(this.fight == null); // Otherwise startFight sets the phase. 
					this.deleteEventsForToday();
					this.phase = Phase.Day;
					break;
				case Phase.Day:
					this.phase = Phase.Dusk;
					break;
				case Phase.Dusk:
					this.phase = Phase.Dawn;
					break;
			}

			Model.invalidate();
		}

		addEvent(event: Event)
		{
			Util.assert(this.getEventsForDay(event.day).length == 0);
			this.events.push(event);
			this.events.sort((a: Event, b: Event) => { return a.day - b.day; });

			Model.invalidate();
		}

		getEventsForDay(day: number)
		{
			return this.events.filter(e => e.day == day);
		}

		updateActivities(hours: number)
		{
			let workPower: { [tag: string]: number } = {}; // Activity -> power.
			let workers: { [tag: string]: Fighter[] } = {}; // Activity -> workers.

			for (let tag in Data.Activities.Types)
			{
				workPower[tag] = Data.Activities.Types[tag].freeWork;
				workers[tag] = [];
			}

			let UpdateExperience = function (activity: string)
			{
				if (activity in workers)
					for (let i = 0, fighter: Fighter; fighter = workers[activity][i]; ++i)
						fighter.addExperience(activity, hours);
			};

			for (let id in this.team.fighters)
			{
				let fighter = this.team.fighters[id];
				let activity = fighter.getActivity();
				Util.assert(activity in Data.Activities.Types);
				if (Data.Activities.Types[activity].job)
				{
					workPower[activity] += 1 + fighter.getExperience(activity) * Data.Misc.ExperienceBenefit;
					workers[activity].push(fighter);
				}
				else
				{
					let parts = activity.split(':');
					if (parts.length == 2 && parts[0] == 'train')
					{
						let skill = parts[1];
						fighter.addSkill(skill, hours * Data.Misc.TrainingRate);
					}

					// TODO: convalescing, recreation
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
			Model.invalidate();
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
			Model.invalidate();
		}

		addMoney(amount: number)
		{
			Util.assert(amount >= 0);
			state.money += amount;
			Model.invalidate();
		}

		buyAnimal(tag: string)
		{
			Util.assert(tag in Data.Animals.Types);
			this.spendMoney(Data.Animals.Types[tag].cost);
			this.team.addAnimal(tag);
			Model.invalidate();
		}

		buyPerson(tag: string)
		{
			Util.assert(tag in Data.People.Types);
			this.spendMoney(Data.People.Types[tag].cost);
			this.team.addPerson(tag);
			Model.invalidate();
		}

		buyArmour(tag: string)
		{
			Util.assert(tag in Data.Armour.Types);
			this.spendMoney(Data.Armour.Types[tag].cost);
			this.team.addItem(ItemType.Armour, tag);
			Model.invalidate();
		}

		buyWeapon(tag: string)
		{
			Util.assert(tag in Data.Weapons.Types);
			this.spendMoney(Data.Weapons.Types[tag].cost);
			this.team.addItem(ItemType.Weapon, tag);
			Model.invalidate();
		}

		startFight(fight: Fight.State)
		{
			Util.assert(this.fight == null);
			Util.assert(this.phase == Phase.Event);
			Util.assert(fight && fight.canStart());
			this.fight = fight;
			this.deleteEventsForToday();
			this.phase = Phase.Fight;
			Model.invalidate();
		}

		endFight()
		{
			Util.assert(!!this.fight);
			Util.assert(this.time % minutesPerDay == 0); // Fight must happen at dawn.

			this.fight = null;
			this.skipToNextDay(false);
			Model.invalidate();
		}
	}

	export let state: State;
	let dirty: boolean = false;

	export function init()
	{
		let str = localStorage.getItem(State.key);
		if (str)
		{
			state = JSON.parse(str);
			Util.setPrototype(state, State);
			state.onLoad()
		}
		else
			resetState();
	}

	export function invalidate()
	{
		dirty = true;
	}

	export function saveState()
	{
		if (dirty)
		{
			localStorage.setItem(State.key, JSON.stringify(state));
			dirty = false;
		}
	}

	export function resetState()
	{
		state = new State();
		localStorage.removeItem(State.key);
		invalidate();
	}
}