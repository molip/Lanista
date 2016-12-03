"use strict";

class Point
{
	constructor(public x: number, public y: number) { }
}

class Rect
{
	constructor(public left: number, public top: number, public right: number, public bottom: number) { }
	width(): number { return this.right - this.left; }
	height(): number { return this.bottom - this.top; }
	path(ctx: CanvasRenderingContext2D) { ctx.rect(this.left, this.top, this.width(), this.height()); };
	pointInRect(point: Point)
	{
		return point.x >= this.left && point.y >= this.top && point.x < this.right && point.y < this.bottom;
	}
}

