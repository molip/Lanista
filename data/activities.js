// Activities which appear in the barracks/kennels Activities dropdowns.

// tag:			The 'train' ones refer to a skill tag (see skills.js)
// job:			If true, experience is gained for doing it.
// human:		Can it be done by humans?
// animal:		Can it be done by animals?
// free_work:	Number of imaginary workers permanently assigned to activity - this represents the Lanista's modest efforts.

Data.Activities.Types = {
//	tag												name					job		human	animal	free_work
	'idle':				new Data.Activities.Type(	'Idle',					false,	true,	true,	0	),
	'build':			new Data.Activities.Type(	'Building',				true,	true,	false,	0.1	),
	'train:attack':		new Data.Activities.Type(	'Training: attack',		false,	true,	false,	0	),
	'train:evade':		new Data.Activities.Type(	'Training: evade',		false,	true,	false,	0	),
};
