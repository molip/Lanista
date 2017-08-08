namespace View
{
	export class Page
	{
		div: HTMLDivElement;
		static Current: Page = null;

		constructor(private title?: string)
		{
			Util.assert(Page.Current == null);
			Page.Current = this;

			this.div = document.createElement('div');
		}

		static hideCurrent()
		{
			if (Page.Current && Page.Current.onClose())
			{
				Page.Current = null;

				let elem = document.getElementById('page');
				elem.className = '';
				elem.innerHTML = '';
			}
		}

		show()
		{
			let elem = document.getElementById('page');
			elem.innerHTML = '';

			if (this.title)
			{
				let title = document.createElement('p');
				title.innerText = this.title;
				elem.appendChild(title);
			}

			let backButton = document.createElement('button');
			backButton.id = 'back_button';
			backButton.innerText = 'Back';
			backButton.addEventListener('click', Page.hideCurrent);

			elem.appendChild(backButton);
			elem.appendChild(this.div);
			elem.className = 'show';

			this.onShow();
		}

		onShow() { }
		onClose() { return true; }
	}
}