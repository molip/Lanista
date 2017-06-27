"use strict";

namespace Model
{
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
		getSiteTag(accType: ItemType, speciesData: Data.Species.Type)
		{
			if (accType == ItemType.Armour) // We are our own armour site.
				return this.tag;

			let site = this.getData(speciesData).weaponSite;
			return site ? site.type : null;
		}
	}

	export class Attack
	{
		constructor(public data: Data.Attack, public sourceID: string) { }
	}

	export class Fighter
	{
		bodyParts: { [id: string]: BodyPart } = {};
		nextBodyPartID: number = 1;
		private activity: string = '';
		private experience: { [id: string]: number } = {};

		constructor(public id: number, public species: string, public name: string, public image: string)
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
		}

		static initPrototype(fighter: Fighter)
		{
			if (fighter.species == 'human')
				Util.setPrototype(fighter, Person);
			else
				Util.setPrototype(fighter, Animal);

			fighter.onLoad();
		}

		onLoad()
		{
			for (let id in this.bodyParts)
				Util.setPrototype(this.bodyParts[id], BodyPart);
		}

		isHuman() { return this.species == 'human'; }

		getSpeciesData()
		{
			let type = Data.Species.Types[this.species];
			Util.assert(type != undefined);
			return type;
		}
		
		getStatus()
		{
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
			}
			return rows;
		}

		getAttacks(loadout: Loadout, team: Team)
		{
			let attacks: Attack[] = [];
			let usedBodyParts = new Set<string>();

			for (let itemPos of loadout.itemPositions)
				if (team.getItem(itemPos.id).type == ItemType.Weapon)
				{
					let data = team.getWeaponData(itemPos.id);
					for (let attack of data.attacks)
						attacks.push(new Attack(attack, itemPos.bodyPartIDs[0])); // Just use the first body part for the source. 

					for (let bpid of itemPos.bodyPartIDs)
						usedBodyParts.add(bpid);
				}

			let speciesData = this.getSpeciesData()
			for (let id in this.bodyParts)
			{
				if (usedBodyParts.has(id))
					continue;

				let part = this.bodyParts[id];
				let data = speciesData.bodyParts[part.tag];
				if (data.attack)
					attacks.push(new Attack(data.attack, id)); // TODO: Check body part health.
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

		getBodyPartIDs()
		{
			let ids: string[] = [];
			for (let id in this.bodyParts)
				ids.push(id); // TODO: Check body part health ? 
			return ids;
		}

		chooseRandomBodyPart()
		{
			let targets = this.getBodyPartIDs();
			let targetIndex = Util.getRandomInt(targets.length);
			return targets[targetIndex];
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

		getExperience(tag: string)
		{
			return this.experience[tag] || 0;
		}

		addExperience(tag: string, hours: number)
		{
			this.experience[tag] = this.experience[tag] || 0;
			this.experience[tag] += hours;
		}

		getActivity()
		{
			return this.activity;
		}

		setActivity(tag: string)
		{
			this.activity = tag;
			Model.saveState();
		}
	}
}
