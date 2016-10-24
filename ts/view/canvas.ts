"use strict";

namespace View 
{
    export class CanvasObject
    {
        constructor() { }
        draw(ctx: CanvasRenderingContext2D) { }
        getRect(): Rect { return null; }
        onClick() {}
    }

    export class CanvasImage extends CanvasObject
    {
        image: HTMLImageElement;
        pos: Point;

        constructor()
        {
            super();
            this.pos = new Point(0, 0);
        }

        loadImage(path: string)
        {
            this.image = new Image();
            this.image.onload = function () { View.Canvas.draw.call(View.Canvas); };
            this.image.src = path;
        }

        draw(ctx: CanvasRenderingContext2D)
        {
            ctx.drawImage(this.image, this.pos.x, this.pos.y);
        }

        getRect()
        {
            return new Rect(this.pos.x, this.pos.y, this.pos.x + this.image.width, this.pos.y + this.image.height);
        }
    }

    export class Trigger extends CanvasImage
    {
        constructor(public id: string, pos: Point, imgPath: string, public handler: (id: string) => void)
        {
            super();
            this.loadImage(imgPath);
            this.pos = pos;
        }

        onClick()
        {
            this.handler(this.id);
        }
    }

    export class Canvas
    {
        static Objects: CanvasObject[] = [];
        static Scale: number = 1;
        static Offset: Point = new Point(0, 0);
        static BackgroundImage: CanvasImage;

        static init()
        {
            Canvas.BackgroundImage = new CanvasImage();
            Canvas.BackgroundImage.loadImage(View.Data.LudusBackground.mapImage);
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

            if (!this.BackgroundImage.image.complete)
            {
                this.Offset = new Point(0, 0);
                this.Scale = 1;
            }

            let sx = canvas.width / this.BackgroundImage.image.width;
            let sy = canvas.height / this.BackgroundImage.image.height;
            let imageAspect = this.BackgroundImage.image.width / this.BackgroundImage.image.height;

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

            this.BackgroundImage.draw(ctx);

            for (var i = 0, obj: CanvasObject; obj = this.Objects[i]; ++i)
            {
                obj.draw(ctx);

                if (obj == Controller.Canvas.HotObject)
                {
                    ctx.beginPath();
                    obj.getRect().path(ctx);
                    ctx.closePath();
                    ctx.lineWidth = 3;
                    ctx.stroke();
                }
            }
        }
    }

}
