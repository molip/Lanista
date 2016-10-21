"use strict";

namespace Controller
{
    export namespace Canvas
    {
        export let HotTrigger = null;

        function hitTestTriggers(x, y)
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
            if (this.HotTrigger)
                Controller.onTriggerClicked(this.HotTrigger.id);
        }

        export function onMouseMove(e)
        {
            let devPos = Util.getEventPos(e, View.getCanvas());
            let logPos = View.Canvas.devToLog(devPos.x, devPos.y);
            var trigger = hitTestTriggers(logPos.x, logPos.y);
            if (trigger != HotTrigger)
            {
                HotTrigger = trigger;
                View.Canvas.draw();
            }
        }

        export function onMouseOut(e)
        {
            if (this.HotTrigger)
            {
                HotTrigger = null;
                View.Canvas.draw();
            }
        }
    }
}