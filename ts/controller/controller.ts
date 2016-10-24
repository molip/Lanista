"use strict";

namespace Controller
{
    export function onLoad()
    {
        Model.init();
        View.init();
        updateTriggers();
        updateHUD();
    }

    export function onBuildingTriggerClicked(id: string)
    {
        var handlers: { [key: string]: any; } = {
            'home': onHomeTriggerClicked,
            'barracks': onBarracksTriggerClicked,
            'kennels': onKennelsTriggerClicked,
            'storage': onStorageTriggerClicked,
            'weapon': onWeaponTriggerClicked,
            'armour': onArmourTriggerClicked,
            'training': onTrainingTriggerClicked,
            'surgery': onSurgeryTriggerClicked,
            'lab': onLabTriggerClicked,
            'merch': onMerchTriggerClicked,
        };
        Util.assert(handlers[id]);
        handlers[id]();
    }

    export function onResetClicked()
    {
        if (confirm('Reset game?'))
        {
            Model.resetState();
            updateHUD();
            updateTriggers();
        }
    }

    function onHomeTriggerClicked()
    {
        View.showInfo('Home', 'TODO: general stats etc. go here.');
    }

    function onBarracksTriggerClicked()
    {
        View.showInfo('Barracks', 'TODO.');
    }

    function onKennelsTriggerClicked()
    {
        View.showInfo('Kennels', 'TODO.');
    }

    function onStorageTriggerClicked()
    {
        View.showInfo('Storage', 'TODO.');
    }

    function onWeaponTriggerClicked()
    {
        View.showInfo('Weapon', 'TODO.');
    }

    function onArmourTriggerClicked()
    {
        View.showInfo('Armour', 'TODO.');
    }

    function onTrainingTriggerClicked()
    {
        View.showInfo('Training', 'TODO.');
    }

    function onSurgeryTriggerClicked()
    {
        View.showInfo('Surgery', 'TODO.');
    }

    function onLabTriggerClicked()
    {
        View.showInfo('Lab', 'TODO.');
    }

    function onMerchTriggerClicked()
    {
        View.showInfo('Merch', 'TODO.');
    }

    function onTownTriggerClicked()
    {
        Shop.showShopsPopup();
    }

    export function updateHUD()
    {
        var text = 'Money: ' + Util.formatMoney(Model.state.getMoney());
        View.setHUDText(text);
    }

    export function updateTriggers()
    {
        var triggers: View.Trigger[] = [];
        var town = View.Data.TownTrigger;
        triggers.push(new View.Trigger('town', new Point(town.mapX, town.mapY), town.mapImage, onTownTriggerClicked));

        for (var id of Model.Buildings.getTypes())
        {
            var x = Model.state.buildings;
            var index = Model.state.buildings.getCurrentLevelIndex(id);
            if (index >= 0)
            {
                var level = View.Data.Buildings.getLevel(id, index);
                triggers.push(new View.Trigger(id, new Point(level.mapX, level.mapY), level.mapImage, onBuildingTriggerClicked));
            }
        }
        View.Canvas.Objects = triggers;
        View.Canvas.draw();
    }
}
