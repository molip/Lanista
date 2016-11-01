"use strict";

namespace Model
{
    export class State
    {
        static key: string = "state.v2"
        private money: number;
        buildings: Buildings.State;
        animals: Animal[];
        constructor()
        {
            this.money = 1000;
            this.buildings = new Buildings.State();
            this.animals = [];
        }

        update(seconds: number)
        {
            let changed = this.buildings.update(seconds);
            Model.saveState();
            return changed;
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

        buyAnimal(id: string)
        {
            Util.assert(id in Data.Animals.Types);
            this.spendMoney(Data.Animals.Types[id].cost);
            this.animals.push(new Animal(id));
            Model.saveState();
        }
    }

    export let state: State;

    export function init()
    {
        let str = localStorage.getItem(State.key);
        if (str)
        {
            state = JSON.parse(str);
            state.__proto__ = State.prototype;
            state.buildings.__proto__ = Buildings.State.prototype;
        }
        else
            resetState();
    }

    export function saveState()
    {
        localStorage.setItem(State.key, JSON.stringify(state));
    }

    export function resetState()
    {
        state = new State();
        localStorage.removeItem(State.key);
    }
}