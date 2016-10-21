"use strict";
var View;
(function (View) {
    var Trigger = (function () {
        function Trigger(id, x, y, imgPath) {
            this.id = id;
            this.x = x;
            this.y = y;
            this.image = Canvas.makeImage(imgPath);
        }
        return Trigger;
    }());
    View.Trigger = Trigger;
    var Canvas = (function () {
        function Canvas() {
        }
        Canvas.init = function () {
            Canvas.BackgroundImage = this.makeImage(View.Data.LudusBackground.mapImage);
        };
        Canvas.onResize = function () {
            this.draw();
        };
        Canvas.devToLog = function (x, y) {
            return new Point((x - this.Offset.x) / this.Scale, (y - this.Offset.y) / this.Scale);
        };
        Canvas.updateTransform = function () {
            var canvas = View.getCanvas();
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            if (!this.BackgroundImage.complete) {
                this.Offset = new Point(0, 0);
                this.Scale = 1;
            }
            var sx = canvas.width / this.BackgroundImage.width;
            var sy = canvas.height / this.BackgroundImage.height;
            var imageAspect = this.BackgroundImage.width / this.BackgroundImage.height;
            if (sx < sy) {
                var devHeight = canvas.width / imageAspect;
                this.Offset = new Point(0, (canvas.height - devHeight) / 2);
                this.Scale = sx;
            }
            else {
                var devWidth = canvas.height * imageAspect;
                this.Offset = new Point((canvas.width - devWidth) / 2, 0);
                this.Scale = sy;
            }
        };
        Canvas.draw = function () {
            this.updateTransform();
            var canvas = View.getCanvas();
            var ctx = canvas.getContext("2d");
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.translate(this.Offset.x, this.Offset.y);
            ctx.scale(this.Scale, this.Scale);
            ctx.drawImage(this.BackgroundImage, 0, 0);
            for (var i = 0, trigger; trigger = View.Canvas.Triggers[i]; ++i) {
                ctx.drawImage(trigger.image, trigger.x, trigger.y);
                if (trigger == Controller.Canvas.HotTrigger) {
                    ctx.beginPath();
                    ctx.rect(trigger.x, trigger.y, trigger.image.width, trigger.image.height);
                    ctx.closePath();
                    ctx.lineWidth = 3;
                    ctx.stroke();
                }
            }
        };
        Canvas.makeImage = function (imgPath) {
            var image = new Image();
            image.onload = function () { View.Canvas.draw.call(View.Canvas); };
            image.src = imgPath;
            return image;
        };
        Canvas.Triggers = [];
        Canvas.Scale = 1;
        Canvas.Offset = new Point(0, 0);
        return Canvas;
    }());
    View.Canvas = Canvas;
})(View || (View = {}));
