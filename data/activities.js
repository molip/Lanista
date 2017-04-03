Data.Activities.Types = 
{	//												name					job		human	animal	free_work
	'':					new Data.Activities.Type(	'Idle',					false,	true,	true,	0	),
	'build':			new Data.Activities.Type(	'Building',				true,	true,	false,	0.1	),
	'train_animals':	new Data.Activities.Type(	'Animal Training',		true,	true,	false,	0	),
	'train_gladiators': new Data.Activities.Type(	'Gladiator Training',	true,	true,	false,	0	),
	'craft':			new Data.Activities.Type(	'Crafting',				true,	true,	false,	0	),
	'repair':			new Data.Activities.Type(	'Repairing',			true,	true,	false,	0	),
	'practise':			new Data.Activities.Type(	'Practicing',			false,	true,	false,	0	),
	'convalesce':		new Data.Activities.Type(	'Convalescing',			false,	true,	false,	0	),
	'recreation':		new Data.Activities.Type(	'Recreation',			false,	true,	true,	0	),
};
