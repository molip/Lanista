"use strict";

namespace Model
{
	enum AccessoryType { Weapon, Armour };

	export class BodyPart
	{
		constructor(public id: string, public tag: string, public index: number, public health: number) { }

		getData(speciesData: Data.Species.Type)
		{
			return speciesData.bodyParts[this.tag];
		}

		getInstanceData(speciesData: Data.Species.Type)
		{
			return this.getData(speciesData).instances[this.index];
		}

		// Gets tag of armour or weapon site, if present.
		getSiteTag(accType: AccessoryType, speciesData: Data.Species.Type)
		{
			if (accType == AccessoryType.Armour) // We are our own armour site.
				return this.tag;

			let site = this.getData(speciesData).weaponSite;
			return site ? site.type : null;
		}
	}

	export class Fighter
	{
		bodyParts: { [id: string]: BodyPart } = {};
		nextBodyPartID: number = 1;
		weapons: Weapon[] = [];
		armour: Armour[] = [];
		constructor(public id: number, public species: string, public name: string, public image: string, weapons: string[], armour: string[])
		{
			let data = this.getSpeciesData();
			for (let tag in data.bodyParts)
			{
				let part = data.bodyParts[tag];
				for (let i = 0; i < part.instances.length; ++i)
				{
					this.bodyParts[this.nextBodyPartID] = new BodyPart(this.nextBodyPartID.toString(), tag, i, part.health);
					++this.nextBodyPartID;
				}
			}

			for (let tag of weapons)
				this.addWeapon(tag);

			for (let tag of armour)
				this.addArmour(tag);
		}

		onLoad()
		{
			for (let id in this.bodyParts)
				this.bodyParts[id].__proto__ = BodyPart.prototype;
			for (let weapon of this.weapons)
				weapon.__proto__ = Weapon.prototype;
			for (let armour of this.armour)
				armour.__proto__ = Armour.prototype;
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
			let bodyPartIDs: string[] = [];
			for (let acc of this.getAccessories(accType))
				bodyPartIDs = bodyPartIDs.concat(acc.bodyPartIDs);
			return bodyPartIDs;	
		}

		// Gets available body parts compatible with specified site. 
		getEmptySites(accType: AccessoryType, site: Data.Site)
		{
			if (site.species != this.species)
				return null;

			let bodyPartIDs: string[] = [];

			let occupied = this.getOccupiedSites(accType);
			let speciesData = this.getSpeciesData()
			for (let id in this.bodyParts)
			{
				let part = this.bodyParts[id];
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

		getEmptySitesForAccessory(accType: AccessoryType, accTag: string)
		{
			let data = accType == AccessoryType.Weapon ? Data.Weapons.Types[accTag] : Data.Armour.Types[accTag];
			for (let site of data.sites)
			{
				let bodyPartIDs = this.getEmptySites(accType, site);
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

		getBodyPartArmour(bodyPartID: string)
		{
			for (let armour of this.armour)
				for (let id of armour.bodyPartIDs)
					if (id == bodyPartID)
						return armour;
			return null;
		}

		getStatus()
		{
			// Get armour string for each body part.
			let partArmour: { [id: string]: string } = {};
			for (let armour of this.armour)
			{
				let data = Data.Armour.Types[armour.tag];
				for (let partID of armour.bodyPartIDs)
					partArmour[partID] = data.name + (armour.bodyPartIDs.length > 1 ? '*' : '');
			}

			// Get weapon string for each body part.
			let partWeapons: { [id: string]: string } = {};
			for (let weapon of this.weapons)
			{
				let data = Data.Weapons.Types[weapon.tag];
				for (let partID of weapon.bodyPartIDs)
					partWeapons[partID] = data.name + (weapon.bodyPartIDs.length > 1 ? '*' : '');
			}

			let speciesData = this.getSpeciesData()
			let rows: string[][] = [];
			let status = '';
			for (let id in this.bodyParts)
			{
				let part = this.bodyParts[id];
				let data = speciesData.bodyParts[part.tag];
				let row: string[] = [];
				rows.push(row);
				row.push(part.getInstanceData(speciesData).name);
				row.push(part.health.toString() + '/' + data.health);
				row.push(partArmour[id] ? partArmour[id] : '');
				row.push(partWeapons[id] ? partWeapons[id] : '');
			}
			return rows;
		}

		getAttacks()
		{
			let attacks: Data.Attack[] = [];

			let speciesData = this.getSpeciesData()
			for (let id in this.bodyParts)
			{
				let part = this.bodyParts[id];
				let data = speciesData.bodyParts[part.tag];
				if (data.attack)
					attacks.push(data.attack); // TODO: Check body part health.
			}

			for (let weapon of this.weapons)
			{
				let data = Data.Weapons.Types[weapon.tag];
				attacks = attacks.concat(data.attacks); // TODO: Check body part health.
			}

			return attacks;
		}

		getBodyParts()
		{
			let parts: BodyPart[] = [];
			for (let id in this.bodyParts)
				parts.push(this.bodyParts[id]); // TODO: Check body part health ? 
			return parts;
		}

		isDead()
		{
			for (let id in this.bodyParts)
				if (this.bodyParts[id].health == 0)
					return true;

			return false;
		}

		resetHealth()
		{
			for (let part of this.getBodyParts())
				part.health = part.getData(this.getSpeciesData()).health;
			Model.saveState();
		}
	}
}
