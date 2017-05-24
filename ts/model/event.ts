"use strict";

namespace Model
{
	export function setEventPrototype(e: Event)
	{
		if (e.type == 'fight')
			e.__proto__ = FightEvent.prototype;
	}

	export class Event
	{
		constructor(public type: string, public day: number) { }

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
