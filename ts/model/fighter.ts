"use strict";

namespace Model
{
	enum AccessoryType { Weapon, Armour };

	export class BodyPart
	{
		constructor(public tag: string, public index: number, public health: number) { }

		getSiteTag(accType: AccessoryType, speciesData: Data.Species.Type)
		{
			if (accType == AccessoryType.Armour) // We are our own armour site.
				return this.tag;

			let site = speciesData.bodyParts[this.tag].weaponSite;
			return site ? site.type : null;
		}
	}

	export class Fighter
	{
		bodyParts: BodyPart[] = []; // Sparse.
		weapons: Weapon[] = [];
		armour: Armour[] = [];
		constructor(public id: number, public species: string, public name: string, public image: string, weapons: string[], armour: string[])
		{
			let data = this.getSpeciesData();
			for (let tag in data.bodyParts)
			{
				let part = data.bodyParts[tag];
				for (let i = 0, partName = ''; partName = part.names[i]; ++i)
					this.bodyParts.push(new BodyPart(tag, i, part.health));
			}

			for (let tag of weapons)
				this.addWeapon(tag);

			for (let tag of armour)
				this.addArmour(tag);
		}

		isHuman() { return this.species == 'human'; }

		getAccessories(type: AccessoryType)
		{
			return type == AccessoryType.Weapon ? this.weapons : this.armour;
		}

		getSpeciesData()
		{
			let type = Data.Species.Types[this.species];
			Util.assert(type != undefined);
			return type;
		}
		
		getOccupiedSites(accType: AccessoryType) 
		{
			let bodyPartIDs: number[] = [];
			for (let acc of this.getAccessories(accType))
				bodyPartIDs = bodyPartIDs.concat(acc.bodyPartIDs);
			return bodyPartIDs;	
		}

		getEmptySites(accType: AccessoryType, siteTag: string, required: number)
		{
			let bodyPartIDs: number[] = [];

			let occupied = this.getOccupiedSites(accType);
			let speciesData = this.getSpeciesData()
			for (let i = 0; i < this.bodyParts.length; ++i)
			{
				let part = this.bodyParts[i];
				if (part && occupied.indexOf(i) < 0)
				{
					if (part.getSiteTag(accType, speciesData) == siteTag)
					{
						bodyPartIDs.push(i);
						if (bodyPartIDs.length == required)
							return bodyPartIDs;
					}
				}
			}
			return null;
		}

		getEmptySitesForAccessory(accType: AccessoryType, accTag: string)
		{
			let data = accType == AccessoryType.Weapon ? Data.Weapons.Types[accTag] : Data.Armour.Types[accTag];
			for (let site of data.sites)
			{
				let bodyPartIDs = this.getEmptySites(accType, site.type, site.count);
				if (bodyPartIDs)
					return bodyPartIDs;
			}
			return null;
		}

		canAddWeapon(weaponTag: string)
		{
			return !!this.getEmptySitesForAccessory(AccessoryType.Weapon, weaponTag);
		}

		canAddArmour(armourTag: string)
		{
			return !!this.getEmptySitesForAccessory(AccessoryType.Armour, armourTag);
		}

		addWeapon(weaponTag: string)
		{
			// TODO: Choose site.
			let bodyPartIDs = this.getEmptySitesForAccessory(AccessoryType.Weapon, weaponTag);
			if (bodyPartIDs)
			{
				this.weapons.push(new Weapon(weaponTag, bodyPartIDs));
				return;
			}
			Util.assert(false);
		}

		addArmour(armourTag: string)
		{
			// TODO: Choose site.
			let bodyPartIDs = this.getEmptySitesForAccessory(AccessoryType.Armour, armourTag);
			if (bodyPartIDs)
			{
				this.armour.push(new Armour(armourTag, bodyPartIDs));
				return;
			}
			Util.assert(false);
		}
	}
}
