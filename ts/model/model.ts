"use strict";

namespace Model
{
    export class State
    {
        money: number;
        public buildings: Buildings.State;
        constructor()
        {
            this.money = 1000;
            this.buildings = new Buildings.State();
        }

        getMoney(): number { return state.money; }

        spendMoney(amount: number) 
        {
            Util.assert(amount >= 0 && state.money >= amount);
            state.money -= amount;
            Model.saveState();
        }

        addMoney(amount: number)
        {
            Util.assert(amount >= 0);
            state.money += amount;
            Model.saveState();
        }
    }

    export let state: State;

    export function init()
    {
        let str = localStorage.getItem('state');
        if (str)
        {
            this.state = JSON.parse(str);
            this.state.__proto__ = State.prototype;
            this.state.buildings.__proto__ = Buildings.State.prototype;
        }
        else
            resetState();
    }

    export function saveState()
    {
        localStorage.setItem('state', JSON.stringify(state));
    }

    export function resetState()
    {
        state = new State();
        localStorage.clear();
    }
}