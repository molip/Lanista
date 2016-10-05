"use strict";

var Canvas = {}

Canvas.HotTrigger = null;

Canvas.getCanvas = function ()
{
    return document.getElementById("canvas_ludus");
}

Canvas.getEventPos = function (event, element)
{
    var rect = element.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

Canvas.draw = function()
{
    var canvas = this.getCanvas();
    var ctx = canvas.getContext("2d");
    var img = document.getElementById("img_background");

    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(img, 0, 0);

    Triggers.forEach(function (trigger)
    {
        var id = trigger.getImageID();
        if (id)
        {
            var image = TriggerImages[id];
            var imgElement = document.getElementById(image.elementID);
            ctx.drawImage(imgElement, image.x, image.y); 
            
            if (trigger == Canvas.HotTrigger)
            {
                ctx.beginPath();
                ctx.rect(image.x, image.y, imgElement.width, imgElement.height);
                ctx.closePath();
                ctx.lineWidth = 3;
                ctx.stroke();
            }
        }
    });
}

Canvas.hitTestTriggers = function(x, y)
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

Canvas.onClick = function (e)
{
    if (this.HotTrigger)
        this.HotTrigger.onClicked();
}

Canvas.onMouseMove = function (e)
{
    var pos = this.getEventPos(e, this.getCanvas());
    var trigger = this.hitTestTriggers(pos.x, pos.y);
    if (trigger != this.HotTrigger)
    {
        this.HotTrigger = trigger;
        this.draw();
    }
}

Canvas.onMouseOut = function (e)
{
    if (this.HotTrigger)
    {
        this.HotTrigger = null;
        this.draw();
    }
}
