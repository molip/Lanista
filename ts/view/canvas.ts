"use strict";

namespace View 
{
	export class CanvasObject
	{
		constructor() { }
		draw(ctx: CanvasRenderingContext2D) { }
		getRect(): Rect { return null; }
		onClick() {}
		isEnabled() { return true; }
	}

	export class CanvasImage extends CanvasObject
	{
		image: HTMLImageElement;
		pos: Point = new Point(0, 0);

		loadImage(path: string, onLoad: () => void)
		{
			this.image = new Image();
			this.image.onload = () => { onLoad(); };
			this.image.src = path;
		}

		draw(ctx: CanvasRenderingContext2D)
		{
			ctx.drawImage(this.image, this.pos.x, this.pos.y);
		}

		getRect()
		{
			return new Rect(this.pos.x, this.pos.y, this.pos.x + this.image.width, this.pos.y + this.image.height);
		}

		isComplete()
		{
			return this.image && this.image.complete; 
		}
	}

	export class Canvas
	{
		constructor(public element: HTMLCanvasElement)
		{
		}

		devToLog(x: number, y: number): Point
		{
			let scale = this.element.clientWidth / this.element.width;
			return new Point(x / scale, y / scale);
		}

		draw()
		{
			Util.assert(false);
		}
	}
}
