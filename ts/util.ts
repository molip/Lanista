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

	export function formatRows(rows: string[][])
	{
		let columns: string[] = [];
		for (let i = 0; i < rows.length; ++i)
			for (let j = 0; j < rows[i].length; ++j)
			{
				if (i == 0)
					columns[j] = '<table>';

				columns[j] += '<tr><td>' + rows[i][j] + '</tr></td>';

				if (i == rows.length - 1)
					columns[j] += '</table>';
			}
		return columns;
	}

	export function getRandomInt(max: number) // Return a random int in the range [0, max).
	{
		return Math.floor(Math.random() * max);
	}
}
