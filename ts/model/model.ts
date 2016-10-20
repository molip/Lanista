"use strict";

var Model = {}

Model.State = function ()
{
    this.money = 1000;
    this.buildings = new Model.Buildings.State();
}

Model.init = function ()
{
    let str = localStorage.getItem('state', JSON.stringify(this._state));
    if (str)
        this._state = JSON.parse(str);
    else 
        this.resetState();
}

Model.saveState = function(amount) 
{
    localStorage.setItem('state', JSON.stringify(this._state));
}

Model.resetState = function () 
{
    this._state = new Model.State();
    localStorage.clear();
}

Model.getMoney = function () { return this._state.money; }

Model.spendMoney = function(amount) 
{
    Util.assert(amount >= 0 && this._state.money >= amount);
    this._state.money -= amount;
    this.saveState();
}

Model.addMoney = function (amount) {
    Util.assert(amount >= 0);
    this._state.money += amount;
    this.saveState();
}

