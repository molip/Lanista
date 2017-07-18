/// <reference path="page.ts" />

namespace View 
{
	export class HomePage extends Page
	{
		private homeButton: HTMLButtonElement;
		private awayButton: HTMLButtonElement;
		private bottomDiv: HTMLDivElement;

		constructor()
		{
			super('Home');

			let topDiv = document.createElement('div');
			topDiv.className = 'top_section';

			this.bottomDiv = document.createElement('div');
			this.bottomDiv.className = 'bottom_section';

			this.homeButton = document.createElement('button');
			this.homeButton.addEventListener('click', this.onAddHomeFight);
			this.homeButton.innerText = 'Add Home Fight';

			this.awayButton = document.createElement('button');
			this.awayButton.addEventListener('click', this.onAddAwayFight);
			this.awayButton.innerText = 'Add Away Fight';

			topDiv.appendChild(this.homeButton);
			topDiv.appendChild(this.awayButton);

			this.div.appendChild(topDiv);
			this.div.appendChild(this.bottomDiv);

			this.update();
		}

		private onAddHomeFight = () =>
		{
			Model.state.addEvent(new Model.HomeFightEvent(Model.state.getDay() + 1));
			this.update();
		}

		private onAddAwayFight = () =>
		{
			Model.state.addEvent(new Model.AwayFightEvent(Model.state.getDay() + 1, 0, 'Away Fight'));
			this.update();
		}

		private update()
		{
			let tableFactory = new Table.Factory();

			tableFactory.addColumnHeader('Day', 10);
			tableFactory.addColumnHeader('Event', 90);

			for (let event of Model.state.events)
			{
				let cells = [new Table.TextCell((event.day + 1).toString()), new Table.TextCell(event.getDescription())];
				tableFactory.addRow(cells, false, null);
			}

			if (this.bottomDiv.firstChild)
				this.bottomDiv.removeChild(this.bottomDiv.firstChild);

			this.bottomDiv.appendChild(tableFactory.makeScroller());

			let eventsForTomorrow = Model.state.getEventsForDay(Model.state.getDay() + 1);
			this.homeButton.disabled = this.awayButton.disabled = eventsForTomorrow.length > 0;
		}
	}
}
