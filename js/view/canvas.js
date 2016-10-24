"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var View;
(function (View) {
    var CanvasObject = (function () {
        function CanvasObject() {
        }
        CanvasObject.prototype.draw = function (ctx) { };
        CanvasObject.prototype.getRect = function () { return null; };
        CanvasObject.prototype.onClick = function () { };
        return CanvasObject;
    }());
    View.CanvasObject = CanvasObject;
    var CanvasImage = (function (_super) {
        __extends(CanvasImage, _super);
        function CanvasImage() {
            _super.call(this);
            this.pos = new Point(0, 0);
        }
        CanvasImage.prototype.loadImage = function (path) {
            this.image = new Image();
            this.image.onload = function () { View.Canvas.draw.call(View.Canvas); };
            this.image.src = path;
        };
        CanvasImage.prototype.draw = function (ctx) {
            ctx.drawImage(this.image, this.pos.x, this.pos.y);
        };
        CanvasImage.prototype.getRect = function () {
            return new Rect(this.pos.x, this.pos.y, this.pos.x + this.image.width, this.pos.y + this.image.height);
        };
        return CanvasImage;
    }(CanvasObject));
    View.CanvasImage = CanvasImage;
    var Trigger = (function (_super) {
        __extends(Trigger, _super);
        function Trigger(id, pos, imgPath, handler) {
            _super.call(this);
            this.id = id;
            this.handler = handler;
            this.loadImage(imgPath);
            this.pos = pos;
        }
        Trigger.prototype.onClick = function () {
            this.handler(this.id);
        };
        return Trigger;
    }(CanvasImage));
    View.Trigger = Trigger;
    var Canvas = (function () {
        function Canvas() {
        }
        Canvas.init = function () {
            Canvas.BackgroundImage = new CanvasImage();
            Canvas.BackgroundImage.loadImage(View.Data.LudusBackground.mapImage);
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
            if (!this.BackgroundImage.image.complete) {
                this.Offset = new Point(0, 0);
                this.Scale = 1;
            }
            var sx = canvas.width / this.BackgroundImage.image.width;
            var sy = canvas.height / this.BackgroundImage.image.height;
            var imageAspect = this.BackgroundImage.image.width / this.BackgroundImage.image.height;
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
            this.BackgroundImage.draw(ctx);
            for (var i = 0, obj; obj = this.Objects[i]; ++i) {
                obj.draw(ctx);
                if (obj == Controller.Canvas.HotObject) {
                    ctx.beginPath();
                    obj.getRect().path(ctx);
                    ctx.closePath();
                    ctx.lineWidth = 3;
                    ctx.stroke();
                }
            }
        };
        Canvas.Objects = [];
        Canvas.Scale = 1;
        Canvas.Offset = new Point(0, 0);
        return Canvas;
    }());
    View.Canvas = Canvas;
})(View || (View = {}));
