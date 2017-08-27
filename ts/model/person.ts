/// <reference path="fighter.ts" />

namespace Model
{
	export class Person extends Fighter
	{
		constructor(id: number, tag: string, name: string, fame: number)
		{
			let type = Data.People.Types[tag];
			super(id, 'human', name, Util.getImage('people', tag), fame);
		}

		getHealingRate(fast: boolean)
		{
			return fast ? Data.Misc.HumanHealingRate : Data.Misc.IdleHumanHealingRate;
		}
	}
}
