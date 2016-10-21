"use strict";

class Point
{
    constructor(public x, public y) { }
}

class Rect
{
    constructor(public left, public top, public right, public bottom) { }
    width() { return this.right - this.left; }
    height() { return this.bottom - this.top; }
}

