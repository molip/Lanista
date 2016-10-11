"use strict";

View.Canvas = {}
View.Canvas.Triggers = [];

View.Canvas.draw = function ()
{
    var canvas = View.getCanvas();
    var ctx = canvas.getContext("2d");
    var img = document.getElementById("img_background");

    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(img, 0, 0);

    for (var i = 0, trigger; trigger = View.Canvas.Triggers[i]; ++i)
    {
		var imgElement = document.getElementById(trigger.imgElementID);
		ctx.drawImage(imgElement, trigger.x, trigger.y); 

        if (trigger == Controller.Canvas.HotTrigger)
        {
            ctx.beginPath();
            ctx.rect(trigger.x, trigger.y, imgElement.width, imgElement.height);
            ctx.closePath();
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }
}

View.Canvas.makeTrigger = function(id, x, y, imgElementID) { return {id:id, x:x, y:y, imgElementID:imgElementID}; }

