"use strict";

namespace Model
{
	export class Accessory
	{
		constructor(public id: string, public bodyPartIDs: string[])
		{
		}
	}

	export class Weapon extends Accessory
	{
		constructor(id: string, bodyPartIDs: string[])
		{
			super(id, bodyPartIDs);
		}
	}

	export class Armour extends Accessory
	{
		constructor(id: string, bodyPartIDs: string[])
		{
			super(id, bodyPartIDs);
		}
	}
}
