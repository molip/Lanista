"use strict";
var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    return Point;
}());
var Rect = (function () {
    function Rect(left, top, right, bottom) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    }
    Rect.prototype.width = function () { return this.right - this.left; };
    Rect.prototype.height = function () { return this.bottom - this.top; };
    return Rect;
}());
