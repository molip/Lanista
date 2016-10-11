"use strict";

var Model = {}

Model.State = function ()
{
	this.money = 100;
}

Model.init = function ()
{
	this._state = new Model.State();
}

Model.getMoney = function () { return this._state.money; }

Model.spendMoney = function(amount) 
{
	Util.assert(amount >= 0 && this._state.money >= amount);
	this._state.money -= amount;
}

Model.addMoney = function (amount) {
	Util.assert(amount >= 0);
	this._state.money += amount;
}
