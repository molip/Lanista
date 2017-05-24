/// <reference path="page.ts" />
"use strict";

namespace View 
{
	export class NewsPage extends Page
	{
		constructor(private closeHandler: () => void)
		{
			super('News');

			this.div.style.overflow = 'auto';

			for (let item of Model.state.news)
			{
				let e = document.createElement('p');
				e.innerText = item.description;
				this.div.appendChild(e);
			}

			for (let item of Model.state.getEventsForToday())
			{
				let e = document.createElement('p');
				e.innerText = item.getDescription();
				this.div.appendChild(e);
			}
		}

		onShow()
		{
		}

		onClose()
		{
			this.closeHandler();
			return true;
		}
	}
}
