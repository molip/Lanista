"use strict";

namespace View 
{
	export class Trigger extends CanvasImage
	{
		constructor(public tag: string, public handler: (id: string) => void)
		{
			super();
		}

		onClick()
		{
			if (this.isEnabled())
				this.handler(this.tag);
		}
	}

	export class Building extends Trigger
	{
		levelIndex: number;
		progress: number;
		constructor(tag: string, public handler: (id: string) => void)
		{
			super(tag, handler);
			this.levelIndex = -1;
			this.progress = -1;
		}

		isEnabled()
		{
			return Model.state.buildings.getCurrentLevelIndex(this.tag) >= 0;
		}

		update()
		{
			let changed = false;
			var index = Model.state.buildings.getCurrentLevelIndex(this.tag);

			if (index < 0 && !this.image)
			{
				let level = Data.Buildings.getLevel(this.tag, 0);
				this.loadImage(Data.Misc.ConstructionImage, () => { this.onload() });
				this.pos = new Point(level.mapX, level.mapY);
				changed = true;
			}
			else if (this.levelIndex != index)
			{
				this.levelIndex = index;
				var level = Data.Buildings.getLevel(this.tag, index);
				this.loadImage(Util.getImage('buildings', this.tag + index), () => { this.onload() });
				this.pos = new Point(level.mapX, level.mapY);
				changed = true;
			}

			let oldProgress = this.progress;
			if (Model.state.buildings.isConstructing(this.tag))
				this.progress = Model.state.buildings.getConstructionProgress(this.tag);
			else
				this.progress = -1;

			if (this.progress != oldProgress)
				changed = true;

			return changed;
		}

		onload()
		{
			View.ludus.draw();
		}

		draw(ctx: CanvasRenderingContext2D)
		{
			if (this.progress >= 0)
			{
				let rect = this.getRect();
				rect.left = rect.right + 3;
				rect.right += 10;
				rect.top += 3;

				let rect2 = Object.create(rect);
				rect2.top = rect2.bottom - rect2.height() * this.progress;
				ctx.beginPath();
				rect2.path(ctx);
				ctx.closePath();
				ctx.fillStyle = '#80f080';
				ctx.fill();

				ctx.beginPath();
				rect.path(ctx);
				ctx.closePath();
				ctx.lineWidth = 2;
				ctx.strokeStyle = '#208020';
				ctx.stroke();
			}
			super.draw(ctx);
		}
	}
	export class Ludus extends Canvas
	{
		Objects: CanvasObject[] = [];
		Buildings: { [key: string]: Building } = {};
		BackgroundImage: CanvasImage = new CanvasImage();

		constructor()
		{
			super(<HTMLCanvasElement>document.getElementById('canvas_ludus'));

			this.BackgroundImage.loadImage(Data.Misc.LudusBackgroundImage, () => { this.draw() });

			this.element.width = View.Width;
			this.element.height = View.Height;
			this.initObjects();
		}

		draw()
		{
			if (!this.BackgroundImage.image.complete)
				return;

			var ctx = this.element.getContext("2d");

			ctx.setTransform(1, 0, 0, 1, 0, 0)
			ctx.clearRect(0, 0, this.element.width, this.element.height);

			this.BackgroundImage.draw(ctx);

			for (var i = 0, obj: CanvasObject; obj = this.Objects[i]; ++i)
			{
				obj.draw(ctx);

				if (obj == Controller.Canvas.HotObject)
				{
					ctx.beginPath();
					obj.getRect().path(ctx);
					ctx.closePath();
					ctx.lineWidth = 3;
					ctx.strokeStyle = 'cornflowerblue';
					ctx.stroke();
				}
			}
		}

		initObjects()
		{
			this.Objects.length = 0;
			this.Buildings = {};

			let town = Data.Misc.TownTrigger;
			let trigger = new View.Trigger('town', Controller.onTownTriggerClicked);
			trigger.loadImage(Util.getImage('buildings', 'town'), () => { this.draw() });
			trigger.pos = new Point(town.mapX, town.mapY);
			this.Objects.push(trigger);

			this.updateObjects();
			this.draw();
		}

		updateObjects()
		{
			let redraw = false;
			for (var tag in Data.Buildings.Levels)
			{
				if (Model.state.buildings.getCurrentLevelIndex(tag) >= 0 || Model.state.buildings.isConstructing(tag))
				{
					let building = this.Buildings[tag];
					if (!(tag in this.Buildings))
					{
						building = new Building(tag, Controller.onBuildingTriggerClicked);
						this.Buildings[tag] = building;
						this.Objects.push(building);
					}

					if (building.update())
						redraw = true;
				}
			}
			if (redraw)
				this.draw();
		}
	}
}
