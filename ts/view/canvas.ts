"use strict";

namespace View 
{
    export class CanvasObject
    {
        constructor() { }
        draw(ctx: CanvasRenderingContext2D) { }
        getRect(): Rect { return null; }
        onClick() {}
        isEnabled() { return true; }
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
        constructor(public id: string, public handler: (id: string) => void)
        {
            super();
        }

        onClick()
        {
            if (this.isEnabled())
                this.handler(this.id);
        }
    }

    export class Building extends Trigger
    {
        levelIndex: number;
        progress = -1;
        constructor(id: string, public handler: (id: string) => void)
        {
            super(id, handler);
            this.levelIndex = -1;
            this.progress = -1;
        }

        isEnabled()
        {
            return Model.state.buildings.getCurrentLevelIndex(this.id) >= 0;
        }

        update()
        {
            let changed = false;
            var index = Model.state.buildings.getCurrentLevelIndex(this.id);

            if (index < 0 && !this.image)
            {
                let level = Data.Buildings.getLevel(this.id, 0);
                this.loadImage(Data.Misc.ConstructionImage);
                this.pos = new Point(level.mapX, level.mapY);
                changed = true;
            }
            else if (this.levelIndex != index)
            {
                this.levelIndex = index;
                var level = Data.Buildings.getLevel(this.id, index);
                this.loadImage(level.mapImage);
                this.pos = new Point(level.mapX, level.mapY);
                changed = true;
            }

            let oldProgress = this.progress;
            if (Model.state.buildings.isConstructing(this.id))
                this.progress = Model.state.buildings.getConstructionProgress(this.id);
            else
                this.progress = -1;

            if (this.progress != oldProgress)
                changed = true;

            return changed;
        }

        draw(ctx: CanvasRenderingContext2D)
        {
            if (this.progress >= 0)
            {
                let rect = this.getRect();
                rect.left = rect.right + 3;
                rect.right += 10;
                rect.top += 3;

                let rect2 = Object.create(rect);
                rect2.top = rect2.bottom - rect2.height() * this.progress;
                ctx.beginPath();
                rect2.path(ctx);
                ctx.closePath();
                ctx.fillStyle = '#80f080';
                ctx.fill();

                ctx.beginPath();
                rect.path(ctx);
                ctx.closePath();
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#208020';
                ctx.stroke();
            }
            super.draw(ctx);
        }
    }
    export class Canvas
    {
        static Objects: CanvasObject[] = [];
        static Buildings: { [key: string]: Building } = {};
        static Scale: number = 1;
        static Offset: Point = new Point(0, 0);
        static BackgroundImage: CanvasImage;

        static init()
        {
            Canvas.BackgroundImage = new CanvasImage();
            Canvas.BackgroundImage.loadImage(Data.Misc.LudusBackgroundImage);
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
                    ctx.strokeStyle = '#8080ff';
                    ctx.stroke();
                }
            }
        }

        static initObjects()
        {
            this.Objects.length = 0;
            this.Buildings = {};

            let town = Data.Misc.TownTrigger;
            let trigger = new View.Trigger('town', Controller.onTownTriggerClicked);
            trigger.loadImage(town.mapImage);
            trigger.pos = new Point(town.mapX, town.mapY);
            this.Objects.push(trigger);

            this.updateObjects();
            this.draw();
        }

        static updateObjects()
        {
            let redraw = false;
            for (var id in Data.Buildings.Levels)
            {
                if (Model.state.buildings.getCurrentLevelIndex(id) >= 0 || Model.state.buildings.isConstructing(id))
                {
                    let building = this.Buildings[id];
                    if (!(id in this.Buildings))
                    {
                        building = new Building(id, Controller.onBuildingTriggerClicked);
                        this.Buildings[id] = building;
                        this.Objects.push(building);
                    }

                    if (building.update())
                        redraw = true;
                }
            }
            if (redraw)
                this.draw();
        }
    }
}
