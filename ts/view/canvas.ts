"use strict";

namespace View 
{
    export class Trigger
    {
        image;
        constructor(public id: string, public x: number, public y: number, imgPath: string)
        {
            this.image = Canvas.makeImage(imgPath);
        }
    }

    export class Canvas
    {
        static Triggers: Array<Trigger> = [];
        static Scale: number = 1;
        static Offset: Point = new Point(0, 0);
        static BackgroundImage: HTMLImageElement;

        static init()
        {
            Canvas.BackgroundImage = this.makeImage(View.Data.LudusBackground.mapImage)
        }

        static onResize()
        {
            this.draw();
        }

        static devToLog(x: number, y: number): Point
        {
            return new Point((x - this.Offset.x) / this.Scale, (y - this.Offset.y) / this.Scale);
        }

        static updateTransform()
        {
            let canvas = View.getCanvas();
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;

            if (!this.BackgroundImage.complete)
            {
                this.Offset = new Point(0, 0);
                this.Scale = 1;
            }

            let sx = canvas.width / this.BackgroundImage.width;
            let sy = canvas.height / this.BackgroundImage.height;
            let imageAspect = this.BackgroundImage.width / this.BackgroundImage.height;

            if (sx < sy)
            {
                let devHeight = canvas.width / imageAspect;
                this.Offset = new Point(0, (canvas.height - devHeight) / 2);
                this.Scale = sx;
            }
            else 
            {
                let devWidth = canvas.height * imageAspect;
                this.Offset = new Point((canvas.width - devWidth) / 2, 0);
                this.Scale = sy;
            }
        }

        static draw()
        {
            this.updateTransform();

            var canvas = View.getCanvas();
            var ctx = canvas.getContext("2d");

            ctx.setTransform(1, 0, 0, 1, 0, 0)
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.translate(this.Offset.x, this.Offset.y);
            ctx.scale(this.Scale, this.Scale);

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

        static makeImage(imgPath: string): HTMLImageElement
        {
            var image = new Image();
            image.onload = function () { View.Canvas.draw.call(View.Canvas); };
            image.src = imgPath;
            return image;
        }
    }
}