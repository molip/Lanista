"use strict";

namespace Controller
{
    export namespace Shop
    {
        class Item extends Popup.Item
        {
            constructor(title: string, description: string, image: string, locked: boolean, public price: number, public handler: any, public data?: any)
            {
                super(title, title + '<br>' + Util.formatMoney(price), image, locked, handler);
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
            items.push(new Popup.Item('Animal Market', 'Buy animals', 'images/animals.jpg', true));
            items.push(new Popup.Item('People Market', 'Buy people', 'images/people.png', true));
            items.push(new Popup.Item('Armourer', 'Buy armour', 'images/armourer.jpg', true));

            Popup.show('Let\'s go shopping!', items, function (item: Popup.Item) { item.handler(); });
        }

        function onBuildersMerchantClicked()
        {
            var items: Popup.Item[] = [];

            for (var i = 0, id: string; id = ['home', 'barracks', 'kennels', 'storage', 'weapon', 'armour', 'training', 'surgery', 'lab', 'merch'][i]; ++i)
            {
                var level = Model.state.buildings.getNextLevel(id);
                if (level)
                {
                    var levelIndex = Model.state.buildings.getNextLevelIndex(id);
                    var viewLevel = View.Data.Buildings.getLevel(id, levelIndex);
                    var item = new Item(viewLevel.name, viewLevel.description, viewLevel.shopImage, !Model.state.buildings.canUpgrade(id), level.cost, null, { id: id, levelIndex: levelIndex });
                    items.push(item);
                }
            }

            Popup.show(getShopTitle('Builders\' Merchant'), items, function (item: Item) 
            {
                Model.state.spendMoney(item.price);
                Model.state.buildings.setLevelIndex(item.data.id, item.data.levelIndex);
                Controller.updateHUD();
                Controller.updateTriggers();
            });
        }
    }
}