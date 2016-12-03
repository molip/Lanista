/// <reference path="fighter.ts" />

"use strict";

namespace Model
{
	export class Person extends Fighter
	{
		constructor(id: number, tag: string)
		{
			let type = Data.People.Types[tag];
			super(id, 'human', type.name, type.shopImage, type.weapons, type.armour);
		}
	}
}
