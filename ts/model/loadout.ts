namespace Model
{
	export class ItemPosition
	{
		constructor(public itemID: string, public bodyPartIDs: string[])
		{
		}
	}

	export class Loadout
	{
		itemPositions: ItemPosition[] = [];

		constructor(public fighterID: string)
		{
		}

		onLoad()
		{
		}

		private getFighter(team: Team)
		{
			Util.assert(this.fighterID in team.fighters);
			return team.fighters[this.fighterID];
		}

		private getOccupiedSites(itemType: ItemType, team: Team)
		{
			let bodyPartIDs: string[] = [];
			for (let itemPos of this.itemPositions)
				if (team.getItem(itemPos.itemID).type == itemType)
					bodyPartIDs = bodyPartIDs.concat(itemPos.bodyPartIDs);
			return bodyPartIDs;
		}

		// Returns first available body parts compatible with specified site.
		private findBodyPartsForSite(accType: ItemType, site: Data.Site, team: Team)
		{
			let fighter = this.getFighter(team);

			if (site.species != fighter.species)
				return null;

			let bodyPartIDs: string[] = [];

			let occupied = this.getOccupiedSites(accType, team);
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

		private findBodyPartsForItem(itemID: string, team: Team)
		{
			let data = team.getItemData(itemID);
			for (let site of data.sites)
			{
				let bodyPartIDs = this.findBodyPartsForSite(team.getItem(itemID).type, site, team);
				if (bodyPartIDs)
					return bodyPartIDs;
			}
			return null;
		}

		canAddItem(itemID: string, team: Team)
		{
			return !!this.findBodyPartsForItem(itemID, team);
		}

		addItem(itemID: string, team: Team)
		{
			// TODO: Choose site.
			let bodyPartIDs = this.findBodyPartsForItem(itemID, team);
			if (bodyPartIDs)
			{
				this.itemPositions.push(new ItemPosition(itemID, bodyPartIDs));
				Model.invalidate();
				return;
			}
			Util.assert(false);
		}

		removeItem(itemID: string)
		{
			for (let i = 0, itemPos: ItemPosition; itemPos = this.itemPositions[i]; ++i)
				if (itemPos.itemID == itemID)
				{
					this.itemPositions.splice(i, 1);
					Model.invalidate();
					return;
				}

			Util.assert(false);
		}

		hasItemID(id: string)
		{
			for (let itemPos of this.itemPositions)
				if (itemPos.itemID == id)
					return true;

			return false;
		}

		getBodyPartArmourData(bodyPartID: string, team: Team)
		{
			for (let itemPos of this.itemPositions)
			{
				if (team.getItem(itemPos.itemID).type == ItemType.Armour)
					for (let id of itemPos.bodyPartIDs)
						if (id == bodyPartID)
							return team.getArmourData(itemPos.itemID);
			}
			return null;
		}
	}
}