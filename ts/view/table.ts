namespace View 
{
	export namespace Table 
	{
		export class Cell
		{
			cellElement: HTMLTableDataCellElement= null;

			constructor(public width?: number) { } // %

			getElement(): HTMLTableDataCellElement
			{
				this.cellElement = document.createElement('td');
				if (this.width)
					this.cellElement.style.width = this.width.toString() + '%';

				return this.cellElement;
			}
		}

		export class TextCell extends Cell
		{
			constructor(public content: string, width?: number)
			{
				super(width);
			} 
			
			getElement(): HTMLTableDataCellElement
			{
				let e = super.getElement();
				e.innerHTML = this.content;
				return e;
			}
		}

		export class ImageCell extends Cell
		{
			constructor(public src: string, width?: number)
			{
				super(width);
			}

			getElement(): HTMLTableDataCellElement
			{
				let e = super.getElement();
				e.style.position = 'relative';
				let child = document.createElement('img');
				child.className = "centre";
				child.style.height = '90%';
				child.src = this.src;
				e.appendChild(child);
				return e;
			}
		}

		export class SelectCellItem
		{
			constructor(public tag: string, public name: string) { }
		}

		export class SelectCell extends Cell
		{
			selectedTag: string;
			selectElement: HTMLSelectElement;

			constructor(width: number, private items: SelectCellItem[], private handler: (value: string) => void)
			{
				super(width);
			}

			getElement(): HTMLTableDataCellElement
			{
				let e = super.getElement();
				this.selectElement = document.createElement('select');
				for (let i = 0, item; item = this.items[i]; ++i)
				{
					let optionElement = document.createElement('option');
					optionElement.value = item.tag;
					optionElement.innerText = item.name;
					this.selectElement.appendChild(optionElement);
				}
				this.selectElement.value = this.selectedTag;
				this.selectElement.addEventListener('change', () => { this.handler(this.selectElement.value); });
				e.appendChild(this.selectElement);
				return e;
			}
		}

		export class CheckboxCell extends Cell
		{
			public checkbox: HTMLInputElement;

			constructor(width: number, private handler: (value: boolean) => void)
			{
				super(width);
			}

			getElement(): HTMLTableDataCellElement
			{
				this.checkbox = document.createElement('input');
				this.checkbox.type = 'checkbox';
				this.checkbox.addEventListener('click', () => { this.handler(this.checkbox.checked); });

				let e = super.getElement();
				e.appendChild(this.checkbox);
				return e;
			}
		}

		export class NumberInputCell extends Cell
		{
			decButton: HTMLButtonElement;
			incButton: HTMLButtonElement;
			span: HTMLSpanElement;
			value: number = 0;

			constructor(width: number, private handler: () => void)
			{
				super(width);
			}

			getElement(): HTMLTableDataCellElement
			{
				let addButton = (text: string, delta: number) =>
				{
					let button = document.createElement('button');
					button.innerText = text;
					button.addEventListener('click', () => { this.value += delta; this.update(); this.handler() });
					return button;
				};

				this.decButton = addButton('-', -1);
				this.incButton = addButton('+', 1);
				this.span = document.createElement('span');
				this.span.style.margin = '0 0.2em 0 0.2em';

				let e = super.getElement();
				e.appendChild(this.decButton);
				e.appendChild(this.span);
				e.appendChild(this.incButton);

				this.update();
				return e;
			}

			update()
			{
				this.span.innerText = this.value.toString();
			}
		}

		export class Factory
		{
			table: HTMLTableElement;
			private headerRow: HTMLTableRowElement;
			constructor(table: HTMLTableElement = null)
			{
				this.table = table ? table : document.createElement('table');
				this.table.innerHTML = '';
			}

			addColumnHeader(name: string, width?: number)
			{
				if (!this.headerRow)
				{
					this.headerRow = this.table.insertRow(0);
					this.headerRow.className = 'disabled';
				}

				let th = document.createElement('th');
				this.headerRow.appendChild(th);
				th.innerText = name;
				if (width)
					th.style.width = width.toString() + '%';
			}

			addRow(cells: Cell[], locked: boolean, handler: () => void)
			{
				let row = document.createElement('tr');
				row.className = 'table_row';
				this.table.appendChild(row);
				for (let cell of cells)
					row.appendChild((cell ? cell : new Cell()).getElement());
				row.addEventListener('click', handler);
				if (locked)
					row.style.opacity = '0.5';

				if (!locked && handler)
					row.className += ' highlight';

				return row;
			}

			makeScroller()
			{
				let div = document.createElement('div');
				div.appendChild(this.table);
				div.className = 'scroller';
				return div;
			}
		}
	}
}
