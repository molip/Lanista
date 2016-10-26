"use strict";
var Data;
(function (Data) {
    var Buildings;
    (function (Buildings) {
        var Level = (function () {
            function Level(mapImage, mapX, mapY, shopImage, name, description, cost, buildTime) {
                this.mapImage = mapImage;
                this.mapX = mapX;
                this.mapY = mapY;
                this.shopImage = shopImage;
                this.name = name;
                this.description = description;
                this.cost = cost;
                this.buildTime = buildTime;
            }
            return Level;
        }());
        Buildings.Level = Level;
        function getLevel(id, index) {
            Util.assert(id in Buildings.Levels);
            return index >= 0 && index < Buildings.Levels[id].length ? Buildings.Levels[id][index] : null;
        }
        Buildings.getLevel = getLevel;
    })(Buildings = Data.Buildings || (Data.Buildings = {}));
    var Misc;
    (function (Misc) {
    })(Misc = Data.Misc || (Data.Misc = {}));
})(Data || (Data = {}));
