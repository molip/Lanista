"use strict";

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

		export class Factory
		{
			element: HTMLDivElement;
			private table: HTMLTableElement;
			private headerRow: HTMLTableRowElement;
			constructor() 
			{
				this.element = document.createElement('div');
				this.table = document.createElement('table');
				this.element.appendChild(this.table);
				this.element.className = 'scroller';
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

				if (locked || !handler)
					row.className = 'disabled';
			}
		}
	}
}
