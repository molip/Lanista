/// <reference path="page.ts" />

namespace View 
{
	export class KennelsPage extends Page
	{
		constructor()
		{
			super('Kennels (' + Model.state.team.getAnimals().length + '/' + Model.state.buildings.getCapacity('kennels') + ')');
			let tableFactory = new Table.Factory();
			this.div.appendChild(tableFactory.makeScroller());

			tableFactory.addColumnHeader('Name', 20);
			tableFactory.addColumnHeader('Image', 30);

			tableFactory.addColumnHeader('Health', 10);
			tableFactory.addColumnHeader('Fame', 10);

			for (let animal of Model.state.team.getAnimals())
			{
				let cells: Table.Cell[] = [];
				cells.push(new Table.TextCell('<h4>' + animal.name + '</h4>'));
				cells.push(new Table.ImageCell(animal.image));
				cells.push(new Table.TextCell(animal.health.toString() + '/' + animal.getSpeciesData().health));
				cells.push(new Table.TextCell(animal.fame.toString()));

				tableFactory.addRow(cells, false, null);
			}
		}
	}
}
