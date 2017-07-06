class Point
{
	constructor(public x: number, public y: number) { }
	clone() { return new Point(this.x, this.y); }
	translate(ctx: CanvasRenderingContext2D) { ctx.translate(this.x, this.y); };
}

class Rect
{
	constructor(public left: number, public top: number, public right: number, public bottom: number) { }
	clone() { return new Rect(this.left, this.top, this.right, this.bottom); }
	width() { return this.right - this.left; }
	height() { return this.bottom - this.top; }
	centre() { return new Point((this.left + this.right) / 2, (this.bottom + this.top) / 2); }
	path(ctx: CanvasRenderingContext2D) { ctx.rect(this.left, this.top, this.width(), this.height()); };
	fill(ctx: CanvasRenderingContext2D) { ctx.fillRect(this.left, this.top, this.width(), this.height()); };
	stroke(ctx: CanvasRenderingContext2D) { ctx.strokeRect(this.left, this.top, this.width(), this.height()); };

	expand(left: number, top: number, right: number, bottom: number)
	{
		this.left += left;
		this.top += top;
		this.right += right;
		this.bottom += bottom;
	}

	pointInRect(point: Point)
	{
		return point.x >= this.left && point.y >= this.top && point.x < this.right && point.y < this.bottom;
	}

	offset(dx: number, dy: number)
	{
		this.left += dx; this.right += dx; this.top += dy; this.bottom += dy; 
	}
}

class Xform
{
	matrix: SVGMatrix;
	constructor() 
	{
		this.matrix = document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGMatrix();
	}

	transformPoint(point: Point)
	{
		let svgPoint = document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGPoint();
		svgPoint.x = point.x;
		svgPoint.y = point.y;
		svgPoint = svgPoint.matrixTransform(this.matrix);
		return new Point(svgPoint.x, svgPoint.y);
	}

	apply(ctx: CanvasRenderingContext2D)
	{
		let m = this.matrix;
		ctx.transform(m.a, m.b, m.c, m.d, m.e, m.f);
	}

}