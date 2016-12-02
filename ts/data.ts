"use strict";

namespace Data
{
	export class Attack { constructor(public name: string, public type: string, public damage: number) { } }
	export class WeaponSite { constructor(public name: string, public type: string, public replacesAttack: boolean) { } }

	export class Site
	{
		constructor(public type: string, public count: number) { }
	}

	export namespace Armour
	{
		export class Type
		{
			constructor(public name: string, public defense: number, public cost: number, public image: string, public description: string, public sites: Site[]) { }
		}

		export let Types: { [key: string]: Type };
	}

	export namespace Weapons
	{
		export class Type
		{
			constructor(public name: string, public block: number, public cost: number, public image: string, public description: string, public sites: Site[], public attacks: Attack[]) { }
		}
		export let Types: { [key: string]: Type };
	}

	export class BodyPart
	{
		constructor(public health: number, public names: string[], public attack: Attack, public weaponSite: WeaponSite) { }
	}

	export namespace Species
	{
		export class Type
		{
			bodyParts: { [key: string]: BodyPart };
			constructor(public name: string) { }
		}
		export let Types: { [key: string]: Type };
	}

	export namespace Animals
	{
		export class Type
		{
			constructor(public cost: number, public shopImage: string, public species: string, public name: string, public description: string, public armour: string[], public weapons: string[]) { }
		}
		export let Types: { [key: string]: Type };
	}

	export namespace People
	{
		export class Type
		{
			constructor(public cost: number, public shopImage: string, public name: string, public description: string, public armour: string[], public weapons: string[]) { }
		}
		export let Types: { [key: string]: Type };
	}

	export namespace Buildings
	{
		export class Level { constructor(public cost: number, public buildTime: number, public mapX: number, public mapY: number, public mapImage: string, public shopImage: string, public name: string, public description: string) { } }
		export let Levels: { [key: string]: Level[]; }

		export function getLevel(id: string, index: number): Level
		{
			Util.assert(id in Levels);
			return index >= 0 && index < Levels[id].length ? Levels[id][index] : null;
		}
	}

	export namespace Misc
	{
		export let TownTrigger: { mapX: number, mapY: number, mapImage: string };
		export let LudusBackgroundImage: string;
		export let ConstructionImage: string
	}
}