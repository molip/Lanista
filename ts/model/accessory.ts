"use strict";

namespace Model
{
	export class Accessory
	{
		constructor(public tag: string, public bodyPartIDs: string[])
		{
		}
	}

	export class Weapon extends Accessory
	{
		constructor(tag: string, bodyPartIDs: string[])
		{
			super(tag, bodyPartIDs);
		}
	}

	export class Armour extends Accessory
	{
		constructor(tag: string, bodyPartIDs: string[])
		{
			super(tag, bodyPartIDs);
		}
	}
}
