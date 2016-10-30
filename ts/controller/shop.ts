"use strict";

namespace Controller
{
    export namespace Shop
    {
        class Item extends Popup.Item
        {
            constructor(title: string, description: string, image: string, locked: boolean, public price: number, public handler: any, public data?: any)
            {
                super(title, title + '<br>' + Util.formatMoney(price), image, locked || price > Model.state.getMoney(), handler);
            }
        }

        function getShopTitle(name: string)
        {
            return name + ' (money available: ' + Util.formatMoney(Model.state.getMoney()) + ')';
        }

        export function showShopsPopup()
        {
            var items: Popup.Item[] = [];
            items.push(new Popup.Item('Builders\' Merchant', 'Buy building kits', 'images/builders.jpg', false, onBuildersMerchantClicked));
            items.push(new Popup.Item('Animal Market', 'Buy animals', 'images/animals.jpg', false, onAnimalMarketClicked));
            items.push(new Popup.Item('People Market', 'Buy people', 'images/people.png', true));
            items.push(new Popup.Item('Armourer', 'Buy armour', 'images/armourer.jpg', true));

            Popup.show('Let\'s go shopping!', items, function (item: Popup.Item) { item.handler(); });
        }

        function onBuildersMerchantClicked()
        {
            var items: Popup.Item[] = [];

            for (var i = 0, id: string; id = ['home', 'barracks', 'kennels', 'storage', 'weapon', 'armour', 'training', 'surgery', 'lab', 'merch'][i]; ++i)
            {
                var level = Data.Buildings.getLevel(id, Model.state.buildings.getNextUpgradeIndex(id));
                if (level)
                {
                    var item = new Item(level.name, level.description, level.shopImage, !Model.state.buildings.canUpgrade(id), level.cost, null, { id: id });
                    items.push(item);
                }
            }

            Popup.show(getShopTitle('Builders\' Merchant'), items, function (item: Item) 
            {
                Model.state.buildings.buyUpgrade(item.data.id);
                Controller.updateHUD();
                View.Canvas.updateObjects();
            });
        }

        function onAnimalMarketClicked()
        {
            let items: Popup.Item[] = [];
            let kennels = Model.state.buildings.getCurrentLevelIndex('kennels') >= 0;
            for (let id in Data.Animals.Types)
            {
                let type = Data.Animals.Types[id];
                items.push(new Item(type.name, type.description, type.shopImage, !kennels, type.cost, null, { id: id }));
            }

            Popup.show(getShopTitle('Animal Market'), items, function (item: Item) 
            {
                Model.state.buyAnimal(item.data.id);
                Controller.updateHUD();
            });
        }
    }
}