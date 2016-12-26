/// <reference path="page.ts" />
"use strict";

namespace View 
{
	function drawAttack(name: string, ctx: CanvasRenderingContext2D)
	{
		ctx.textAlign = "center";
		ctx.textBaseline = 'middle';
		ctx.font = '40px Arial';
		ctx.fillStyle = '#ff0000';
		ctx.fillText(name, 0, 0);
	}

	class GrowAnimation extends Animation
	{
		constructor(private name: string, private point: Point)
		{
			super(300);
		}

		draw(ctx: CanvasRenderingContext2D, xform: Xform)
		{
			let scale = Util.querp(0, 1, this.progress); 

			let point = xform.transformPoint(this.point);
			ctx.translate(point.x, point.y);
			ctx.scale(scale, scale);
			drawAttack(this.name, ctx);
		}
	}

	//class ExplodeAnimation extends Animation
	//{
	//	constructor(private name: string, private point: Point)
	//	{
	//		super(300);
	//	}

	//	draw(ctx: CanvasRenderingContext2D)
	//	{
	//		let scale = Util.lerp(1, 15, this.progress); 

	//		ctx.translate(this.point.x, this.point.y);
	//		ctx.scale(scale, scale);
	//		ctx.globalAlpha = 1 - this.progress;
	//		drawAttack(this.name, ctx);
	//		ctx.globalAlpha = 1;
	//	}
	//}

	class DamageAnimation extends Animation
	{
		constructor(private name: string, private point: Point)
		{
			super(1000);
		}

		draw(ctx: CanvasRenderingContext2D, xform: Xform)
		{
			let offset = Util.querp(0, 100, this.progress);

			let point = xform.transformPoint(this.point);
			ctx.translate(point.x, point.y - offset);
			ctx.globalAlpha = 1 - this.progress * this.progress;
			drawAttack(this.name, ctx);
			ctx.globalAlpha = 1;
		}
	}

	class PauseAnimation extends Animation
	{
		constructor(private name: string, private point: Point, duration: number)
		{
			super(duration);
		}

		draw(ctx: CanvasRenderingContext2D, xform: Xform)
		{
			let point = xform.transformPoint(this.point);
			ctx.translate(point.x, point.y);
			drawAttack(this.name, ctx);
		}
	}

	class MoveAnimation extends Animation
	{
		constructor(private name: string, private pointA: Point, private pointB: Point)
		{
			super(500);
		}

		draw(ctx: CanvasRenderingContext2D, xform: Xform)
		{
			let pointA = xform.transformPoint(this.pointA);
			let pointB = xform.transformPoint(this.pointB);

			let x = Util.querp(pointA.x, pointB.x, this.progress);
			let y = Util.querp(pointA.y, pointB.y, this.progress);

			ctx.translate(x, y);
			ctx.rotate(2 * Math.PI * this.progress * 2 * (pointA.x > pointB.x ? -1 : 1));
			drawAttack(this.name, ctx);
		}
	}

	export class ArenaPage extends Page
	{
		para: HTMLParagraphElement;
		scroller: HTMLDivElement;
		button: HTMLButtonElement;
		selectA: HTMLSelectElement;
		selectB: HTMLSelectElement;
		canvas: Canvas;
		backgroundImage: CanvasImage = new CanvasImage();
		imageA: CanvasImage = new CanvasImage();
		imageB: CanvasImage = new CanvasImage();
		sequence: Sequence = null;
		timer: number = 0;
		healths: number[][] = [];

		constructor()
		{
			super('Arena');

			let topDiv = document.createElement('div');
			topDiv.id = 'arena_top_div';

			this.selectA = document.createElement('select');
			this.selectB = document.createElement('select');

			this.selectA.addEventListener('change', this.onFightersChanged);
			this.selectB.addEventListener('change', this.onFightersChanged);

			let makeOption = function(id: string)
			{
				let option = document.createElement('option');
				option.text = Model.state.fighters[id].name;
				if (Model.state.fighters[id].isDead())
					option.text += ' (x_x)';
				return option;
			};

			for (let id in Model.state.fighters)
			{
				this.selectB.options.add(makeOption(id));
				this.selectA.options.add(makeOption(id));
			}

			if (this.selectB.options.length > 1)
				this.selectB.selectedIndex = 1;

			this.button = document.createElement('button');
			this.button.addEventListener('click', this.onStartButton);

			topDiv.appendChild(this.selectA);
			topDiv.appendChild(this.selectB);
			topDiv.appendChild(this.button);

			this.para = document.createElement('p');
			this.para.style.margin = '0';
			
			this.scroller = document.createElement('div');
			this.scroller.id = 'arena_scroller';
			this.scroller.className = 'scroller';
			this.scroller.appendChild(this.para);

			let canvas = document.createElement('canvas');
			canvas.id = 'arena_canvas';
			this.canvas = new Canvas(canvas);

			this.div.appendChild(topDiv);
			this.div.appendChild(canvas);
			this.div.appendChild(this.scroller);

			this.backgroundImage.loadImage(Data.Misc.ArenaBackgroundImage, () => { this.draw() });

			this.update();
			this.updateStartButton();
			this.updateHealths();
			this.updateImages();
		}

