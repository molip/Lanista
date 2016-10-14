"use strict";

View.Canvas = {}
View.Canvas.Triggers = [];

View.Canvas.init = function ()
{
    this.BackgroundImage = this.makeImage(View.Data.LudusBackground.mapImage)
}

View.Canvas.draw = function ()
{
    var canvas = View.getCanvas();
    var ctx = canvas.getContext("2d");

    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(this.BackgroundImage, 0, 0);

    for (var i = 0, trigger; trigger = View.Canvas.Triggers[i]; ++i)
    {
		ctx.drawImage(trigger.image, trigger.x, trigger.y); 

        if (trigger == Controller.Canvas.HotTrigger)
        {
            ctx.beginPath();
            ctx.rect(trigger.x, trigger.y, trigger.image.width, trigger.image.height);
            ctx.closePath();
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }
}

View.Canvas.makeImage = function(imgPath) 
{
	var image = new Image();
    image.onload = function() { View.Canvas.draw.call(View.Canvas); };
	image.src = imgPath;
    return image;
}

View.Canvas.makeTrigger = function(id, x, y, imgPath) 
{
	return {id:id, x:x, y:y, image:this.makeImage(imgPath)}; 
}

