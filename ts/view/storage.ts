/// <reference path="page.ts" />

namespace View 
{
	export class StoragePage extends Page
	{
		constructor()
		{
			super('Storage (' + Model.state.team.getItemCount() + '/' + Model.state.buildings.getCapacity('storage') + ')');
			let tableFactory = new Table.Factory();
			this.div.appendChild(tableFactory.makeScroller());

			tableFactory.addColumnHeader('Name', 20);
			tableFactory.addColumnHeader('Image', 10);
			tableFactory.addColumnHeader('Fame', 10);
			tableFactory.addColumnHeader('Type', 60);

			for (let id in Model.state.team.items)
			{
				let item = Model.state.team.items[id];
				let data = Model.state.team.getItemData(id);
				let cells = [new Table.TextCell('<h4>' + data.name + ' </h4>'), new Table.ImageCell(Util.getImage('items', item.tag)), new Table.TextCell(data.fame.toString()), new Table.TextCell(item.type == Model.ItemType.Armour ? 'Armour' : 'Weapon')];

				tableFactory.addRow(cells, false, null);
			}
		}
	}
}
