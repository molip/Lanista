"use strict";

View.Buildings = {}

View.Buildings._makeLevel = function (name, shopImage, mapX, mapY, description) { return { name:name, shopImage:shopImage, description:description, mapX:mapX, mapY:mapY }; }

View.Buildings.Types = //			name			shop image				map x	map y	description						
{
	'home':[	
		View.Buildings._makeLevel(	'Shack'			,'images/builders.jpg'	,40		,230	,''								),		
		View.Buildings._makeLevel(	'House'			,'images/builders.jpg'	,60		,250	,'Nice House'					),
	],
	'barracks':[
		View.Buildings._makeLevel(	'Barracks 1'	,'images/builders.jpg'	,0		,0		,'For gladiators to live in'	),
		View.Buildings._makeLevel(	'Barracks 2'	,'images/builders.jpg'	,0		,0		,'Nice Barracks'				),
	],
	'kennels':[	
		View.Buildings._makeLevel(	'Kennels 1'		,'images/builders.jpg'	,0		,0		,'For animals to live in'		),	
		View.Buildings._makeLevel(	'Kennels 2'		,'images/builders.jpg'	,0		,0		,'Nice Kennels'					),
	],
	'storage':[	
		View.Buildings._makeLevel(	'Storage 1'		,'images/builders.jpg'	,0		,0		,'For stuff to live in.'		),	
		View.Buildings._makeLevel(	'Storage 2'		,'images/builders.jpg'	,0		,0		,'Nice Storage'					),
	],
	'weapon':[	
		View.Buildings._makeLevel(	'Weapon 1'		,'images/builders.jpg'	,0		,0		,'To make weapons'				),	
		View.Buildings._makeLevel(	'Weapon 2'		,'images/builders.jpg'	,0		,0		,'Nice Weapon'					),
	],
	'armour':[	
		View.Buildings._makeLevel(	'Armour 1'		,'images/builders.jpg'	,0		,0		,'To make armour'				),	
		View.Buildings._makeLevel(	'Armour 2'		,'images/builders.jpg'	,0		,0		,'Nice Armour'					),
	],	   
	'training':[
		View.Buildings._makeLevel(	'Training 1'	,'images/builders.jpg'	,0		,0		,'To train gladiators'			),	
		View.Buildings._makeLevel(	'Training 2'	,'images/builders.jpg'	,0		,0		,'Nice Training'				),
	],
	'surgery':[	
		View.Buildings._makeLevel(	'Surgery 1'		,'images/builders.jpg'	,0		,0		,'To fix gladiators'			),	
		View.Buildings._makeLevel(	'Surgery 2'		,'images/builders.jpg'	,0		,0		,'Nice Surgery'					),
	],		
	'lab':[		
		View.Buildings._makeLevel(	'Lab 1'			,'images/builders.jpg'	,0		,0		,'To invent stuff'				),
		View.Buildings._makeLevel(	'Lab 2'			,'images/builders.jpg'	,0		,0		,'Nice Lab'						),
	],
	'merch':[	
		View.Buildings._makeLevel(	'Merch 1'		,'images/builders.jpg'	,0		,0		,'To sell stuff'			),
		View.Buildings._makeLevel(	'Merch 2'		,'images/builders.jpg'	,0		,0		,'Nice Merch'				),
	],
}
