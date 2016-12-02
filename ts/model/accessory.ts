"use strict";

namespace Model
{
	export class Accessory
	{
		constructor(public tag: string, public bodyPartIDs: number[])
		{
		}
	}

	export class Weapon extends Accessory
	{
		constructor(tag: string, bodyPartIDs: number[])
		{
			super(tag, bodyPartIDs);
		}
	}

	export class Armour extends Accessory
	{
		constructor(tag: string, bodyPartIDs: number[])
		{
			super(tag, bodyPartIDs);
		}
	}
}
