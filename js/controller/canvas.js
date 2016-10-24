"use strict";
var Controller;
(function (Controller) {
    var Canvas;
    (function (Canvas) {
        Canvas.HotObject = null;
        function hitTestObjects(x, y) {
            for (var _i = 0, _a = View.Canvas.Objects; _i < _a.length; _i++) {
                var obj = _a[_i];
                if (obj.getRect().pointInRect(new Point(x, y)))
                    return obj;
            }
            return null;
        }
        function onClick() {
            if (Canvas.HotObject)
                Canvas.HotObject.onClick();
        }
        Canvas.onClick = onClick;
        function onMouseMove(e) {
            var devPos = Util.getEventPos(e, View.getCanvas());
            var logPos = View.Canvas.devToLog(devPos.x, devPos.y);
            var obj = hitTestObjects(logPos.x, logPos.y);
            if (obj != Canvas.HotObject) {
                Canvas.HotObject = obj;
                View.Canvas.draw();
            }
        }
        Canvas.onMouseMove = onMouseMove;
        function onMouseOut() {
            if (Canvas.HotObject) {
                Canvas.HotObject = null;
                View.Canvas.draw();
            }
        }
        Canvas.onMouseOut = onMouseOut;
    })(Canvas = Controller.Canvas || (Controller.Canvas = {}));
})(Controller || (Controller = {}));
