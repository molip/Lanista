"use strict";

var Controller = {}

Controller.onLoad = function()
{
    Canvas.draw();
}

Controller.onHomeTriggerClicked = function () 
{
    View.showInfo('Home', 'TODO: general stats etc. go here.');
}

Controller.onTownTriggerClicked = function ()
{
    Shop.showShopsPopup();
}
