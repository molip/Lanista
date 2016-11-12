"use strict";

namespace Util
{
	export function formatMoney(amount: number): string
	{
		return '§' + amount;
	}

	export function getEventPos(event: MouseEvent, element: HTMLElement): Point
	{
		var rect = element.getBoundingClientRect();
		return new Point(event.clientX - rect.left, event.clientY - rect.top);
	}

	export function assert(condition: boolean, message?: string)
	{
		if (!condition)
			alert(message ? 'Assertion failed: ' + message : 'Assertion failed');
	}
}
