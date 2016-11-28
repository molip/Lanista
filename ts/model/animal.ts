/// <reference path="fighter.ts" />

"use strict";

namespace Model
{
	export class Animal extends Fighter
	{
		constructor(id: number, tag: string)
		{
			let type = Data.Animals.Types[tag];
			super(id, type.species, type.name, type.shopImage);
		}
	}
}
