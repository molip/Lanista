"use strict";

Controller.Canvas = {}

Controller.Canvas.HotTrigger = null;

Controller.Canvas.hitTestTriggers = function (x, y)
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

Controller.Canvas.onClick = function (e)
{
    if (this.HotTrigger)
	    Controller.onTriggerClicked(this.HotTrigger.id);
}

Controller.Canvas.onMouseMove = function (e)
{
    var pos = Util.getEventPos(e, View.getCanvas());
    var trigger = this.hitTestTriggers(pos.x, pos.y);
    if (trigger != this.HotTrigger)
    {
        this.HotTrigger = trigger;
        View.Canvas.draw();
    }
}

Controller.Canvas.onMouseOut = function (e)
{
    if (this.HotTrigger)
    {
        this.HotTrigger = null;
        View.Canvas.draw();
    }
}
