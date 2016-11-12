"use strict";

namespace Model
{
	export const enum FighterType { Person, Animal };
	export class Fighter
	{
		constructor(public id: number, public typeID: string, public type: FighterType, public name: string, public health: number)
		{
		}
	}
}
