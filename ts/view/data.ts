"use strict";

namespace View 
{
    export namespace Data
    {
        export namespace Buildings
        {
            class Level { constructor(public mapImage: string, public mapX: number, public mapY: number, public shopImage: string, public name: string, public description: string) { } }

            let Types = //          map image               map x   map y   shop image              name            description                     
            {
                'home': [
                    new Level('images/canvas/home0.png',    40,     230,    'images/builders.jpg', 'Shack',         ''),
                    new Level('images/canvas/home1.png',    60,     250,    'images/builders.jpg', 'House',         'Nice House'),
                ],
                'barracks': [
                    new Level('images/canvas/home0.png',    0,      0,      'images/builders.jpg', 'Barracks 1',    'For gladiators to live in'),
                    new Level('images/canvas/home0.png',    0,      0,      'images/builders.jpg', 'Barracks 2',    'Nice Barracks'),
                ],
                'kennels': [
                    new Level('images/canvas/home0.png',    0,      0,      'images/builders.jpg', 'Kennels 1',     'For animals to live in'),
                    new Level('images/canvas/home0.png',    0,      0,      'images/builders.jpg', 'Kennels 2',     'Nice Kennels'),
                ],
                'storage': [
                    new Level('images/canvas/home0.png',    0,      0,      'images/builders.jpg', 'Storage 1',     'For stuff to live in.'),
                    new Level('images/canvas/home0.png',    0,      0,      'images/builders.jpg', 'Storage 2',     'Nice Storage'),
                ],
                'weapon': [
                    new Level('images/canvas/home0.png',    0,      0,      'images/builders.jpg', 'Weapon 1',      'To make weapons'),
                    new Level('images/canvas/home0.png',    0,      0,      'images/builders.jpg', 'Weapon 2',      'Nice Weapon'),
                ],
                'armour': [
                    new Level('images/canvas/home0.png',    0,      0,      'images/builders.jpg', 'Armour 1',      'To make armour'),
                    new Level('images/canvas/home0.png',    0,      0,      'images/builders.jpg', 'Armour 2',      'Nice Armour'),
                ],
                'training': [
                    new Level('images/canvas/home0.png',    0,      0,      'images/builders.jpg', 'Training 1',    'To train gladiators'),
                    new Level('images/canvas/home0.png',    0,      0,      'images/builders.jpg', 'Training 2',    'Nice Training'),
                ],
                'surgery': [
                    new Level('images/canvas/home0.png',    0,      0,      'images/builders.jpg', 'Surgery 1',     'To fix gladiators'),
                    new Level('images/canvas/home0.png',    0,      0,      'images/builders.jpg', 'Surgery 2',     'Nice Surgery'),
                ],
                'lab': [
                    new Level('images/canvas/home0.png',    0,      0,      'images/builders.jpg', 'Lab 1',         'To invent stuff'),
                    new Level('images/canvas/home0.png',    0,      0,      'images/builders.jpg', 'Lab 2',         'Nice Lab'),
                ],
                'merch': [
                    new Level('images/canvas/home0.png',    0,      0,      'images/builders.jpg', 'Merch 1',       'To sell stuff'),
                    new Level('images/canvas/home0.png',    0,      0,      'images/builders.jpg', 'Merch 2',       'Nice Merch'),
                ],
            }

            export function getLevel(id: string, index: number): Level
            {
                Util.assert(id in Types);
                Util.assert(index >= 0 && index < Types[id].length);
                return Types[id][index];
            }
        }

        export let TownTrigger = { mapX: 1100, mapY: 290, mapImage: 'images/canvas/town.png' };
        export let LudusBackground = { mapImage: 'images/canvas/background.png' };
    }
}
