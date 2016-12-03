/// <reference path="popup.ts" />
"use strict";

namespace View 
{
	export class BarracksPopup extends Popup
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
			tableFactory.addColumnHeader('Armour', 15);
			tableFactory.addColumnHeader('Weapon', 15);

			for (let person of Model.state.getPeople())
			{
				let cells = [new Table.TextCell('<h4>' + person.name + '</h4>'), new Table.ImageCell(person.image)];

				for (let c of Util.formatRows(person.getStatus()))
					cells.push(new Table.TextCell('<small>' + c + '</small>'));

				tableFactory.addRow(cells, false, null);
			}
		}
	}
}
