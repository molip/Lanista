Data.Armour.Types = { //						name				cost	image	description,			sites (species, body part, count)		defence
	'helmet':			new Data.Armour.Type(	'Helmet',			50,		'',		"It's a Helmet",		[ new Data.Site('human', 'head', 1) ],	{ blade:10, pierce:10, impact: 10, crush: 10 }	),
	'arm bits':			new Data.Armour.Type(	'Arm Bits',			51,		'',		"It's some Arm Bits",	[ new Data.Site('human', 'arm', 2) ],	{ blade:10, pierce:10, impact: 10, crush: 10 }	),
	'leg bits':			new Data.Armour.Type(	'Leg Bits',			52,		'',		"It's some Leg Bits",	[ new Data.Site('human', 'leg', 2) ],	{ blade:10, pierce:10, impact: 10, crush: 10 }	),
	'chestplate':		new Data.Armour.Type(	'Chestplate',		53,		'',		"It's a Chestplate",	[ new Data.Site('human', 'body', 1)],	{ blade:10, pierce:10, impact: 10, crush: 10 }	),
																																					
	'rabbit helmet':	new Data.Armour.Type(	'Rabbit Helmet',	20,		'',		"It's a Helmet",		[ new Data.Site('rabbit', 'head', 1) ],	{ blade:10, pierce:10, impact: 10, crush: 10 }	),
};