		onShow()
		{
			this.canvas.element.width = View.Width;
			this.canvas.element.height = View.Width * this.canvas.element.clientHeight / this.canvas.element.clientWidth;

			if (Model.state.fight)
			{
				let fighterIDs = Model.state.getFighterIDs();
				this.selectA.selectedIndex = fighterIDs.indexOf(Model.state.fight.teams[0][0]);
				this.selectB.selectedIndex = fighterIDs.indexOf(Model.state.fight.teams[1][0]);

				this.doAttack();
			}

			this.draw();
		}

		onClose()
		{
			return Model.state.fight == null;
		}

		onStartButton = () =>
		{
			if (Model.state.fight)
			{
				Model.state.endFight();
				this.updateStartButton()
				this.sequence = null;
				this.draw();
				return;
			}

			let teams: Model.Fight.Team[] = [];

			let fighterIDs = Model.state.getFighterIDs();

			teams.push([fighterIDs[this.selectA.selectedIndex]]);
			teams.push([fighterIDs[this.selectB.selectedIndex]]);

			Model.state.startFight(teams[0], teams[1]);

			this.selectA.disabled = this.selectB.disabled = true;
			this.updateStartButton();

			this.doAttack();
		}
		
		doAttack()
		{
			Util.assert(!!Model.state.fight);

			if (!this.timer)
				this.timer = window.setInterval(this.onTick, 40);

			let attackerIndex = Model.state.fight.nextTeamIndex;
			let result = Model.state.fight.step();
			let defenderIndex = Model.state.fight.nextTeamIndex;

			this.update();
			if (Model.state.fight.finished)
			{
				Model.state.endFight();
				this.updateStartButton();
			}

			let fighters = this.getFighters();
			let targetPart = fighters[defenderIndex].getBodyParts()[result.targetIndex];

			this.sequence = new Sequence();
			let pointA = this.getImageRect(attackerIndex).centre();
			let pointB = this.getBodyPartPoint(defenderIndex, targetPart);

			this.sequence.items.push(new GrowAnimation(result.name, pointA));
			this.sequence.items.push(new PauseAnimation(result.name, pointA, 500));
			this.sequence.items.push(new MoveAnimation(result.name, pointA, pointB));

			let damageString = result.attackDamage.toString() + ' x ' + (100 - result.defense).toString() + '%';
			let damageAnim = new DamageAnimation(damageString, pointB);
			damageAnim.onStart = () => { this.updateHealths(); }
			this.sequence.items.push(damageAnim);
			this.sequence.items.push(new Animation(1000));
			this.sequence.start();
		}

		onTick = () =>
		{
			if (this.sequence)
			{
				if (this.sequence.update())
				{
					this.draw();
				}
				else
				{
					this.sequence = null;
					if (Model.state.fight)
						this.doAttack();
					else
						window.clearInterval(this.timer);
				}
			}
		}

		onFightersChanged = () =>
		{
			this.updateStartButton();
			this.updateHealths();
			this.updateImages();
		}

		getFighters()
		{
			let fighterIDs = Model.state.getFighterIDs();
			let fighterA = this.selectA.selectedIndex < 0 ? null : Model.state.fighters[fighterIDs[this.selectA.selectedIndex]];
			let fighterB = this.selectB.selectedIndex < 0 ? null : Model.state.fighters[fighterIDs[this.selectB.selectedIndex]];
			return [fighterA, fighterB];
		}

		updateStartButton()
		{
			if (Model.state.fight)
			{
				this.button.innerText = 'Stop';
				this.button.disabled = false;
				return;
			}

			this.button.innerText = 'Start';
			let fighters = this.getFighters();
			this.button.disabled = !fighters[0] || !fighters[1] || fighters[0] == fighters[1] || fighters[0].isDead() || fighters[1].isDead();
		}

		update()
		{
			if (!Model.state.fight)
				return;

			let atEnd = Math.abs(this.scroller.scrollTop + this.scroller.clientHeight - this.scroller.scrollHeight) <= 10;

			this.para.innerHTML = Model.state.fight.text;

			if (atEnd)
				this.scroller.scrollTop = this.scroller.scrollHeight;
		}

		updateImages()
		{
			let fighters = this.getFighters();

			if (fighters.indexOf(null) >= 0)
				return;

			this.imageA.loadImage(fighters[0].image, () => { this.draw() });
			this.imageB.loadImage(fighters[1].image, () => { this.draw() });

			this.draw();
		}

