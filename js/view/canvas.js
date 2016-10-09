"use strict";

View.Canvas = {}

View.Canvas.draw = function ()
{
    var canvas = View.getCanvas();
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
            
            if (trigger == Controller.Canvas.HotTrigger)
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
