﻿"use strict";
var Controller;
(function (Controller) {
    function onLoad() {
        Model.init();
        View.init();
        updateTriggers();
        updateHUD();
    }
    Controller.onLoad = onLoad;
    function onBuildingTriggerClicked(id) {
        var handlers = {
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
    Controller.onBuildingTriggerClicked = onBuildingTriggerClicked;
    function onResetClicked() {
        if (confirm('Reset game?')) {
            Model.resetState();
            updateHUD();
            updateTriggers();
        }
    }
    Controller.onResetClicked = onResetClicked;
    function onHomeTriggerClicked() {
        View.showInfo('Home', 'TODO: general stats etc. go here.');
    }
    function onBarracksTriggerClicked() {
        View.showInfo('Barracks', 'TODO.');
    }
    function onKennelsTriggerClicked() {
        View.showInfo('Kennels', 'TODO.');
    }
    function onStorageTriggerClicked() {
        View.showInfo('Storage', 'TODO.');
    }
    function onWeaponTriggerClicked() {
        View.showInfo('Weapon', 'TODO.');
    }
    function onArmourTriggerClicked() {
        View.showInfo('Armour', 'TODO.');
    }
    function onTrainingTriggerClicked() {
        View.showInfo('Training', 'TODO.');
    }
    function onSurgeryTriggerClicked() {
        View.showInfo('Surgery', 'TODO.');
    }
    function onLabTriggerClicked() {
        View.showInfo('Lab', 'TODO.');
    }
    function onMerchTriggerClicked() {
        View.showInfo('Merch', 'TODO.');
    }
    function onTownTriggerClicked() {
        Controller.Shop.showShopsPopup();
    }
    function updateHUD() {
        var text = 'Money: ' + Util.formatMoney(Model.state.getMoney());
        View.setHUDText(text);
    }
    Controller.updateHUD = updateHUD;
    function updateTriggers() {
        var triggers = [];
        var town = View.Data.TownTrigger;
        triggers.push(new View.Trigger('town', new Point(town.mapX, town.mapY), town.mapImage, onTownTriggerClicked));
        for (var _i = 0, _a = Model.Buildings.getTypes(); _i < _a.length; _i++) {
            var id = _a[_i];
            var x = Model.state.buildings;
            var index = Model.state.buildings.getCurrentLevelIndex(id);
            if (index >= 0) {
                var level = View.Data.Buildings.getLevel(id, index);
                triggers.push(new View.Trigger(id, new Point(level.mapX, level.mapY), level.mapImage, onBuildingTriggerClicked));
            }
        }
        View.Canvas.Objects = triggers;
        View.Canvas.draw();
    }
    Controller.updateTriggers = updateTriggers;
})(Controller || (Controller = {}));
