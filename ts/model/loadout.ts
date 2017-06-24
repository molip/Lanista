"use strict";

namespace Model
{
	export class ItemPosition
	{
		constructor(public id: string, public bodyPartIDs: string[])
		{
		}
	}

	export class Loadout
	{
		itemPositions: ItemPosition[] = [];

		constructor(private fighterID: string)
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
				if (team.getItem(itemPos.id).type == itemType)
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
				return;
			}
			Util.assert(false);
		}

		getBodyPartArmourData(bodyPartID: string, team: Team)
		{
			for (let itemPos of this.itemPositions)
			{
				if (team.getItem(itemPos.id).type == ItemType.Armour)
					for (let id of itemPos.bodyPartIDs)
						if (id == bodyPartID)
							return team.getArmourData(itemPos.id);
			}
			return null;
		}
	}
}