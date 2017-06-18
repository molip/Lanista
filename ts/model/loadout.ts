"use strict";

namespace Model
{
	export class Loadout
	{
		weapons: Weapon[] = [];
		armour: Armour[] = [];

		constructor(private fighterID: string)
		{
		}

		onLoad()
		{
			for (let weapon of this.weapons)
				Util.setPrototype(weapon, Weapon);
			for (let armour of this.armour)
				Util.setPrototype(armour, Armour);
		}

		private getFighter(team: Team)
		{
			Util.assert(this.fighterID in team.fighters);
			return team.fighters[this.fighterID];
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
		private findBodyPartsForSite(accType: AccessoryType, site: Data.Site, team: Team)
		{
			let fighter = this.getFighter(team);

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

		private findBodyPartsForAccessory(accType: AccessoryType, accID: string, team: Team)
		{
			let data = accType == AccessoryType.Weapon ? team.getWeaponData(accID) : team.getArmourData(accID);
			for (let site of data.sites)
			{
				let bodyPartIDs = this.findBodyPartsForSite(accType, site, team);
				if (bodyPartIDs)
					return bodyPartIDs;
			}
			return null;
		}

		canAddWeapon(weaponID: string, team: Team)
		{
			return !!this.findBodyPartsForAccessory(AccessoryType.Weapon, weaponID, team);
		}

		canAddArmour(armourID: string, team: Team)
		{
			return !!this.findBodyPartsForAccessory(AccessoryType.Armour, armourID, team);
		}

		addWeapon(weaponID: string, team: Team)
		{
			// TODO: Choose site.
			let bodyPartIDs = this.findBodyPartsForAccessory(AccessoryType.Weapon, weaponID, team);
			if (bodyPartIDs)
			{
				this.weapons.push(new Weapon(weaponID, bodyPartIDs));
				return;
			}
			Util.assert(false);
		}

		addArmour(armourID: string, team: Team)
		{
			// TODO: Choose site.
			let bodyPartIDs = this.findBodyPartsForAccessory(AccessoryType.Armour, armourID, team);
			if (bodyPartIDs)
			{
				this.armour.push(new Armour(armourID, bodyPartIDs));
				return;
			}
			Util.assert(false);
		}

		getBodyPartArmourData(bodyPartID: string, team: Team)
		{
			for (let armour of this.armour)
				for (let id of armour.bodyPartIDs)
					if (id == bodyPartID)
						return team.getArmourData(armour.id);
			return null;
		}
	}
}