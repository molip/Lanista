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
			tableFactory.addColumnHeader('Image', 20);

			for (let person of Model.state.getPeople())
			{
				let cells = [new Table.TextCell('<h4>' + person.name + '</h4>'), new Table.ImageCell(person.image)];
				tableFactory.addRow(cells, false, null);
			}
		}
	}
}
