"use strict";

function assert(condition, message)
{
    if (!condition)
        alert(message ? 'Assertion failed: ' + message : 'Assertion failed');
}

var Model = {}

Model._money = 100;

Model.getMoney = function() { return this._money; }

Model.spendMoney = function(amount) 
{
    assert(amount >= 0 && this._money >= amount);
    this._money -= amount;
}

Model.addMoney = function (amount) {
    assert(amount >= 0);
    this._money += amount;
}
