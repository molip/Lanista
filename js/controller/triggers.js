"use strict";

var TriggerImages = {
    'home1': { x: 40, y: 230, elementID: 'img_home1' },
    'town': { x: 1100, y: 290, elementID: 'img_town' }
}

// getImageID: Returns a key in TriggerImages. Empty string means not visible. 
var Triggers = [
    { onClicked: Controller.onHomeTriggerClicked, getImageID: function () { return 'home1'; } },
    { onClicked: Controller.onTownTriggerClicked, getImageID: function () { return 'town'; } },
]
