﻿namespace Util
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
		{
			let str = 'Assertion failed';
			if (message)
				str += ': ' + message;

			str += '\n\nCall stack:\n' + (new Error).stack;
			alert(str);
			debugger;
		}
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

	export function lerp(start: number, end: number, param: number)
	{
		return start + (end - start) * param;
	}

	export function querp(start: number, end: number, param: number)
	{
		return start + (end - start) * param * param;
	}

	export function scaleCentred(ctx: CanvasRenderingContext2D, scale: number, x: number, y: number)
	{
		ctx.translate(x, y);
		ctx.scale(scale, scale);
		ctx.translate(-x, -y);
	}

	export function setPrototype(obj: any, type: any)
	{
		obj.__proto__ = type.prototype;
	}

	export function dynamicCast<T>(instance: any, ctor: { new(...args: any[]): T })
	{
		return (instance instanceof ctor) ? instance : null;
	}

	export function assertCast<T>(instance: any, ctor: { new (...args: any[]): T })
	{
		assert(instance instanceof ctor);
		return instance as T;
	}

	export function getImage(dir: string, name: string)
	{
		return 'images/' + dir + '/' + name + '.png';
	}
}
