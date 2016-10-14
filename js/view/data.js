"use strict";

View.Data = {}

View.Data.Buildings = {}

View.Data.Buildings._makeLevel = function (mapImage, mapX, mapY, shopImage, name, description) { return { name:name, shopImage:shopImage, mapImage:mapImage, description:description, mapX:mapX, mapY:mapY }; }

View.Data.Buildings.Types = //			map image					map x	map y	shop image				name			description						
{
	'home':[	
		View.Data.Buildings._makeLevel(	'images/canvas/home0.png'	,40		,230	,'images/builders.jpg'	,'Shack'		,''								),		
		View.Data.Buildings._makeLevel(	'images/canvas/home1.png'	,60		,250	,'images/builders.jpg'	,'House'		,'Nice House'					),
	],
	'barracks':[
		View.Data.Buildings._makeLevel(	'images/canvas/home0.png'	,0		,0		,'images/builders.jpg'	,'Barracks 1'	,'For gladiators to live in'	),
		View.Data.Buildings._makeLevel(	'images/canvas/home0.png'	,0		,0		,'images/builders.jpg'	,'Barracks 2'	,'Nice Barracks'				),
	],
	'kennels':[	
		View.Data.Buildings._makeLevel(	'images/canvas/home0.png'	,0		,0		,'images/builders.jpg'	,'Kennels 1'	,'For animals to live in'		),	
		View.Data.Buildings._makeLevel(	'images/canvas/home0.png'	,0		,0		,'images/builders.jpg'	,'Kennels 2'	,'Nice Kennels'					),
	],
	'storage':[	
		View.Data.Buildings._makeLevel(	'images/canvas/home0.png'	,0		,0		,'images/builders.jpg'	,'Storage 1'	,'For stuff to live in.'		),	
		View.Data.Buildings._makeLevel(	'images/canvas/home0.png'	,0		,0		,'images/builders.jpg'	,'Storage 2'	,'Nice Storage'					),
	],
	'weapon':[	
		View.Data.Buildings._makeLevel(	'images/canvas/home0.png'	,0		,0		,'images/builders.jpg'	,'Weapon 1'		,'To make weapons'				),	
		View.Data.Buildings._makeLevel(	'images/canvas/home0.png'	,0		,0		,'images/builders.jpg'	,'Weapon 2'		,'Nice Weapon'					),
	],
	'armour':[	
		View.Data.Buildings._makeLevel(	'images/canvas/home0.png'	,0		,0		,'images/builders.jpg'	,'Armour 1'		,'To make armour'				),	
		View.Data.Buildings._makeLevel(	'images/canvas/home0.png'	,0		,0		,'images/builders.jpg'	,'Armour 2'		,'Nice Armour'					),
	],	   
	'training':[
		View.Data.Buildings._makeLevel(	'images/canvas/home0.png'	,0		,0		,'images/builders.jpg'	,'Training 1'	,'To train gladiators'			),	
		View.Data.Buildings._makeLevel(	'images/canvas/home0.png'	,0		,0		,'images/builders.jpg'	,'Training 2'	,'Nice Training'				),
	],
	'surgery':[	
		View.Data.Buildings._makeLevel(	'images/canvas/home0.png'	,0		,0		,'images/builders.jpg'	,'Surgery 1'	,'To fix gladiators'			),	
		View.Data.Buildings._makeLevel(	'images/canvas/home0.png'	,0		,0		,'images/builders.jpg'	,'Surgery 2'	,'Nice Surgery'					),
	],		
	'lab':[		
		View.Data.Buildings._makeLevel(	'images/canvas/home0.png'	,0		,0		,'images/builders.jpg'	,'Lab 1'		,'To invent stuff'				),
		View.Data.Buildings._makeLevel(	'images/canvas/home0.png'	,0		,0		,'images/builders.jpg'	,'Lab 2'		,'Nice Lab'						),
	],
	'merch':[	
		View.Data.Buildings._makeLevel(	'images/canvas/home0.png'	,0		,0		,'images/builders.jpg'	,'Merch 1'		,'To sell stuff'				),
		View.Data.Buildings._makeLevel(	'images/canvas/home0.png'	,0		,0		,'images/builders.jpg'	,'Merch 2'		,'Nice Merch'					),
	],
}

View.Data.TownTrigger = { mapX: 1100, mapY: 290, mapImage: 'images/canvas/town.png' };
View.Data.LudusBackground = { mapImage: 'images/canvas/background.png' };
