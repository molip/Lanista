namespace View 
{
	export class TabBar
	{
		div = document.createElement('div');
		tabs: HTMLDivElement[] = [];

		constructor(private handler: (data: any) => void)
		{
			this.div.className = 'tab_bar';
		}

		private onTabClicked(tab: HTMLDivElement, data: any)
		{
			for (let t of this.tabs)
			{
				if (t === tab)
					t.classList.add('tab_selected');
				else
					t.classList.remove('tab_selected');
			}

			this.handler(data);
		}

		addTab(name: string, data?: any)
		{
			let tab = document.createElement('div');
			tab.innerText = name;
			tab.className = 'tab';
			tab.addEventListener('click', () => { this.onTabClicked(tab, data); });
			this.tabs.push(tab);
			this.div.appendChild(tab);

			if (this.tabs.length == 1)
				this.onTabClicked(tab, data);
		}
	}
}
