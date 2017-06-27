/// <reference path="page.ts" />
"use strict";

namespace View 
{
	export class KennelsPage extends Page
	{
		constructor()
		{
			super('Kennels');
			let tableFactory = new Table.Factory();
			this.div.appendChild(tableFactory.element);

			tableFactory.addColumnHeader('Name', 20);
			tableFactory.addColumnHeader('Image', 30);

			tableFactory.addColumnHeader('Part', 10);
			tableFactory.addColumnHeader('Health', 10);

			for (let animal of Model.state.team.getAnimals())
			{
				let cells = [new Table.TextCell('<h4>' + animal.name + '</h4>'), new Table.ImageCell(animal.image)];

				for (let c of Util.formatRows(animal.getStatus()))
					cells.push(new Table.TextCell('<small>' + c + '</small>'));

				tableFactory.addRow(cells, false, null);
			}
		}
	}
}
