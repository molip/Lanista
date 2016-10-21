"use strict";
var Model;
(function (Model) {
    var State = (function () {
        function State() {
            this.money = 1000;
            this.buildings = new Model.Buildings.State();
        }
        State.prototype.getMoney = function () { return Model.state.money; };
        State.prototype.spendMoney = function (amount) {
            Util.assert(amount >= 0 && Model.state.money >= amount);
            Model.state.money -= amount;
            Model.saveState();
        };
        State.prototype.addMoney = function (amount) {
            Util.assert(amount >= 0);
            Model.state.money += amount;
            Model.saveState();
        };
        State.key = "state.v1";
        return State;
    }());
    Model.State = State;
    function init() {
        var str = localStorage.getItem(State.key);
        if (str) {
            this.state = JSON.parse(str);
            this.state.__proto__ = State.prototype;
            this.state.buildings.__proto__ = Model.Buildings.State.prototype;
        }
        else
            resetState();
    }
    Model.init = init;
    function saveState() {
        localStorage.setItem(State.key, JSON.stringify(Model.state));
    }
    Model.saveState = saveState;
    function resetState() {
        Model.state = new State();
        localStorage.removeItem(State.key);
    }
    Model.resetState = resetState;
})(Model || (Model = {}));
