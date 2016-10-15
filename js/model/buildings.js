"use strict";

Model.Buildings = {}

Model.Buildings._makeLevel = function (cost, buildSteps) { return { cost:cost, buildSteps:buildSteps }; }

Model.Buildings.Types = //			cost	build steps
{													
    'home':[	
        Model.Buildings._makeLevel(	0		,3	),		
        Model.Buildings._makeLevel(	50		,5	),
    ],
    'barracks':[
        Model.Buildings._makeLevel(	100		,3	),
        Model.Buildings._makeLevel(	200		,5	),
    ],
    'kennels':[	
        Model.Buildings._makeLevel(	100		,3	),	
        Model.Buildings._makeLevel(	200		,5	),
    ],
    'storage':[	
        Model.Buildings._makeLevel(	100		,3	),	
        Model.Buildings._makeLevel(	200		,5	),
    ],
    'weapon':[	
        Model.Buildings._makeLevel(	100		,3	),	
        Model.Buildings._makeLevel(	200		,5	),
    ],
    'armour':[	
        Model.Buildings._makeLevel(	100		,3	),	
        Model.Buildings._makeLevel(	200		,5	),
    ],
    'training':[
        Model.Buildings._makeLevel(	100		,3	),	
        Model.Buildings._makeLevel(	200		,5	),
    ],
    'surgery':[	
        Model.Buildings._makeLevel(	100		,3	),	
        Model.Buildings._makeLevel(	200		,5	),
    ],	
    'lab':[
        Model.Buildings._makeLevel(	100		,3	),
        Model.Buildings._makeLevel(	200		,5	),
    ],
    'merch':[	
        Model.Buildings._makeLevel(	100		,3	),		
        Model.Buildings._makeLevel(	200		,5	),
    ],
}

Model.Buildings.State = function ()
{
    for (var type in Model.Buildings.Types)
    {
        var free = Model.Buildings.Types[type][0].cost == 0;
        this[type] = { levelIndex: free ? 0 : -1, progress: -1 }
    }
}

Model.Buildings.getCurrentLevelIndex = function(id) 
{
    Util.assert(id in Model._state.buildings);
    return Model._state.buildings[id].levelIndex;
}

Model.Buildings.getNextLevelIndex = function(id) 
{
    var nextIndex = this.getCurrentLevelIndex(id) + 1;
    return nextIndex < Model.Buildings.Types[id].length ? nextIndex : -1;
}

Model.Buildings.getCurrentLevel = function (id)
{
    var index = this.getCurrentLevelIndex(id);
    return index < 0 ? null : Model.Buildings.Types[id][index];
}

Model.Buildings.getNextLevel = function (id)
{
    var index = this.getNextLevelIndex(id);
    return index < 0 ? null : Model.Buildings.Types[id][index];
}

Model.Buildings.setLevelIndex = function (id, index)
{
    Util.assert(id in Model._state.buildings);
    Util.assert(index < Model.Buildings.Types[id].length);
    Model._state.buildings[id].levelIndex = index;
}

Model.Buildings.canUpgrade = function(id) 
{
    Util.assert(id in Model._state.buildings);
    var level = this.getNextLevel(id);
    return level && Model._state.money >= level.cost && this.getRemainingBuildSteps(id) == 0;
}

Model.Buildings.getRemainingBuildSteps = function(id) 
{
    Util.assert(id in Model._state.buildings);
    if (Model._state.buildings[id].progress < 0)
        return 0;

    return Model.Buildings.Types[id].buildSteps - Model._state.buildings[id].progress;
}
