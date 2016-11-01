"use strict";

namespace View
{
    export class Popup
    {
        div: HTMLDivElement;
        static Current: Popup;

        constructor(title?: string)
        {
            this.div = document.createElement('div');
            if (title)
            {
                let template = document.createElement('template');
                template.innerHTML = '<h3 style="margin:1vmin; text-align: center">' + title + '</h3>';
                this.div.appendChild(template.content.firstChild);
            }
        }

        static hideCurrent()
        {
            document.getElementById('container').className = '';
            document.getElementById('popup').className = '';
            document.getElementById('container').innerHTML = '';
        }

        show()
        {
            let container = document.getElementById('container');
            container.innerHTML = '';
            container.appendChild(this.div);
            container.className = 'show';
            document.getElementById('popup').className = 'show';
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