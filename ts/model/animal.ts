/// <reference path="fighter.ts" />

namespace Model
{
	export class Animal extends Fighter
	{
		constructor(id: number, tag: string, name: string, fame: number)
		{
			let type = Data.Animals.Types[tag];
			super(id, type.species, name, Util.getImage('animals', tag), fame);
		}

		getHealingRate(fast: boolean)
		{
			return fast ? Data.Misc.AnimalHealingRate : Data.Misc.IdleAnimalHealingRate;
		}
	}
}
