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
    var handlers = { 
        'home':     Controller.onHomeTriggerClicked, 
        'barracks': Controller.onBarracksTriggerClicked, 
        'kennels':  Controller.onKennelsTriggerClicked, 
        'storage':  Controller.onStorageTriggerClicked, 
        'weapon':   Controller.onWeaponTriggerClicked,  
        'armour':   Controller.onArmourTriggerClicked,  
        'training': Controller.onTrainingTriggerClicked,
        'surgery':  Controller.onSurgeryTriggerClicked, 
        'lab':      Controller.onLabTriggerClicked,     
        'merch':    Controller.onMerchTriggerClicked,   
        'town':     Controller.onTownTriggerClicked,
    };
    Util.assert(handlers[id]);
    handlers[id]();
}

Controller.onResetClicked = function () 
{
    if (confirm('Reset game?'))
    {
        Model.resetState();
        this.updateHUD();
        this.updateTriggers();
    }
}

Controller.onHomeTriggerClicked = function () 
{
    View.showInfo('Home', 'TODO: general stats etc. go here.');
}

Controller.onBarracksTriggerClicked = function () 
{
    View.showInfo('Barracks', 'TODO.');
}

Controller.onKennelsTriggerClicked = function () 
{
    View.showInfo('Kennels', 'TODO.');
}

Controller.onStorageTriggerClicked = function () 
{
    View.showInfo('Storage', 'TODO.');
}

Controller.onWeaponTriggerClicked = function () 
{
    View.showInfo('Weapon', 'TODO.');
}

Controller.onArmourTriggerClicked = function () 
{
    View.showInfo('Armour', 'TODO.');
}

Controller.onTrainingTriggerClicked = function () 
{
    View.showInfo('Training', 'TODO.');
}

Controller.onSurgeryTriggerClicked = function () 
{
    View.showInfo('Surgery', 'TODO.');
}

Controller.onLabTriggerClicked = function () 
{
    View.showInfo('Lab', 'TODO.');
}

Controller.onMerchTriggerClicked = function () 
{
    View.showInfo('Merch', 'TODO.');
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
