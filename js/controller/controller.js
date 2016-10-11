"use strict";

var Controller = {}

Controller.onLoad = function()
{
	Model.init();
    Controller.updateTriggers();
    Controller.updateHUD();
}

Controller.onTriggerClicked = function (id)
{
	var handlers = { 'home': Controller.onHomeTriggerClicked, 'town': Controller.onTownTriggerClicked };
	Util.assert(handlers[id]);
	handlers[id]();
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

Controller.updateTriggers = function ()
{
	var triggers = [];
	triggers.push(View.Canvas.makeTrigger('town', 1100, 290, 'img_town'));

	for (var id in Model.Buildings.Types)
	{
		var index = Model.Buildings.getCurrentLevelIndex(id);
		if (index >= 0)
		{
			var level = View.Buildings.Types[id][index];
			triggers.push(View.Canvas.makeTrigger(id, level.mapX, level.mapY, 'img_' + id + index));
		}
	}
	View.Canvas.Triggers = triggers;
	View.Canvas.draw();
}
