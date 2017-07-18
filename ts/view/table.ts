namespace View 
{
	export namespace Table 
	{
		export class Cell
		{
			constructor(public width?: number) { } // %

			getElement(): HTMLTableDataCellElement
			{
				let e = document.createElement('td');
				if (this.width)
					e.style.width = this.width.toString() + '%';
				return e;
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

			constructor(width: number, private items: SelectCellItem[], private handler: (value: string) => void)
			{
				super(width);
			}

			getElement(): HTMLTableDataCellElement
			{
				let e = super.getElement();
				let select = document.createElement('select');
				for (let i = 0, item; item = this.items[i]; ++i)
				{
					let optionElement = document.createElement('option');
					optionElement.value = item.tag;
					optionElement.innerText = item.name;
					select.appendChild(optionElement);
				}
				select.value = this.selectedTag;
				select.addEventListener('change', () => { this.handler(select.value); });
				e.appendChild(select);
				return e;
			}
		}

		export class CheckboxCell extends Cell
		{
			public checkbox: HTMLInputElement;

			constructor(private handler: (value: boolean) => void)
			{
				super(20);
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
					row.appendChild(cell.getElement());
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
