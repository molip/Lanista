"use strict";

class Point
{
	constructor(public x: number, public y: number) { }
	translate(ctx: CanvasRenderingContext2D) { ctx.translate(this.x, this.y); };
}

class Rect
{
	constructor(public left: number, public top: number, public right: number, public bottom: number) { }
	width() { return this.right - this.left; }
	height() { return this.bottom - this.top; }
	centre() { return new Point((this.left + this.right) / 2, (this.bottom + this.top) / 2); }
	path(ctx: CanvasRenderingContext2D) { ctx.rect(this.left, this.top, this.width(), this.height()); };
	pointInRect(point: Point)
	{
		return point.x >= this.left && point.y >= this.top && point.x < this.right && point.y < this.bottom;
	}

	offset(dx: number, dy: number)
	{
		this.left += dx; this.right += dx; this.top += dy; this.bottom += dy; 
	}
}

