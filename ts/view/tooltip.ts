"use strict";

namespace View
{
	export class Tooltip
	{
		div: HTMLDivElement;
		static Current: Tooltip = null;

		constructor()
		{
			Util.assert(Tooltip.Current == null);
			Tooltip.Current = this;

			this.div = document.createElement('div');
		}

		static hideCurrent()
		{
			if (Tooltip.Current)
			{
				Tooltip.Current = null;

				let elem = document.getElementById('tooltip');
				elem.style.visibility = 'hidden';
				elem.innerHTML = '';
			}
		}

		show()
		{
			let elem = document.getElementById('tooltip');
			elem.innerHTML = '';

			elem.appendChild(this.div);
			elem.style.visibility = 'visible';
		}
	}
}