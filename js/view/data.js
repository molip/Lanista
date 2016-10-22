"use strict";
var View;
(function (View) {
    var Data;
    (function (Data) {
        var Buildings;
        (function (Buildings) {
            var Level = (function () {
                function Level(mapImage, mapX, mapY, shopImage, name, description) {
                    this.mapImage = mapImage;
                    this.mapX = mapX;
                    this.mapY = mapY;
                    this.shopImage = shopImage;
                    this.name = name;
                    this.description = description;
                }
                return Level;
            }());
            var Types = {
                'home': [
                    new Level('images/canvas/home0.png', 32, 96, 'images/canvas/home0.png', 'Shack', 'Crappy shack'),
                    new Level('images/canvas/home1.png', 32, 96, 'images/canvas/home1.png', 'House', 'Nice House'),
                ],
                'barracks': [
                    new Level('images/canvas/barracks0.png', 44, 317, 'images/canvas/barracks0.png', 'Barracks 1', 'For gladiators to live in'),
                    new Level('images/canvas/barracks1.png', 44, 317, 'images/canvas/barracks1.png', 'Barracks 2', 'Nice Barracks'),
                ],
                'kennels': [
                    new Level('images/canvas/home0.png', 0, 0, 'images/canvas/home0.png', 'Kennels 1', 'For animals to live in'),
                    new Level('images/canvas/home0.png', 0, 0, 'images/canvas/home0.png', 'Kennels 2', 'Nice Kennels'),
                ],
                'storage': [
                    new Level('images/canvas/home0.png', 0, 0, 'images/canvas/home0.png', 'Storage 1', 'For stuff to live in.'),
                    new Level('images/canvas/home0.png', 0, 0, 'images/canvas/home0.png', 'Storage 2', 'Nice Storage'),
                ],
                'weapon': [
                    new Level('images/canvas/home0.png', 0, 0, 'images/canvas/home0.png', 'Weapon 1', 'To make weapons'),
                    new Level('images/canvas/home0.png', 0, 0, 'images/canvas/home0.png', 'Weapon 2', 'Nice Weapon'),
                ],
                'armour': [
                    new Level('images/canvas/home0.png', 0, 0, 'images/canvas/home0.png', 'Armour 1', 'To make armour'),
                    new Level('images/canvas/home0.png', 0, 0, 'images/canvas/home0.png', 'Armour 2', 'Nice Armour'),
                ],
                'training': [
                    new Level('images/canvas/home0.png', 0, 0, 'images/canvas/home0.png', 'Training 1', 'To train gladiators'),
                    new Level('images/canvas/home0.png', 0, 0, 'images/canvas/home0.png', 'Training 2', 'Nice Training'),
                ],
                'surgery': [
                    new Level('images/canvas/home0.png', 0, 0, 'images/canvas/home0.png', 'Surgery 1', 'To fix gladiators'),
                    new Level('images/canvas/home0.png', 0, 0, 'images/canvas/home0.png', 'Surgery 2', 'Nice Surgery'),
                ],
                'lab': [
                    new Level('images/canvas/home0.png', 0, 0, 'images/canvas/home0.png', 'Lab 1', 'To invent stuff'),
                    new Level('images/canvas/home0.png', 0, 0, 'images/canvas/home0.png', 'Lab 2', 'Nice Lab'),
                ],
                'merch': [
                    new Level('images/canvas/home0.png', 0, 0, 'images/canvas/home0.png', 'Merch 1', 'To sell stuff'),
                    new Level('images/canvas/home0.png', 0, 0, 'images/canvas/home0.png', 'Merch 2', 'Nice Merch'),
                ],
            };
            function getLevel(id, index) {
                Util.assert(id in Types);
                Util.assert(index >= 0 && index < Types[id].length);
                return Types[id][index];
            }
            Buildings.getLevel = getLevel;
        })(Buildings = Data.Buildings || (Data.Buildings = {}));
        Data.TownTrigger = { mapX: 1100, mapY: 290, mapImage: 'images/canvas/town.png' };
        Data.LudusBackground = { mapImage: 'images/canvas/background.png' };
    })(Data = View.Data || (View.Data = {}));
})(View || (View = {}));
