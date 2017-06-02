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
		constructor(day: number)
		{
			super('fight', day);
		}

		getDescription()
		{
			return 'Fight (day ' + this.day.toString() + ')';
		}
	}
}
