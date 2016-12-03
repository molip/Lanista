"use strict";

namespace Controller
{
	export namespace Canvas
	{
		export let HotObject: View.CanvasObject = null;

		function hitTestObjects(x: number, y: number): View.CanvasObject
		{
			for (let obj of View.Canvas.Objects)
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
			let devPos: Point = Util.getEventPos(e, View.getCanvas());
			let logPos: Point = View.Canvas.devToLog(devPos.x, devPos.y);
			let obj: View.CanvasObject = hitTestObjects(logPos.x, logPos.y);
			if (obj != HotObject)
			{
				HotObject = obj;
				View.Canvas.draw();
			}
		}

		export function onMouseOut()
		{
			if (HotObject)
			{
				HotObject = null;
				View.Canvas.draw();
			}
		}
	}
}
