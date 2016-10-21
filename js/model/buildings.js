"use strict";
var Model;
(function (Model) {
    var Buildings;
    (function (Buildings) {
        var Level = (function () {
            function Level(cost, buildSteps) {
                this.cost = cost;
                this.buildSteps = buildSteps;
            }
            return Level;
        }());
        Buildings.Types = {
            'home': [
                new Level(0, 3),
                new Level(50, 5),
            ],
            'barracks': [
                new Level(100, 3),
                new Level(200, 5),
            ],
            'kennels': [
                new Level(100, 3),
                new Level(200, 5),
            ],
            'storage': [
                new Level(100, 3),
                new Level(200, 5),
            ],
            'weapon': [
                new Level(100, 3),
                new Level(200, 5),
            ],
            'armour': [
                new Level(100, 3),
                new Level(200, 5),
            ],
            'training': [
                new Level(100, 3),
                new Level(200, 5),
            ],
            'surgery': [
                new Level(100, 3),
                new Level(200, 5),
            ],
            'lab': [
                new Level(100, 3),
                new Level(200, 5),
            ],
            'merch': [
                new Level(100, 3),
                new Level(200, 5),
            ],
        };
        var State = (function () {
            function State() {
                this.types = {};
                for (var type in Buildings.Types) {
                    var free = Buildings.Types[type][0].cost == 0;
                    this.types[type] = { levelIndex: free ? 0 : -1, progress: -1 };
                }
            }
            State.prototype.getCurrentLevelIndex = function (id) {
                Util.assert(id in this.types);
                return this.types[id].levelIndex;
            };
            State.prototype.getNextLevelIndex = function (id) {
                var nextIndex = this.getCurrentLevelIndex(id) + 1;
                return nextIndex < Buildings.Types[id].length ? nextIndex : -1;
            };
            State.prototype.getCurrentLevel = function (id) {
                var index = this.getCurrentLevelIndex(id);
                return index < 0 ? null : Buildings.Types[id][index];
            };
            State.prototype.getNextLevel = function (id) {
                var index = this.getNextLevelIndex(id);
                return index < 0 ? null : Buildings.Types[id][index];
            };
            State.prototype.setLevelIndex = function (id, index) {
                Util.assert(id in this.types);
                Util.assert(index < Buildings.Types[id].length);
                this.types[id].levelIndex = index;
                Model.saveState();
            };
            State.prototype.canUpgrade = function (id) {
                Util.assert(id in this.types);
                var level = this.getNextLevel(id);
                return level && Model.state.money >= level.cost && this.getRemainingBuildSteps(id) == 0;
            };
            State.prototype.getRemainingBuildSteps = function (id) {
                Util.assert(id in this.types);
                if (this.types[id].progress < 0)
                    return 0;
                return Buildings.Types[id].buildSteps - this.types[id].progress;
            };
            return State;
        }());
        Buildings.State = State;
    })(Buildings = Model.Buildings || (Model.Buildings = {}));
})(Model || (Model = {}));