		updateHealths()
		{
			let fighters = this.getFighters();
			this.healths.length = 0;
			for (let i = 0; i < 2; ++i)
			{
				this.healths.push([]);
				for (let part of fighters[i].getBodyParts())
					this.healths[this.healths.length - 1].push(part.health);
			}
		}

		getImageRect(index: number)
		{
			let image = index ? this.imageB : this.imageA;
			let rect = new Rect(0, 0, image.image.width, image.image.height);
			let x = this.canvas.element.width / 2 + (index ? 50 : - 50 - rect.width());
			let y = this.canvas.element.height - rect.height();
			rect.offset(x, y);
			return rect;
		}

		getBodyPartPoint(fighterIndex: number, part: Model.BodyPart)
		{
			let fighter = this.getFighters()[fighterIndex];
			let rect = this.getImageRect(fighterIndex);
			let data = part.getInstanceData(fighter.getSpeciesData());
			return new Point(fighterIndex ? rect.right - data.x : rect.left + data.x, rect.top + data.y);
		}

		drawHealthBar(ctx: CanvasRenderingContext2D, centre: Point, current: number, max: number)
		{
			let scale = 5, height = 8;
			ctx.lineWidth = 2;
			ctx.strokeStyle = '#802020';
			ctx.fillStyle = '#f08080';

			let innerRect = new Rect(centre.x - scale * max / 2, centre.y - height / 2, centre.x + scale * max / 2, centre.y + height / 2);
			let outerRect = innerRect.clone();
			outerRect.expand(1, 1, 1, 1);
			innerRect.right = innerRect.left + innerRect.width() * current / max;
			innerRect.fill(ctx);
			outerRect.stroke(ctx);
		}

		drawHealthBars(ctx: CanvasRenderingContext2D, sceneXform: Xform, fighterIndex: number)
		{
			let fighter = this.getFighters()[fighterIndex];
			let parts = fighter.getBodyParts();
			for (let i = 0; i < parts.length; ++i)
			{
				let part = parts[i];
				let data = part.getData(fighter.getSpeciesData());
				let point = this.getBodyPartPoint(fighterIndex, part);
				this.drawHealthBar(ctx, sceneXform.transformPoint(point), this.healths[fighterIndex][i], data.health);
			}
		}

		draw()
		{
			if (!this.backgroundImage.image.complete)
				return;

			let ctx = this.canvas.element.getContext("2d");
			let width = this.canvas.element.width;
			let height = this.canvas.element.height;
			ctx.setTransform(1, 0, 0, 1, 0, 0)
			ctx.clearRect(0, 0, width, height);

			let gotImages = this.imageA.isComplete() && this.imageB.isComplete();
			let rectA: Rect, rectB: Rect;
			let sceneXform = new Xform();

			if (gotImages)
			{
				rectA = this.getImageRect(0);
				rectB = this.getImageRect(1);

				// Scale to fit.
				let scaleX = Math.max(rectA.width(), rectB.width()) / 1485; // Giant crab.
				let scaleY = Math.max(rectA.height(), rectB.height()) / 848; // Giant crab.
				let scale = Math.max(Math.max(scaleX, scaleY), 0.4);

				sceneXform.matrix = sceneXform.matrix.translate(640, height);
				sceneXform.matrix = sceneXform.matrix.scale(1 / scale);
				sceneXform.matrix = sceneXform.matrix.translate(-640, -height);
			}

			ctx.save();
			sceneXform.apply(ctx);
			ctx.scale(1280 / 800, 1280 / 800);
			Util.scaleCentred(ctx, 1.5, 400, 0);
			ctx.translate(-12, -200);
			this.backgroundImage.draw(ctx);
			ctx.restore();

			if (!gotImages)
				return;

			// Scale because all the animals are too big. 
			sceneXform.matrix = sceneXform.matrix.translate(640, height);
			sceneXform.matrix = sceneXform.matrix.scale(0.4);
			sceneXform.matrix = sceneXform.matrix.translate(-640, -height);

			let fighters = this.getFighters();
			ctx.fillStyle = '#80f080';

			ctx.save();
			sceneXform.apply(ctx);
			ctx.translate(rectA.left, rectA.top);
			this.imageA.draw(ctx);
			ctx.restore();

			ctx.save();
			sceneXform.apply(ctx);
			ctx.translate(rectB.right, rectB.top);
			ctx.scale(-1, 1);
			this.imageB.draw(ctx);
			ctx.restore();

			this.drawHealthBars(ctx, sceneXform, 0);
			this.drawHealthBars(ctx, sceneXform, 1);

			//sceneXform.apply(ctx);
			if (this.sequence)
				this.sequence.draw(ctx, sceneXform);
		}
	}
}
