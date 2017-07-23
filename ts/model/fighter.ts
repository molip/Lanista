namespace Model
{
	export class BodyPart
	{
		constructor(public id: string, public tag: string, public index: number) { }

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
		constructor(public data: Data.Attack, public weaponTag: string, public sourceID: string, public skill: number) { }
	}

	export class Fighter
	{
		bodyParts: { [id: string]: BodyPart } = {};
		private skills: { [tag: string]: number } = {}; // +/- percent.
		private nextBodyPartID: number = 1;
		health: number = 0;
		private activity: string = '';
		private experience: { [tag: string]: number } = {};

		constructor(public id: number, public species: string, public name: string, public image: string, public fame: number)
		{
			let data = this.getSpeciesData();
			this.health = data.health;
			for (let tag in data.bodyParts)
			{
				let part = data.bodyParts[tag];
				for (let i = 0; i < part.instances.length; ++i)
				{
					this.bodyParts[this.nextBodyPartID] = new BodyPart(this.nextBodyPartID.toString(), tag, i);
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
		
		getSkills()
		{
			let rows: string[][] = [];
			for (let tag in this.skills)
				rows.push([Data.Skills.Types[tag].name, this.getSkill(tag).toFixed(1)]);

			if (rows.length == 0)
				rows.push(['', '']);

			return rows;
		}

		getAttacks(loadout: Loadout, team: Team)
		{
			let attacks: Attack[] = [];
			let usedBodyParts = new Set<string>();

			for (let itemPos of loadout.itemPositions)
			{
				let item = team.getItem(itemPos.itemID);
				if (item.type == ItemType.Weapon)
				{
					let data = team.getWeaponData(itemPos.itemID);
					for (let attack of data.attacks)
						attacks.push(new Attack(attack, item.tag, itemPos.bodyPartIDs[0], this.getSkill('attack'))); // Just use the first body part for the source.

					for (let bpid of itemPos.bodyPartIDs)
						usedBodyParts.add(bpid);
				}
			}

			let speciesData = this.getSpeciesData()
			for (let id in this.bodyParts)
			{
				if (usedBodyParts.has(id))
					continue;

				let part = this.bodyParts[id];
				let data = speciesData.bodyParts[part.tag];
				if (data.attack)
					attacks.push(new Attack(data.attack, null, id, this.getSkill('attack'))); // TODO: Check body part health.
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
			return this.health <= 0;
		}

		canFight(healthThresholdPercent: number)
		{
			return this.health / this.getSpeciesData().health > healthThresholdPercent / 100;
		}

		resetHealth()
		{
			this.health = this.getSpeciesData().health;
			Model.invalidate();
		}

		addFame(fame: number)
		{
			this.fame += fame;
			Model.invalidate();
		}

		getExperience(tag: string)
		{
			return this.experience[tag] || 0;
		}

		addExperience(tag: string, hours: number)
		{
			this.experience[tag] = this.experience[tag] || 0;
			this.experience[tag] += hours;
			Model.invalidate();
		}

		getActivity()
		{
			return this.activity;
		}

		setActivity(tag: string)
		{
			this.activity = tag;
			Model.invalidate();
		}

		getSkill(tag: string)
		{
			Util.assert(tag in Data.Skills.Types);
			return this.skills[tag] || 0;
		}

		addSkill(tag: string, value: number)
		{
			this.skills[tag] = this.getSkill(tag) + value;
			Model.invalidate();
		}
	}
}
