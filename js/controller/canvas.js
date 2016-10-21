"use strict";
var Controller;
(function (Controller) {
    var Canvas;
    (function (Canvas) {
        Canvas.HotTrigger = null;
        function hitTestTriggers(x, y) {
            for (var i = 0, trigger; trigger = View.Canvas.Triggers[i]; ++i) {
                if (x >= trigger.x && y >= trigger.y) {
                    if (x - trigger.x < trigger.image.width && y - trigger.y < trigger.image.height)
                        return trigger;
                }
            }
            return null;
        }
        function onClick(e) {
            if (this.HotTrigger)
                Controller.onTriggerClicked(this.HotTrigger.id);
        }
        Canvas.onClick = onClick;
        function onMouseMove(e) {
            var devPos = Util.getEventPos(e, View.getCanvas());
            var logPos = View.Canvas.devToLog(devPos.x, devPos.y);
            var trigger = hitTestTriggers(logPos.x, logPos.y);
            if (trigger != Canvas.HotTrigger) {
                Canvas.HotTrigger = trigger;
                View.Canvas.draw();
            }
        }
        Canvas.onMouseMove = onMouseMove;
        function onMouseOut(e) {
            if (this.HotTrigger) {
                Canvas.HotTrigger = null;
                View.Canvas.draw();
            }
        }
        Canvas.onMouseOut = onMouseOut;
    })(Canvas = Controller.Canvas || (Controller.Canvas = {}));
})(Controller || (Controller = {}));
