namespace Data
{
	export class Attack { constructor(public readonly name: string, public readonly type: string, public readonly damage: number) { } }
	export class WeaponSite { constructor(public readonly name: string, public readonly type: string, public readonly replacesAttack: boolean) { } }

	export class Site
	{
		constructor(public readonly species: string, public readonly type: string, public readonly count: number) { }
	}

	export namespace Armour
	{
		export class Type
		{
			constructor(public readonly name: string, public readonly cost: number, public readonly fame: number, public readonly description: string, public readonly sites: Site[], public readonly defence: { [key: string]: number }) { }
			validate()
			{
				for (let site of this.sites)
				{
					let speciesData = Species.Types[site.species];
					if (!(speciesData && speciesData.bodyParts && speciesData.bodyParts[site.type]))
						console.log('Armour: "%s" site references unknown body part "%s/%s"', this.name, site.species, site.type);
				}
			}

			getDefense(attackType: string)
			{
				return this.defence[attackType] ? this.defence[attackType] : 0;
			}

			getDescription()
			{
				return this.description + ' (fame: ' + this.fame + ')';
			}
		}

		export let Types: { [key: string]: Type };
	}

	export namespace Weapons
	{
		export class Type
		{
			constructor(public readonly name: string, public readonly block: number, public readonly cost: number, public readonly fame: number, public readonly description: string, public readonly sites: Site[], public readonly attacks: Attack[]) { }
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

			getDescription()
			{
				return this.description + ' (fame: ' + this.fame + ')';
			}
		}
		export let Types: { [key: string]: Type };
	}

	export class BodyPartInstance
	{
		constructor(public readonly name: string, public readonly x: number, public readonly y: number) { }
	}

	export class BodyPart
	{
		constructor(public readonly attack: Attack, public readonly instances: BodyPartInstance[], public readonly weaponSite: WeaponSite = null) { }
	}

	export namespace Species
	{
		export class Type
		{
			bodyParts: { [key: string]: BodyPart };
			constructor(public readonly name: string, public readonly health: number) { }
		}
		export let Types: { [key: string]: Type };
	}

	export namespace Animals
	{
		export class Type
		{
			constructor(public readonly cost: number, public readonly fame: number, public readonly species: string, public readonly name: string, public readonly description: string) { }
			validate()
			{
				if (!Species.Types[this.species])
					console.log('Animal: "%s" references unknown species "%s"', this.name, this.species);

				if (!Species.Types[this.species].bodyParts)
					console.log('Animal: "%s" has no body parts', this.name);
			}

			getDescription()
			{
				return this.description + ' (fame: ' + this.fame + ')';
			}
		}
		export let Types: { [key: string]: Type };
	}

	export namespace People
	{
		export class Type
		{
			constructor(public readonly cost: number, public readonly fame: number, public readonly name: string, public readonly description: string) { }
			validate()
			{
			}

			getDescription()
			{
				return this.description + ' (fame: ' + this.fame + ')';
			}
		}
		export let Types: { [key: string]: Type };
	}

	export namespace Buildings
	{
		export class Level { constructor(public cost: number, public buildTime: number, public mapX: number, public mapY: number, public capacity: number, public name: string, public description: string) { } }
		export let Levels: { [key: string]: Level[]; }

		export function getLevel(tag: string, index: number): Level
		{
			Util.assert(tag in Levels);
			return index >= 0 && index < Levels[tag].length ? Levels[tag][index] : null;
		}
	}

	export namespace Activities
	{
		export class Type
		{
			constructor(public name: string, public job: boolean, public human: boolean, public animal: boolean, public freeWork: number) { }
		}
		export let Types: { [key: string]: Type };
	}

	export namespace Events
	{
		export class Event
		{
			constructor(public day: number, public home: boolean, public name?: string) { }
		}

		export let Events: Event[];
	}

	export function validate()
	{
		console.log('Validating data...');

		for (let tag in Armour.Types)
			Armour.Types[tag].validate();
		for (let tag in Weapons.Types)
			Weapons.Types[tag].validate();
		for (let tag in Animals.Types)
			Animals.Types[tag].validate();
		for (let tag in People.Types)
			People.Types[tag].validate();

		console.log('Validating finished.');
	}

	export namespace Skills
	{
		export class Type
		{
			constructor(public name: string) { }
		}

		export let Types: { [key: string]: Type };
	}

	export namespace Misc
	{
		export let TownTrigger: { mapX: number, mapY: number};
		export let LudusBackgroundImage: string;
		export let ConstructionImage: string
		export let FightBackgroundImage: string;
		export let ExperienceBenefit: number;
		export let TrainingRate: number;
		export let StartingMoney: number;
		export let BaseAttackSkill: number;
	}
}
