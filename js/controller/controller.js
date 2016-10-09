"use strict";

var Controller = {}

Controller.onLoad = function()
{
    View.Canvas.draw();
    Controller.updateHUD();
}

Controller.onHomeTriggerClicked = function () 
{
    View.showInfo('Home', 'TODO: general stats etc. go here.');
}

Controller.onTownTriggerClicked = function ()
{
    Shop.showShopsPopup();
}

Controller.updateHUD = function ()
{
    var text = 'Money: ' + Util.formatMoney(Model.getMoney());
    View.setHUDText(text);
}
