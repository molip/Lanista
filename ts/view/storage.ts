/// <reference path="page.ts" />
"use strict";

namespace View 
{
	export class StoragePage extends Page
	{
		constructor()
		{
			super('Storage');
			let tableFactory = new Table.Factory();
			this.div.appendChild(tableFactory.element);

			tableFactory.addColumnHeader('Name', 20);
			tableFactory.addColumnHeader('Type', 20);

			for (let id in Model.state.team.items)
			{
				let item = Model.state.team.items[id];
				let data = Model.state.team.getItemData(id);
				let cells = [new Table.TextCell(data.name), new Table.TextCell(item.type == Model.ItemType.Armour ? 'Armour' : 'Weapon')];

				tableFactory.addRow(cells, false, null);
			}
		}
	}
}
