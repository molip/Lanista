/// <reference path="page.ts" />

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
