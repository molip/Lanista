/// <reference path="page.ts" />
"use strict";

namespace View 
{
	export class BarracksPage extends Page
	{
		constructor()
		{
			super('Barracks');
			let tableFactory = new Table.Factory();
			this.div.appendChild(tableFactory.element);

			tableFactory.addColumnHeader('Name', 20);
			tableFactory.addColumnHeader('Image', 30);

			tableFactory.addColumnHeader('Part', 10);
			tableFactory.addColumnHeader('Health', 10);
			tableFactory.addColumnHeader('Armour', 10);
			tableFactory.addColumnHeader('Weapon', 10);
			tableFactory.addColumnHeader('Activity', 10);

			const activityItems: Table.SelectCellItem[] = [];
			for (let id in Data.Activities.Types)
				activityItems.push(new Table.SelectCellItem(id, Data.Activities.Types[id].name));

			for (let person of Model.state.getPeople())
			{
				let cells: Table.Cell[] = [new Table.TextCell('<h4>' + person.name + '</h4>'), new Table.ImageCell(person.image)];

				for (let c of Util.formatRows(person.getStatus()))
					cells.push(new Table.TextCell('<small>' + c + '</small>'));

				let cell = new Table.SelectCell(100, activityItems, (value: string) => { person.setActivity(value); });
				cell.selectedTag = person.getActivity();
				cells.push(cell);

				tableFactory.addRow(cells, false, null);
			}
		}
	}
}
