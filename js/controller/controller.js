"use strict";

var Controller = {}

Controller.onLoad = function()
{
	Model.init();
	View.init();
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
    var town = View.Data.TownTrigger;
	triggers.push(View.Canvas.makeTrigger('town', town.mapX, town.mapY, town.mapImage));

	for (var id in Model.Buildings.Types)
	{
		var index = Model.Buildings.getCurrentLevelIndex(id);
		if (index >= 0)
		{
			var level = View.Data.Buildings.Types[id][index];
			triggers.push(View.Canvas.makeTrigger(id, level.mapX, level.mapY, level.mapImage));
		}
	}
	View.Canvas.Triggers = triggers;
	View.Canvas.draw();
}
