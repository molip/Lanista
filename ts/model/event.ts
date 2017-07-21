namespace Model
{
	export class Event
	{
		constructor(public type: string, public day: number) { }

		static initPrototype(event: Event)
		{
			if (event.type == 'home_fight')
				Util.setPrototype(event, HomeFightEvent);
			else if (event.type == 'away_fight')
				Util.setPrototype(event, AwayFightEvent);
		}

		getDescription() { Util.assert(false); return ''; }
	}

	export class FightEvent extends Event
	{
		constructor(type: string, day: number, public readonly injuryThreshold: number)
		{
			super(type, day);
		}
	}

	export class HomeFightEvent extends FightEvent
	{
		constructor(day: number, injuryThreshold: number)
		{
			super('home_fight', day, injuryThreshold);
		}

		getDescription()
		{
			return "Home Fight";
		}
	}

	export class AwayFightEvent extends FightEvent
	{
		constructor(day: number, injuryThreshold: number, public readonly fameRequired: number, public readonly name: string)
		{
			super('away_fight', day, injuryThreshold);
		}

		getDescription()
		{
			return this.name;
		}

		createNPCSide()
		{
			let team = new Model.Team();
			team.fighters[1] = new Model.Person(0, 'man', "Slapper Nuremberg", 0);
			let loadout = new Model.Loadout('1');
			return new Model.Fight.Side(loadout, team);
		}
	}
}
