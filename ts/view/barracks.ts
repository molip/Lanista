/// <reference path="popup.ts" />
"use strict";

namespace View 
{
    export class BarracksPopup extends Popup
    {
        constructor()
        {
            super('Barracks');
            let tableFactory = new Table.Factory();
            this.div.appendChild(tableFactory.element);

            tableFactory.addColumnHeader('Name', 20);
            tableFactory.addColumnHeader('Image', 20);
            tableFactory.addColumnHeader('HP', 20);
            tableFactory.addColumnHeader('Atk', 20);
            tableFactory.addColumnHeader('Def');

            for (let person of Model.state.getPeople())
            {
                let type = Data.People.Types[person.typeID];
                let cells = [new Table.TextCell('<h4>' + type.name + '</h4>'), new Table.ImageCell(type.shopImage), new Table.TextCell(person.health.toString()), new Table.TextCell(type.attack.toString()), new Table.TextCell(type.defense.toString())];
                tableFactory.addRow(cells, false, null);
            }
        }
    }
}
