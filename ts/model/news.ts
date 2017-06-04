"use strict";

namespace Model
{
	export class News
	{
		constructor(public description: string) { }
	}

	export class EventNews extends News
	{
		constructor(event: Model.Event)
		{
			let desc = 'Announcement: \n';
			desc += 'There will be an event on day ' + (event.day + 1) + '.\n';
			desc += 'The name of the event is "' + event.getDescription() + '".'

			super(desc);
		}
	}
}
