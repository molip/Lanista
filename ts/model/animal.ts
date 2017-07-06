/// <reference path="fighter.ts" />

namespace Model
{
	export class Animal extends Fighter
	{
		constructor(id: number, tag: string, name: string)
		{
			let type = Data.Animals.Types[tag];
			super(id, type.species, name, Util.getImage('animals', tag));
		}
	}
}
