"use strict";

Controller.Canvas = {}

Controller.Canvas.HotTrigger = null;

Controller.Canvas.hitTestTriggers = function (x, y)
{
    for (var i = 0; i < Triggers.length; ++i)
    {
        var trigger = Triggers[i];
        var id = trigger.getImageID();
        if (id)
        {
            var image = TriggerImages[id];
            if (x >= image.x && y >= image.y)
            {
                var element = document.getElementById(image.elementID);
                if (x - image.x < element.width && y - image.y < element.height)
                    return trigger;
            }
        }
    }
    return null;
}

Controller.Canvas.onClick = function (e)
{
    if (this.HotTrigger)
        this.HotTrigger.onClicked();
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
