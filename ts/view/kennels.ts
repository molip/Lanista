/// <reference path="popup.ts" />
"use strict";

namespace View 
{
	export class KennelsPopup extends Popup
	{
		constructor()
		{
			super('Kennels');
			let tableFactory = new Table.Factory();
			this.div.appendChild(tableFactory.element);

			tableFactory.addColumnHeader('Name', 20);
			tableFactory.addColumnHeader('Image', 20);

			for (let animal of Model.state.getAnimals())
			{
				let cells = [new Table.TextCell('<h4>' + animal.name + '</h4>'), new Table.ImageCell(animal.image)];
				tableFactory.addRow(cells, false, null);
			}
		}
	}
}
