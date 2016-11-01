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
            constructor() 
            {
                this.element = document.createElement('div');
                this.table = document.createElement('table');
                this.element.appendChild(this.table);
                this.element.className = 'container_scroller';
            }

            addRow(cells: Cell[], locked: boolean, handler: () => void)
            {
                let row = document.createElement('tr');
                this.table.appendChild(row);
                for (let cell of cells)
                    row.appendChild(cell.getElement());
                row.addEventListener('click', handler);
                if (locked)
                {
                    row.style.opacity = '0.5';
                    row.className = 'disabled';
                }
            }
        }
    }
}
