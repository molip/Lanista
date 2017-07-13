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

		start(speed: number)
		{
			this.duration /= speed;
			this.startTime = new Date().getTime();
			if (this.onStart)
				this.onStart();
		}

		update()
		{
			let now = new Date().getTime();
			this.progress = this.duration ? (now - this.startTime) / this.duration : 1;
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
		 
		constructor(public speed: number)
		{
		}

		start()
		{
			if (this.items.length)
			{
				this.items[0].start(this.speed);
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
				ctx.restore();
			}
		}
	}
}
