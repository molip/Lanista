namespace Controller
{
	export namespace Canvas
	{
		export let HotObject: View.CanvasObject = null;

		export function init()
		{
			var canvas = View.ludus.element;
			canvas.addEventListener('click', Controller.Canvas.onClick);
			canvas.addEventListener('mousemove', Controller.Canvas.onMouseMove);
			canvas.addEventListener('mouseout', Controller.Canvas.onMouseOut);
		}

		function hitTestObjects(x: number, y: number): View.CanvasObject
		{
			for (let obj of View.ludus.Objects)
				if (obj.isEnabled() && obj.getRect().pointInRect(new Point(x, y)))
					return obj;
			return null;
		}

		export function onClick()
		{
			if (HotObject)
				HotObject.onClick();
		}

		export function onMouseMove(e: MouseEvent)
		{
			let devPos: Point = Util.getEventPos(e, View.ludus.element);
			let logPos: Point = View.ludus.devToLog(devPos.x, devPos.y);
			let obj: View.CanvasObject = hitTestObjects(logPos.x, logPos.y);
			if (obj != HotObject)
			{
				HotObject = obj;
				View.ludus.draw();
			}
		}

		export function onMouseOut()
		{
			if (HotObject)
			{
				HotObject = null;
				View.ludus.draw();
			}
		}
	}
}
