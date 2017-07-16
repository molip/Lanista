/// <reference path="page.ts" />

namespace View 
{
	export class BarracksPage extends Page
	{
		constructor()
		{
			super('Barracks (' + Model.state.team.getPeople().length + '/' + Model.state.buildings.getCapacity('barracks') + ')');
			let tableFactory = new Table.Factory();
			this.div.appendChild(tableFactory.element);

			tableFactory.addColumnHeader('Name', 20);
			tableFactory.addColumnHeader('Image', 30);

			tableFactory.addColumnHeader('Health', 10);
			tableFactory.addColumnHeader('Fame', 10);
			tableFactory.addColumnHeader('Skills', 10);
			tableFactory.addColumnHeader('Activity', 10);

			const activityItems: Table.SelectCellItem[] = [];
			for (let id in Data.Activities.Types)
				activityItems.push(new Table.SelectCellItem(id, Data.Activities.Types[id].name));

			for (let person of Model.state.team.getPeople())
			{
				let cells: Table.Cell[] = [];
				cells.push(new Table.TextCell('<h4>' + person.name + '</h4>'));
				cells.push(new Table.ImageCell(person.image));
				cells.push(new Table.TextCell(person.health.toString() + '/' + person.getSpeciesData().health));
				cells.push(new Table.TextCell(person.fame.toString()));

				for (let c of Util.formatRows(person.getSkills()))
					cells.push(new Table.TextCell('<small>' + c + '</small>'));

				let cell = new Table.SelectCell(100, activityItems, (value: string) => { person.setActivity(value); });
				cell.selectedTag = person.getActivity();
				cells.push(cell);

				tableFactory.addRow(cells, false, null);
			}
		}
	}
}
