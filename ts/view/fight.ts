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

	export class FightPage extends Page
	{
		para: HTMLParagraphElement;
		scroller: HTMLDivElement;
		button: HTMLButtonElement;
		speedCheckboxLabel: HTMLSpanElement;
		speedCheckbox: HTMLInputElement;
		canvas: Canvas;
		backgroundImage: CanvasImage = new CanvasImage();
		imageA: CanvasImage = new CanvasImage();
		imageB: CanvasImage = new CanvasImage();
		sequence: Sequence = null;
		timer: number = 0;
		fighters: Model.Fighter[];
		healths: number[] = [];

		constructor()
		{
			super('Fight');

			Util.assert(Model.state.fight != null);

			let topDiv = document.createElement('div');
			topDiv.className = 'top_section';

			this.button = document.createElement('button');
			this.button.addEventListener('click', this.onStartButton);
			this.button.innerText = 'Start';

			this.speedCheckbox = document.createElement('input');
			this.speedCheckbox.type = 'checkbox';

			this.speedCheckboxLabel = document.createElement('span');
			this.speedCheckboxLabel.innerText = 'Oh, just get on with it!';

			topDiv.appendChild(this.button);
			topDiv.appendChild(this.speedCheckbox);
			topDiv.appendChild(this.speedCheckboxLabel);

			this.para = document.createElement('p');
			this.para.style.margin = '0';
			
			this.scroller = document.createElement('div');
			this.scroller.id = 'fight_scroller';
			this.scroller.className = 'scroller';
			this.scroller.appendChild(this.para);

			let canvas = document.createElement('canvas');
			canvas.className = 'bottom_section';
			this.canvas = new Canvas(canvas);

			this.div.appendChild(topDiv);
			this.div.appendChild(canvas);
			this.div.appendChild(this.scroller);

			this.backgroundImage.loadImage(Data.Misc.FightBackgroundImage, () => { this.draw() });

			this.fighters = [Model.state.fight.getFighter(0), Model.state.fight.getFighter(1)];

			this.update();
			this.updateHealths();
			this.updateImages();
		}

		onShow()
		{
			this.canvas.element.width = View.Width;
			this.canvas.element.height = View.Width * this.canvas.element.clientHeight / this.canvas.element.clientWidth;

			this.draw();
		}

		onClose()
		{
			if (Model.state.fight)
				return false;

			Util.assert(this.timer == 0);
			return true;
		}

		onStartButton = () =>
		{
			Util.assert(Model.state.fight != null);

			if (this.timer)
			{
				this.stopFight();
			}
			else
			{
				this.button.innerText = 'Stop';
				this.doAttack();
				this.timer = window.setInterval(this.onTick, 40);
			}
		}

		stopFight()
		{
			Model.state.endFight();
			this.button.disabled = true;
		}

		doAttack()
		{
			Util.assert(!!Model.state.fight);

			let attackerIndex = Model.state.fight.nextSideIndex;
			let result = Model.state.fight.step();
			let defenderIndex = Model.state.fight.nextSideIndex;

			this.update();
			if (Model.state.fight.finished)
				this.stopFight();

			let sourcePart = this.fighters[attackerIndex].bodyParts[result.sourceID];
			let targetPart = this.fighters[defenderIndex].bodyParts[result.targetID];

			this.sequence = new Sequence(this.speedCheckbox.checked ? 5 : 1);
			let pointA = this.getBodyPartPoint(attackerIndex, sourcePart);
			let pointB = this.getBodyPartPoint(defenderIndex, targetPart);

			this.sequence.items.push(new GrowAnimation(result.name, pointA));
			this.sequence.items.push(new PauseAnimation(result.name, pointA, 500));
			this.sequence.items.push(new MoveAnimation(result.name, pointA, pointB));

			if (result.attackDamage > 0)
			{
				let damageString = result.attackDamage.toString() + ' x ' + (100 - result.defense).toString() + '%';
				let damageAnim = new DamageAnimation(damageString, pointB);
				damageAnim.onStart = () => { this.updateHealths(); }
				this.sequence.items.push(damageAnim);
			}

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
					{
						window.clearInterval(this.timer);
						this.timer = 0;
					}
				}
			}
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
			if (this.fighters.indexOf(null) >= 0)
				return;

			this.imageA.loadImage(this.fighters[0].image, () => { this.draw() });
			this.imageB.loadImage(this.fighters[1].image, () => { this.draw() });

			this.draw();
		}

		updateHealths()
		{
			for (let i = 0; i < 2; ++i)
			{
				if (this.fighters[i])
					this.healths[i] = this.fighters[i].health;
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
			let fighter = this.fighters[fighterIndex];
			let rect = this.getImageRect(fighterIndex);
			let data = part.getInstanceData(fighter.getSpeciesData());
			return new Point(fighterIndex ? rect.right - data.x : rect.left + data.x, rect.top + data.y);
		}

		drawHealthBar(ctx: CanvasRenderingContext2D, base: Point, current: number, max: number)
		{
			let scale = 5, width = 8;
			ctx.lineWidth = 2;
			ctx.strokeStyle = '#802020';
			ctx.fillStyle = '#f08080';

			let innerRect = new Rect(base.x - width / 2, base.y - scale * max, base.x + width / 2, base.y);
			let outerRect = innerRect.clone();
			outerRect.expand(1, 1, 1, 1);
			innerRect.top = innerRect.bottom - innerRect.height() * current / max;
			innerRect.fill(ctx);
			outerRect.stroke(ctx);
		}

		drawHealthBars(ctx: CanvasRenderingContext2D, sceneXform: Xform, fighterIndex: number)
		{
			let fighter = this.fighters[fighterIndex];
			let fighterRect = this.getImageRect(fighterIndex);
			let point = new Point(fighterIndex ? fighterRect.right + 50 : fighterRect.left - 50, fighterRect.bottom - 10);
			this.drawHealthBar(ctx, sceneXform.transformPoint(point), this.healths[fighterIndex], fighter.getSpeciesData().health);
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
