"use strict";

namespace Controller
{
    export namespace Canvas
    {
        export let HotTrigger: View.Trigger = null;

        function hitTestTriggers(x, y): View.Trigger
        {
            for (var i = 0, trigger; trigger = View.Canvas.Triggers[i]; ++i)
            {
                if (x >= trigger.x && y >= trigger.y)
                {
                    if (x - trigger.x < trigger.image.width && y - trigger.y < trigger.image.height)
                        return trigger;
                }
            }
            return null;
        }

        export function onClick(e)
        {
            if (HotTrigger)
                Controller.onTriggerClicked(HotTrigger.id);
        }

        export function onMouseMove(e)
        {
            let devPos: Point = Util.getEventPos(e, View.getCanvas());
            let logPos: Point = View.Canvas.devToLog(devPos.x, devPos.y);
            var trigger: View.Trigger = hitTestTriggers(logPos.x, logPos.y);
            if (trigger != HotTrigger)
            {
                HotTrigger = trigger;
                View.Canvas.draw();
            }
        }

        export function onMouseOut(e)
        {
            if (HotTrigger)
            {
                HotTrigger = null;
                View.Canvas.draw();
            }
        }
    }
}