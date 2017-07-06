/// <reference path="fighter.ts" />

namespace Model
{
	export class Person extends Fighter
	{
		constructor(id: number, tag: string, name: string)
		{
			let type = Data.People.Types[tag];
			super(id, 'human', name, Util.getImage('people', tag));
		}
	}
}
