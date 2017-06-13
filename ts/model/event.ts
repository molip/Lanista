"use strict";

namespace Model
{
	export class Event
	{
		constructor(public type: string, public day: number) { }

		static initPrototype(event: Event)
		{
			if (event.type == 'fight')
				Util.setPrototype(event, FightEvent);
		}

		getDescription() { Util.assert(false); return ''; }
	}

	export class FightEvent extends Event
	{
		constructor(day: number, public home: boolean, public name?: string)
		{
			super('fight', day);
		}

		getDescription()
		{
			return this.home ? "Home Fight" : this.name; // TODO: Specialise classes.
		}

		createNPCSide()
		{
			Util.assert(!this.home);
			let team = new Model.Team();
			team.fighters[1] = new Model.Person(0, 'man', "Slapper Nuremberg");
			return new Model.Fight.Side('1', team);
		}
	}
}
