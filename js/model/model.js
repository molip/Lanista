"use strict";

var Model = {}

Model._money = 100;

Model.getMoney = function() { return this._money; }

Model.spendMoney = function(amount) 
{
    Util.assert(amount >= 0 && this._money >= amount);
    this._money -= amount;
}

Model.addMoney = function (amount) {
    Util.assert(amount >= 0);
    this._money += amount;
}
