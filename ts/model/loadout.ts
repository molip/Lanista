"use strict";

namespace Model
{
	export class Loadout
	{
		weapons: Weapon[] = [];
		armour: Armour[] = [];

		constructor()
		{
		}

		onLoad()
		{
			for (let weapon of this.weapons)
				Util.setPrototype(weapon, Weapon);
			for (let armour of this.armour)
				Util.setPrototype(armour, Armour);
		}

		private getAccessories(type: AccessoryType)
		{
			return type == AccessoryType.Weapon ? this.weapons : this.armour;
		}

		private getOccupiedSites(accType: AccessoryType)
		{
			let bodyPartIDs: string[] = [];
			for (let acc of this.getAccessories(accType))
				bodyPartIDs = bodyPartIDs.concat(acc.bodyPartIDs);
			return bodyPartIDs;
		}

		// Returns first available body parts compatible with specified site.
		private findBodyPartsForSite(accType: AccessoryType, site: Data.Site, fighter: Fighter)
		{
			if (site.species != fighter.species)
				return null;

			let bodyPartIDs: string[] = [];

			let occupied = this.getOccupiedSites(accType);
			let speciesData = fighter.getSpeciesData()
			for (let id in fighter.bodyParts)
			{
				let part = fighter.bodyParts[id];
				if (occupied.indexOf(id) < 0)
				{
					if (part.getSiteTag(accType, speciesData) == site.type)
					{
						bodyPartIDs.push(id);
						if (bodyPartIDs.length == site.count)
							return bodyPartIDs;
					}
				}
			}
			return null;
		}

		private findBodyPartsForAccessory(accType: AccessoryType, accTag: string, fighter: Fighter)
		{
			let data = accType == AccessoryType.Weapon ? Data.Weapons.Types[accTag] : Data.Armour.Types[accTag];
			for (let site of data.sites)
			{
				let bodyPartIDs = this.findBodyPartsForSite(accType, site, fighter);
				if (bodyPartIDs)
					return bodyPartIDs;
			}
			return null;
		}

		canAddWeapon(weaponTag: string, fighter: Fighter)
		{
			return !!this.findBodyPartsForAccessory(AccessoryType.Weapon, weaponTag, fighter);
		}

		canAddArmour(armourTag: string, fighter: Fighter)
		{
			return !!this.findBodyPartsForAccessory(AccessoryType.Armour, armourTag, fighter);
		}

		addWeapon(weaponTag: string, fighter: Fighter)
		{
			// TODO: Choose site.
			let bodyPartIDs = this.findBodyPartsForAccessory(AccessoryType.Weapon, weaponTag, fighter);
			if (bodyPartIDs)
			{
				this.weapons.push(new Weapon(weaponTag, bodyPartIDs));
				return;
			}
			Util.assert(false);
		}

		addArmour(armourTag: string, fighter: Fighter)
		{
			// TODO: Choose site.
			let bodyPartIDs = this.findBodyPartsForAccessory(AccessoryType.Armour, armourTag, fighter);
			if (bodyPartIDs)
			{
				this.armour.push(new Armour(armourTag, bodyPartIDs));
				return;
			}
			Util.assert(false);
		}

		getBodyPartArmour(bodyPartID: string)
		{
			for (let armour of this.armour)
				for (let id of armour.bodyPartIDs)
					if (id == bodyPartID)
						return armour;
			return null;
		}
	}
}