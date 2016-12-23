"use strict";

namespace View 
{
	export class Animation
	{
		startTime: number = 0;
		progress: number = 0;
		onStart: () => void = null;
		constructor(public duration: number)
		{
		}

		start()
		{
			this.startTime = new Date().getTime();
			if (this.onStart)
				this.onStart();
		}

		update()
		{
			let now = new Date().getTime();
			this.progress = (now - this.startTime) / this.duration;
			if (this.progress >= 1)
			{
				this.progress = 1;
				return false;
			}

			return true;
		}

		draw(ctx: CanvasRenderingContext2D, xform: Xform) { }
	}

	export class Sequence
	{
		items: Animation[] = [];
		 
		constructor()
		{
		}

		start()
		{
			if (this.items.length)
			{
				this.items[0].start();
				return true;
			}
			return false;
		}

		update()
		{
			if (this.items.length)
			{
				if (this.items[0].update())
					return true;

				this.items.shift(); // Finished.
			}

			return this.start();
		}

		draw(ctx: CanvasRenderingContext2D, xform?: Xform)
		{
			if (this.items.length)
			{
				ctx.save();
				this.items[0].draw(ctx, xform ? xform : new Xform());
			}
		}
	}
}
