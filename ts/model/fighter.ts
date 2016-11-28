"use strict";

namespace Model
{
	export class BodyPart
	{
		constructor(public tag: string, public index: number, public health: number) { }
	}

	export class Fighter
	{
		bodyParts: BodyPart[] = []; // Sparse.
		constructor(public id: number, public species: string, public name: string, public image: string)
		{
			let data = this.getSpeciesData();
			for (let tag in data.bodyParts)
			{
				let part = data.bodyParts[tag];
				for (let i = 0, partName = ''; partName = part.names[i]; ++i)
					this.bodyParts.push(new BodyPart(tag, i, part.health));
			}
			}
		}

		isHuman() { return this.species == 'human'; }

		getSpeciesData()
		{
			let type = Data.Species.Types[this.species];
			Util.assert(type != undefined);
			return type;
		}
	}
}
