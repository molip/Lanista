namespace View
{
	export class Preloader
	{
		public paths: string[] = [];
		private images: HTMLImageElement[] = [];
		private finished: number = 0;

		constructor(private onFinished: () => void = null) { }

		go()
		{
			for (let path of this.paths)
			{
				let image = new Image();
				if (this.onFinished)
					image.onload = () => { this.onLoad(); };

				image.src = path;
				this.images.push(image);
			}
		}

		isFinished()
		{
			return this.finished == this.paths.length;
		}

		private onLoad()
		{
			++this.finished;

			if (this.isFinished())
				this.onFinished();
		}
	}
}
