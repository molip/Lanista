/// <reference path="page.ts" />

namespace View 
{
	class BodySize
	{
		legLength = 100;
		armLength = 80;
		spineLength = 60;
	}

	class BoneHitTest
	{

		constructor(public point: Point) { }
	}

	class Bone
	{
		children: Bone[] = [];
		angle: number = 0

		constructor(/*public x: number, public y: number, */public length: number) { } 

		draw(ctx: CanvasRenderingContext2D, xform: Xform)
		{
			xform.matrix.

			//ctx.translate(this.x, this.y);
			ctx.save();
			ctx.rotate(Math.PI * this.angle / 180);

			ctx.fillRect(-5, -5, 10, this.length + 10);
			ctx.translate(0, this.length);
					    
			for (let child of this.children)
				child.draw(ctx);

			ctx.restore();
		}
	}

	export class PosePage extends Page
	{
		canvas: Canvas;
		root: Bone;
		constructor()
		{
			super('Pose');

			let canvas = document.createElement('canvas');
			canvas.className = 'bottom_section';
			this.canvas = new Canvas(canvas);

			this.div.appendChild(canvas);

			this.root = new Bone(100);

			let upperLegLeft = new Bone(100);
			upperLegLeft.angle = 30;
			this.root.children.push(upperLegLeft);

			let lowerLegLeft = new Bone(80);
			lowerLegLeft.angle = 30;
			upperLegLeft.children.push(lowerLegLeft);

			let upperLegRight = new Bone(100);
			upperLegRight.angle = -30;
			this.root.children.push(upperLegRight);

			let lowerLegRight = new Bone(80);
			lowerLegRight.angle = -30;
			upperLegRight.children.push(lowerLegRight);
		}

		onShow()
		{
			this.canvas.element.width = View.Width;
			this.canvas.element.height = View.Width * this.canvas.element.clientHeight / this.canvas.element.clientWidth;

			this.draw();
		}

		onClose()
		{
			return true;
		}

		draw()
		{
			let ctx = this.canvas.element.getContext("2d");
			let width = this.canvas.element.width;
			let height = this.canvas.element.height;
			ctx.setTransform(1, 0, 0, 1, 0, 0)
			ctx.clearRect(0, 0, width, height);

			ctx.translate(width / 2, height / 2);
			this.root.draw(ctx);
		}
	}
}
