"use strict";

namespace Data
{
	export class Attack { constructor(public name: string, public type: string, public damage: number) { } }
	export class WeaponSite { constructor(public name: string, public type: string, public replacesAttack: boolean) { } }

	export class Site
	{
		constructor(public species: string, public type: string, public count: number) { }
	}

	export namespace Armour
	{
		export class Type
		{
			constructor(public name: string, public defense: number, public cost: number, public image: string, public description: string, public sites: Site[]) { }
			validate()
			{
				for (let site of this.sites)
				{
					let speciesData = Species.Types[site.species];
					if (!(speciesData && speciesData.bodyParts && speciesData.bodyParts[site.type]))
						console.log('Armour: "%s" site references unknown body part "%s/%s"', this.name, site.species, site.type);
				}
			}
		}

		export let Types: { [key: string]: Type };
	}

	export namespace Weapons
	{
		export class Type
		{
			constructor(public name: string, public block: number, public cost: number, public image: string, public description: string, public sites: Site[], public attacks: Attack[]) { }
			validate()
			{
				for (let site of this.sites)
				{
					let found = false;
					let speciesData = Species.Types[site.species];
					if (speciesData)
					{
						for (let id in speciesData.bodyParts)
						{
							let weaponSite = speciesData.bodyParts[id].weaponSite;
							if (weaponSite && weaponSite.type == site.type)
							{
								found = true;
								break;
							}
						}
					}
					if (!found) 
						console.log('Weapon: "%s" site references unknown weapon site "%s/%s"', this.name, site.species, site.type);
				}
			}
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
			validate()
			{
				if (!Species.Types[this.species])
					console.log('Animal: "%s" references unknown species "%s"', this.name, this.species);

				if (!Species.Types[this.species].bodyParts)
					console.log('Animal: "%s" has no body parts', this.name);

				for (let weapon of this.weapons)
					if (!Weapons.Types[weapon])
						console.log('Animal: "%s" references unknown weapon "%s"', this.name, weapon);

				for (let armour of this.armour)
					if (!Armour.Types[armour])
						console.log('Animal: "%s" references unknown armour "%s"', this.name, armour);
			}
		}
		export let Types: { [key: string]: Type };
	}

	export namespace People
	{
		export class Type
		{
			constructor(public cost: number, public shopImage: string, public name: string, public description: string, public armour: string[], public weapons: string[]) { }
			validate()
			{
				for (let weapon of this.weapons)
					if (!Weapons.Types[weapon])
						console.log('People: "%s" references unknown weapon "%s"', this.name, weapon);

				for (let armour of this.armour)
					if (!Armour.Types[armour])
						console.log('People: "%s" references unknown armour "%s"', this.name, armour);
			}
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

	export function validate()
	{
		console.log('Validating data...');

		for (let id in Armour.Types)
			Armour.Types[id].validate();
		for (let id in Weapons.Types)
			Weapons.Types[id].validate();
		for (let id in Animals.Types)
			Animals.Types[id].validate();
		for (let id in People.Types)
			People.Types[id].validate();

		console.log('Validating finished.');
	}

	export namespace Misc
	{
		export let TownTrigger: { mapX: number, mapY: number, mapImage: string };
		export let LudusBackgroundImage: string;
		export let ConstructionImage: string
	}
}