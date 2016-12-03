"use strict";

namespace View
{
	export class Popup
	{
		div: HTMLDivElement;
		static Current: Popup;

		constructor(private title?: string)
		{
			this.div = document.createElement('div');
		}

		static hideCurrent()
		{
			let elem = document.getElementById('popup');
			elem.className = '';
			elem.innerHTML = '';
			document.getElementById('blanket').className = '';
			document.getElementById('overlay_div').className = 'disabled';
		}

		show()
		{
			let elem = document.getElementById('popup');
			elem.innerHTML = '';

			if (this.title)
			{
				let title = document.createElement('p');
				title.innerText = this.title;
				elem.appendChild(title);
			}

			elem.appendChild(this.div);
			elem.className = 'show';
			document.getElementById('blanket').className = 'show';
			document.getElementById('overlay_div').className = '';
		}
	}

	export class ListPopup extends Popup
	{
		private tableFactory: Table.Factory;
		constructor(title: string)
		{
			super(title);
			this.tableFactory = new Table.Factory();
			this.div.appendChild(this.tableFactory.element);
		}

		addItem(title: string, description: string, image: string, locked: boolean, handler: ()=>void)
		{
			let cells = [new Table.TextCell('<h4>' + title + '</h4>', 20), new Table.ImageCell(image, 20), new Table.TextCell(description)];
			this.tableFactory.addRow(cells, locked, function ()
			{
				Popup.hideCurrent();
				handler();
			});
		}
	}
}