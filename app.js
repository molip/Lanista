"use strict";
var Controller;
(function (Controller) {
    var Canvas;
    (function (Canvas) {
        Canvas.HotObject = null;
        function init() {
            var canvas = View.ludus.element;
            canvas.addEventListener('click', Controller.Canvas.onClick);
            canvas.addEventListener('mousemove', Controller.Canvas.onMouseMove);
            canvas.addEventListener('mouseout', Controller.Canvas.onMouseOut);
        }
        Canvas.init = init;
        function hitTestObjects(x, y) {
            for (let obj of View.ludus.Objects)
                if (obj.isEnabled() && obj.getRect().pointInRect(new Point(x, y)))
                    return obj;
            return null;
        }
        function onClick() {
            if (Canvas.HotObject)
                Canvas.HotObject.onClick();
        }
        Canvas.onClick = onClick;
        function onMouseMove(e) {
            let devPos = Util.getEventPos(e, View.ludus.element);
            let logPos = View.ludus.devToLog(devPos.x, devPos.y);
            let obj = hitTestObjects(logPos.x, logPos.y);
            if (obj != Canvas.HotObject) {
                Canvas.HotObject = obj;
                View.ludus.draw();
            }
        }
        Canvas.onMouseMove = onMouseMove;
        function onMouseOut() {
            if (Canvas.HotObject) {
                Canvas.HotObject = null;
                View.ludus.draw();
            }
        }
        Canvas.onMouseOut = onMouseOut;
    })(Canvas = Controller.Canvas || (Controller.Canvas = {}));
})(Controller || (Controller = {}));
"use strict";
var Controller;
(function (Controller) {
    function onLoad() {
        Data.validate();
        Model.init();
        View.init();
        Controller.Canvas.init();
        updateHUD();
        window.setInterval(Controller.onTick, 1000);
        window.addEventListener('keydown', Controller.onKeyDown);
        window.addEventListener('resize', View.updateLayout);
        if (Model.state.fight)
            showFightPage();
    }
    Controller.onLoad = onLoad;
    function setSpeed(speed) {
        Model.state.setSpeed(speed);
        View.updateSpeedButtons();
    }
    Controller.setSpeed = setSpeed;
    function onResize() {
        View.updateLayout();
    }
    Controller.onResize = onResize;
    function onTick() {
        if (View.Page.Current)
            return;
        if (View.isTransitioning())
            return;
        switch (Model.state.phase) {
            case Model.Phase.Day:
                View.enable(true);
                if (Model.state.update(1))
                    View.ludus.updateObjects();
                break;
            case Model.Phase.Dawn:
                View.enable(false);
                startTransition(false);
                break;
            case Model.Phase.Dusk:
                View.enable(false);
                startTransition(true);
                break;
            case Model.Phase.News:
                new View.NewsPage(() => { Model.state.advancePhase(); }).show();
                break;
            case Model.Phase.Event:
                new View.ArenaPage().show();
                break;
            case Model.Phase.Fight:
                new View.FightPage().show();
                break;
        }
        updateHUD();
    }
    Controller.onTick = onTick;
    function startTransition(dusk) {
        View.startTransition(new View.Transition(dusk, () => { Model.state.advancePhase(); }));
    }
    function onBuildingTriggerClicked(id) {
        var handlers = {
            'home': onHomeTriggerClicked,
            'barracks': onBarracksTriggerClicked,
            'kennels': onKennelsTriggerClicked,
            'storage': onStorageTriggerClicked,
            'weapon': onWeaponTriggerClicked,
            'armour': onArmourTriggerClicked,
            'training': onTrainingTriggerClicked,
            'surgery': onSurgeryTriggerClicked,
            'lab': onLabTriggerClicked,
            'merch': onMerchTriggerClicked,
            'arena': onArenaTriggerClicked,
        };
        Util.assert(handlers[id]);
        handlers[id]();
    }
    Controller.onBuildingTriggerClicked = onBuildingTriggerClicked;
    function onResetClicked() {
        if (confirm('Reset game?')) {
            Model.resetState();
            updateHUD();
            View.ludus.initObjects();
            View.updateSpeedButtons();
            Controller.onTick();
        }
    }
    Controller.onResetClicked = onResetClicked;
    function onDebugClicked() {
        new View.DebugPage().show();
    }
    Controller.onDebugClicked = onDebugClicked;
    function onHomeTriggerClicked() {
        View.showInfo('Home', 'TODO: general stats etc. go here.');
    }
    function onBarracksTriggerClicked() {
        let page = new View.BarracksPage();
        page.show();
    }
    function onKennelsTriggerClicked() {
        let page = new View.KennelsPage();
        page.show();
    }
    function onStorageTriggerClicked() {
        View.showInfo('Storage', 'TODO.');
    }
    function onWeaponTriggerClicked() {
        View.showInfo('Weapon', 'TODO.');
    }
    function onArmourTriggerClicked() {
        View.showInfo('Armour', 'TODO.');
    }
    function onTrainingTriggerClicked() {
        View.showInfo('Training', 'TODO.');
    }
    function onSurgeryTriggerClicked() {
        View.showInfo('Surgery', 'TODO.');
    }
    function onLabTriggerClicked() {
        View.showInfo('Lab', 'TODO.');
    }
    function onMerchTriggerClicked() {
        View.showInfo('Merch', 'TODO.');
    }
    function onArenaTriggerClicked() {
        View.showInfo('Arena', 'TODO.');
    }
    function onTownTriggerClicked() {
        Controller.Shop.showShopsPage();
    }
    Controller.onTownTriggerClicked = onTownTriggerClicked;
    function showFightPage() {
        let page = new View.FightPage();
        page.show();
    }
    function updateHUD() {
        let money = ' Money: ' + Util.formatMoney(Model.state.getMoney());
        let time = Model.state.getTimeString();
        View.setHUDText(money, time);
    }
    Controller.updateHUD = updateHUD;
    function onKeyDown(evt) {
        if (evt.keyCode == 27)
            View.Page.hideCurrent();
    }
    Controller.onKeyDown = onKeyDown;
})(Controller || (Controller = {}));
"use strict";
var Controller;
(function (Controller) {
    var Shop;
    (function (Shop) {
        function addItem(page, title, description, image, locked, price, handler) {
            page.addItem(title, description + '<br>' + Util.formatMoney(price), image, locked || price > Model.state.getMoney(), handler);
        }
        function getShopTitle(name) {
            return name + ' (money available: ' + Util.formatMoney(Model.state.getMoney()) + ')';
        }
        function showShopsPage() {
            let page = new View.ListPage('Let\'s go shopping!');
            page.addItem('Builders\' Merchant', 'Buy building kits', 'images/builders.jpg', false, onBuildersMerchantClicked);
            page.addItem('Animal Market', 'Buy animals', 'images/animals.jpg', false, onAnimalMarketClicked);
            page.addItem('People Market', 'Buy people', 'images/people.png', false, onPeopleMarketClicked);
            page.addItem('Armourer', 'Buy armour', 'images/armourer.jpg', true, null);
            page.show();
        }
        Shop.showShopsPage = showShopsPage;
        function onBuildersMerchantClicked() {
            let page = new View.ListPage(getShopTitle('Builders\' Merchant'));
            for (let id of ['home', 'arena', 'barracks', 'kennels', 'storage', 'weapon', 'armour', 'training', 'surgery', 'lab', 'merch']) {
                var level = Data.Buildings.getLevel(id, Model.state.buildings.getNextUpgradeIndex(id));
                if (level) {
                    var handler = function () {
                        Model.state.buildings.buyUpgrade(id);
                        Controller.updateHUD();
                        View.ludus.updateObjects();
                    };
                    addItem(page, level.name, level.description, level.shopImage, !Model.state.buildings.canUpgrade(id), level.cost, handler);
                    page.show();
                }
            }
        }
        function onAnimalMarketClicked() {
            let page = new View.ListPage(getShopTitle('Animal Market'));
            let hasKennels = Model.state.buildings.getCurrentLevelIndex('kennels') >= 0;
            for (let id in Data.Animals.Types) {
                var handler = function () {
                    Model.state.buyAnimal(id);
                    Controller.updateHUD();
                };
                let type = Data.Animals.Types[id];
                addItem(page, type.name, type.description, type.shopImage, !hasKennels, type.cost, handler);
                page.show();
            }
        }
        function onPeopleMarketClicked() {
            let page = new View.ListPage(getShopTitle('People Market'));
            let hasBarracks = Model.state.buildings.getCurrentLevelIndex('barracks') >= 0;
            for (let id in Data.People.Types) {
                var handler = function () {
                    Model.state.buyPerson(id);
                    Controller.updateHUD();
                };
                let type = Data.People.Types[id];
                addItem(page, type.name, type.description, type.shopImage, !hasBarracks, type.cost, handler);
                page.show();
            }
        }
    })(Shop = Controller.Shop || (Controller.Shop = {}));
})(Controller || (Controller = {}));
"use strict";
var Data;
(function (Data) {
    class Attack {
        constructor(name, type, damage) {
            this.name = name;
            this.type = type;
            this.damage = damage;
        }
    }
    Data.Attack = Attack;
    class WeaponSite {
        constructor(name, type, replacesAttack) {
            this.name = name;
            this.type = type;
            this.replacesAttack = replacesAttack;
        }
    }
    Data.WeaponSite = WeaponSite;
    class Site {
        constructor(species, type, count) {
            this.species = species;
            this.type = type;
            this.count = count;
        }
    }
    Data.Site = Site;
    var Armour;
    (function (Armour) {
        class Type {
            constructor(name, cost, image, description, sites, defence) {
                this.name = name;
                this.cost = cost;
                this.image = image;
                this.description = description;
                this.sites = sites;
                this.defence = defence;
            }
            validate() {
                for (let site of this.sites) {
                    let speciesData = Species.Types[site.species];
                    if (!(speciesData && speciesData.bodyParts && speciesData.bodyParts[site.type]))
                        console.log('Armour: "%s" site references unknown body part "%s/%s"', this.name, site.species, site.type);
                }
            }
            getDefense(attackType) {
                return this.defence[attackType] ? this.defence[attackType] : 0;
            }
        }
        Armour.Type = Type;
    })(Armour = Data.Armour || (Data.Armour = {}));
    var Weapons;
    (function (Weapons) {
        class Type {
            constructor(name, block, cost, image, description, sites, attacks) {
                this.name = name;
                this.block = block;
                this.cost = cost;
                this.image = image;
                this.description = description;
                this.sites = sites;
                this.attacks = attacks;
            }
            validate() {
                for (let site of this.sites) {
                    let found = false;
                    let speciesData = Species.Types[site.species];
                    if (speciesData) {
                        for (let id in speciesData.bodyParts) {
                            let weaponSite = speciesData.bodyParts[id].weaponSite;
                            if (weaponSite && weaponSite.type == site.type) {
                                found = true;
                                break;
                            }
                        }
                    }
                    if (!found)
                        console.log('Weapon: "%s" site references unknown weapon site "%s/%s"', this.name, site.species, site.type);
                }
            }
        }
        Weapons.Type = Type;
    })(Weapons = Data.Weapons || (Data.Weapons = {}));
    class BodyPartInstance {
        constructor(name, x, y) {
            this.name = name;
            this.x = x;
            this.y = y;
        }
    }
    Data.BodyPartInstance = BodyPartInstance;
    class BodyPart {
        constructor(health, attack, weaponSite, instances) {
            this.health = health;
            this.attack = attack;
            this.weaponSite = weaponSite;
            this.instances = instances;
        }
    }
    Data.BodyPart = BodyPart;
    var Species;
    (function (Species) {
        class Type {
            constructor(name) {
                this.name = name;
            }
        }
        Species.Type = Type;
    })(Species = Data.Species || (Data.Species = {}));
    var Animals;
    (function (Animals) {
        class Type {
            constructor(cost, shopImage, species, name, description, armour, weapons) {
                this.cost = cost;
                this.shopImage = shopImage;
                this.species = species;
                this.name = name;
                this.description = description;
                this.armour = armour;
                this.weapons = weapons;
            }
            validate() {
                if (!Species.Types[this.species])
                    console.log('Animal: "%s" references unknown species "%s"', this.name, this.species);
                if (!Species.Types[this.species].bodyParts)
                    console.log('Animal: "%s" has no body parts', this.name);
                for (let weapon of this.weapons)
                    if (!Weapons.Types[weapon])
                        console.log('Animal: "%s" references unknown weapon "%s"', this.name, weapon);
                for (let armour of this.armour)
                    if (!Armour.Types[armour])
                        console.log('Animal: "%s" references unknown armour "%s"', this.name, armour);
            }
        }
        Animals.Type = Type;
    })(Animals = Data.Animals || (Data.Animals = {}));
    var People;
    (function (People) {
        class Type {
            constructor(cost, shopImage, name, description, armour, weapons) {
                this.cost = cost;
                this.shopImage = shopImage;
                this.name = name;
                this.description = description;
                this.armour = armour;
                this.weapons = weapons;
            }
            validate() {
                for (let weapon of this.weapons)
                    if (!Weapons.Types[weapon])
                        console.log('People: "%s" references unknown weapon "%s"', this.name, weapon);
                for (let armour of this.armour)
                    if (!Armour.Types[armour])
                        console.log('People: "%s" references unknown armour "%s"', this.name, armour);
            }
        }
        People.Type = Type;
    })(People = Data.People || (Data.People = {}));
    var Buildings;
    (function (Buildings) {
        class Level {
            constructor(cost, buildTime, mapX, mapY, mapImage, shopImage, name, description) {
                this.cost = cost;
                this.buildTime = buildTime;
                this.mapX = mapX;
                this.mapY = mapY;
                this.mapImage = mapImage;
                this.shopImage = shopImage;
                this.name = name;
                this.description = description;
            }
        }
        Buildings.Level = Level;
        function getLevel(id, index) {
            Util.assert(id in Buildings.Levels);
            return index >= 0 && index < Buildings.Levels[id].length ? Buildings.Levels[id][index] : null;
        }
        Buildings.getLevel = getLevel;
    })(Buildings = Data.Buildings || (Data.Buildings = {}));
    var Activities;
    (function (Activities) {
        class Type {
            constructor(name, job, human, animal, freeWork) {
                this.name = name;
                this.job = job;
                this.human = human;
                this.animal = animal;
                this.freeWork = freeWork;
            }
        }
        Activities.Type = Type;
    })(Activities = Data.Activities || (Data.Activities = {}));
    function validate() {
        console.log('Validating data...');
        for (let id in Armour.Types)
            Armour.Types[id].validate();
        for (let id in Weapons.Types)
            Weapons.Types[id].validate();
        for (let id in Animals.Types)
            Animals.Types[id].validate();
        for (let id in People.Types)
            People.Types[id].validate();
        console.log('Validating finished.');
    }
    Data.validate = validate;
    var Misc;
    (function (Misc) {
    })(Misc = Data.Misc || (Data.Misc = {}));
})(Data || (Data = {}));
"use strict";
var Model;
(function (Model) {
    class Accessory {
        constructor(tag, bodyPartIDs) {
            this.tag = tag;
            this.bodyPartIDs = bodyPartIDs;
        }
    }
    Model.Accessory = Accessory;
    class Weapon extends Accessory {
        constructor(tag, bodyPartIDs) {
            super(tag, bodyPartIDs);
        }
    }
    Model.Weapon = Weapon;
    class Armour extends Accessory {
        constructor(tag, bodyPartIDs) {
            super(tag, bodyPartIDs);
        }
    }
    Model.Armour = Armour;
})(Model || (Model = {}));
"use strict";
var Model;
(function (Model) {
    var AccessoryType;
    (function (AccessoryType) {
        AccessoryType[AccessoryType["Weapon"] = 0] = "Weapon";
        AccessoryType[AccessoryType["Armour"] = 1] = "Armour";
    })(AccessoryType || (AccessoryType = {}));
    ;
    class BodyPart {
        constructor(id, tag, index, health) {
            this.id = id;
            this.tag = tag;
            this.index = index;
            this.health = health;
        }
        getData(speciesData) {
            return speciesData.bodyParts[this.tag];
        }
        getInstanceData(speciesData) {
            return this.getData(speciesData).instances[this.index];
        }
        // Gets tag of armour or weapon site, if present.
        getSiteTag(accType, speciesData) {
            if (accType == AccessoryType.Armour)
                return this.tag;
            let site = this.getData(speciesData).weaponSite;
            return site ? site.type : null;
        }
    }
    Model.BodyPart = BodyPart;
    class Attack {
        constructor(data, sourceID) {
            this.data = data;
            this.sourceID = sourceID;
        }
    }
    Model.Attack = Attack;
    class Fighter {
        constructor(id, species, name, image, weapons, armour) {
            this.id = id;
            this.species = species;
            this.name = name;
            this.image = image;
            this.bodyParts = {};
            this.nextBodyPartID = 1;
            this.weapons = [];
            this.armour = [];
            this.activity = '';
            this.experience = {};
            let data = this.getSpeciesData();
            for (let tag in data.bodyParts) {
                let part = data.bodyParts[tag];
                for (let i = 0; i < part.instances.length; ++i) {
                    this.bodyParts[this.nextBodyPartID] = new BodyPart(this.nextBodyPartID.toString(), tag, i, part.health);
                    ++this.nextBodyPartID;
                }
            }
            for (let tag of weapons)
                this.addWeapon(tag);
            for (let tag of armour)
                this.addArmour(tag);
        }
        onLoad() {
            for (let id in this.bodyParts)
                this.bodyParts[id].__proto__ = BodyPart.prototype;
            for (let weapon of this.weapons)
                weapon.__proto__ = Model.Weapon.prototype;
            for (let armour of this.armour)
                armour.__proto__ = Model.Armour.prototype;
        }
        isHuman() { return this.species == 'human'; }
        getAccessories(type) {
            return type == AccessoryType.Weapon ? this.weapons : this.armour;
        }
        getSpeciesData() {
            let type = Data.Species.Types[this.species];
            Util.assert(type != undefined);
            return type;
        }
        getOccupiedSites(accType) {
            let bodyPartIDs = [];
            for (let acc of this.getAccessories(accType))
                bodyPartIDs = bodyPartIDs.concat(acc.bodyPartIDs);
            return bodyPartIDs;
        }
        // Returns first available body parts compatible with specified site. 
        findBodyPartsForSite(accType, site) {
            if (site.species != this.species)
                return null;
            let bodyPartIDs = [];
            let occupied = this.getOccupiedSites(accType);
            let speciesData = this.getSpeciesData();
            for (let id in this.bodyParts) {
                let part = this.bodyParts[id];
                if (occupied.indexOf(id) < 0) {
                    if (part.getSiteTag(accType, speciesData) == site.type) {
                        bodyPartIDs.push(id);
                        if (bodyPartIDs.length == site.count)
                            return bodyPartIDs;
                    }
                }
            }
            return null;
        }
        findBodyPartsForAccessory(accType, accTag) {
            let data = accType == AccessoryType.Weapon ? Data.Weapons.Types[accTag] : Data.Armour.Types[accTag];
            for (let site of data.sites) {
                let bodyPartIDs = this.findBodyPartsForSite(accType, site);
                if (bodyPartIDs)
                    return bodyPartIDs;
            }
            return null;
        }
        canAddWeapon(weaponTag) {
            return !!this.findBodyPartsForAccessory(AccessoryType.Weapon, weaponTag);
        }
        canAddArmour(armourTag) {
            return !!this.findBodyPartsForAccessory(AccessoryType.Armour, armourTag);
        }
        addWeapon(weaponTag) {
            // TODO: Choose site.
            let bodyPartIDs = this.findBodyPartsForAccessory(AccessoryType.Weapon, weaponTag);
            if (bodyPartIDs) {
                this.weapons.push(new Model.Weapon(weaponTag, bodyPartIDs));
                return;
            }
            Util.assert(false);
        }
        addArmour(armourTag) {
            // TODO: Choose site.
            let bodyPartIDs = this.findBodyPartsForAccessory(AccessoryType.Armour, armourTag);
            if (bodyPartIDs) {
                this.armour.push(new Model.Armour(armourTag, bodyPartIDs));
                return;
            }
            Util.assert(false);
        }
        getBodyPartArmour(bodyPartID) {
            for (let armour of this.armour)
                for (let id of armour.bodyPartIDs)
                    if (id == bodyPartID)
                        return armour;
            return null;
        }
        getStatus() {
            // Get armour string for each body part.
            let partArmour = {};
            for (let armour of this.armour) {
                let data = Data.Armour.Types[armour.tag];
                for (let partID of armour.bodyPartIDs)
                    partArmour[partID] = data.name + (armour.bodyPartIDs.length > 1 ? '*' : '');
            }
            // Get weapon string for each body part.
            let partWeapons = {};
            for (let weapon of this.weapons) {
                let data = Data.Weapons.Types[weapon.tag];
                for (let partID of weapon.bodyPartIDs)
                    partWeapons[partID] = data.name + (weapon.bodyPartIDs.length > 1 ? '*' : '');
            }
            let speciesData = this.getSpeciesData();
            let rows = [];
            let status = '';
            for (let id in this.bodyParts) {
                let part = this.bodyParts[id];
                let data = speciesData.bodyParts[part.tag];
                let row = [];
                rows.push(row);
                row.push(part.getInstanceData(speciesData).name);
                row.push(part.health.toString() + '/' + data.health);
                row.push(partArmour[id] ? partArmour[id] : '');
                row.push(partWeapons[id] ? partWeapons[id] : '');
            }
            return rows;
        }
        getAttacks() {
            let attacks = [];
            let speciesData = this.getSpeciesData();
            for (let id in this.bodyParts) {
                let part = this.bodyParts[id];
                let data = speciesData.bodyParts[part.tag];
                if (data.attack)
                    attacks.push(new Attack(data.attack, id)); // TODO: Check body part health.
            }
            for (let weapon of this.weapons) {
                let data = Data.Weapons.Types[weapon.tag];
                for (let attack of data.attacks)
                    attacks.push(new Attack(attack, weapon.bodyPartIDs[0])); // Just use the first body part for the source. 
            }
            return attacks;
        }
        getBodyParts() {
            let parts = [];
            for (let id in this.bodyParts)
                parts.push(this.bodyParts[id]); // TODO: Check body part health ? 
            return parts;
        }
        getBodyPartIDs() {
            let ids = [];
            for (let id in this.bodyParts)
                ids.push(id); // TODO: Check body part health ? 
            return ids;
        }
        chooseRandomBodyPart() {
            let targets = this.getBodyPartIDs();
            let targetIndex = Util.getRandomInt(targets.length);
            return targets[targetIndex];
        }
        isDead() {
            for (let id in this.bodyParts)
                if (this.bodyParts[id].health == 0)
                    return true;
            return false;
        }
        resetHealth() {
            for (let part of this.getBodyParts())
                part.health = part.getData(this.getSpeciesData()).health;
            Model.saveState();
        }
        getExperience(tag) {
            return this.experience[tag] || 0;
        }
        addExperience(tag, hours) {
            this.experience[tag] = this.experience[tag] || 0;
            this.experience[tag] += hours;
        }
        getActivity() {
            return this.activity;
        }
        setActivity(tag) {
            this.activity = tag;
            Model.saveState();
        }
    }
    Model.Fighter = Fighter;
})(Model || (Model = {}));
/// <reference path="fighter.ts" />
"use strict";
var Model;
(function (Model) {
    class Animal extends Model.Fighter {
        constructor(id, tag, name) {
            let type = Data.Animals.Types[tag];
            super(id, type.species, name, type.shopImage, type.weapons, type.armour);
        }
    }
    Model.Animal = Animal;
})(Model || (Model = {}));
"use strict";
var Model;
(function (Model) {
    var Buildings;
    (function (Buildings) {
        class State {
            constructor() {
                this.types = {};
                for (var type in Data.Buildings.Levels) {
                    var free = Data.Buildings.getLevel(type, 0).cost == 0;
                    this.types[type] = { levelIndex: free ? 0 : -1, progress: -1 };
                }
            }
            update(hours) {
                let changed = false;
                let buildingCount = 0;
                for (let id in this.types)
                    if (this.isConstructing(id))
                        ++buildingCount;
                for (let id in this.types)
                    if (this.continueConstruction(id, hours / buildingCount))
                        changed = true;
                return changed;
            }
            getCurrentLevelIndex(id) {
                Util.assert(id in this.types);
                return this.types[id].levelIndex;
            }
            getNextLevelIndex(id) {
                var nextIndex = this.getCurrentLevelIndex(id) + 1;
                return nextIndex < this.getLevelCount(id) ? nextIndex : -1;
            }
            getNextUpgradeIndex(id) {
                var index = this.getCurrentLevelIndex(id) + 1;
                if (this.isConstructing(id))
                    ++index;
                return index < this.getLevelCount(id) ? index : -1;
            }
            setLevelIndex(id, index) {
                Util.assert(id in this.types);
                Util.assert(index < this.getLevelCount(id));
                this.types[id].levelIndex = index;
                Model.saveState();
            }
            canUpgrade(id) {
                Util.assert(id in this.types);
                var level = this.getNextLevel(id);
                return level && Model.state.getMoney() >= level.cost && !this.isConstructing(id);
            }
            buyUpgrade(id) {
                Util.assert(this.canUpgrade(id));
                Model.state.spendMoney(this.getNextLevel(id).cost);
                this.types[id].progress = 0;
                Model.saveState();
            }
            isConstructing(id) {
                return this.types[id].progress >= 0;
            }
            continueConstruction(id, manHours) {
                Util.assert(id in this.types);
                if (!this.isConstructing(id))
                    return false;
                let level = this.getNextLevel(id);
                Util.assert(level != null);
                if (this.types[id].progress + manHours >= level.buildTime) {
                    this.types[id].progress = -1;
                    ++this.types[id].levelIndex;
                }
                else
                    this.types[id].progress += manHours;
                return true;
            }
            getConstructionProgress(id) {
                Util.assert(id in this.types);
                let progress = this.types[id].progress;
                if (progress < 0)
                    return 0;
                let level = this.getNextLevel(id);
                Util.assert(level != null);
                return progress / level.buildTime;
            }
            getNextLevel(id) {
                return Data.Buildings.getLevel(id, this.getNextLevelIndex(id));
            }
            getLevelCount(id) {
                return Data.Buildings.Levels[id].length;
            }
        }
        Buildings.State = State;
    })(Buildings = Model.Buildings || (Model.Buildings = {}));
})(Model || (Model = {}));
"use strict";
var Model;
(function (Model) {
    function setEventPrototype(e) {
        if (e.type == 'fight')
            e.__proto__ = FightEvent.prototype;
    }
    Model.setEventPrototype = setEventPrototype;
    class Event {
        constructor(type, day) {
            this.type = type;
            this.day = day;
        }
        getDescription() { Util.assert(false); return ''; }
    }
    Model.Event = Event;
    class FightEvent extends Event {
        constructor(day) {
            super('fight', day);
        }
        getDescription() {
            return 'Fight (day ' + this.day.toString() + ')';
        }
    }
    Model.FightEvent = FightEvent;
})(Model || (Model = {}));
"use strict";
var Model;
(function (Model) {
    var Fight;
    (function (Fight) {
        class AttackResult {
            constructor(name, description, attackDamage, defense, sourceID, targetID) {
                this.name = name;
                this.description = description;
                this.attackDamage = attackDamage;
                this.defense = defense;
                this.sourceID = sourceID;
                this.targetID = targetID;
            }
        }
        Fight.AttackResult = AttackResult;
        class State {
            constructor(teamA, teamB) {
                this.teams = [teamA, teamB];
                this.text = '';
                this.nextTeamIndex = 0;
                this.steps = 0;
                this.finished = false;
            }
            step() {
                // Assume 2 teams of 1 fighter each. 
                let attacker = Model.state.fighters[this.teams[this.nextTeamIndex][0]];
                this.nextTeamIndex = (this.nextTeamIndex + 1) % this.teams.length;
                let defender = Model.state.fighters[this.teams[this.nextTeamIndex][0]];
                let result = this.attack(attacker, defender);
                this.text += result.description + '<br>';
                this.finished = defender.isDead();
                Model.saveState();
                return result;
            }
            attack(attacker, defender) {
                let attacks = attacker.getAttacks();
                let attack = attacks[Util.getRandomInt(attacks.length)];
                let defenderSpeciesData = defender.getSpeciesData();
                let targetID = defender.chooseRandomBodyPart();
                let target = defender.bodyParts[targetID];
                let targetData = target.getData(defenderSpeciesData);
                let armour = defender.getBodyPartArmour(target.id);
                let armourData = armour ? Data.Armour.Types[armour.tag] : null;
                let defense = armourData ? armourData.getDefense(attack.data.type) : 0;
                let damage = attack.data.damage * (100 - defense) / 100;
                let oldHealth = target.health;
                target.health = Math.max(0, oldHealth - damage);
                let msg = attacker.name + ' uses ' + attack.data.name + ' on ' + defender.name + ' ' + targetData.instances[target.index].name + '. ';
                msg += 'Damage = ' + attack.data.damage + ' x ' + (100 - defense) + '% = ' + damage.toFixed(1) + '. ';
                msg += 'Health ' + oldHealth.toFixed(1) + ' -> ' + target.health.toFixed(1) + '. ';
                return new AttackResult(attack.data.name, msg, attack.data.damage, defense, attack.sourceID, targetID);
            }
        }
        Fight.State = State;
    })(Fight = Model.Fight || (Model.Fight = {}));
})(Model || (Model = {}));
"use strict";
var Model;
(function (Model) {
    const minutesPerDay = 60 * 12;
    var Phase;
    (function (Phase) {
        Phase[Phase["Dawn"] = 0] = "Dawn";
        Phase[Phase["News"] = 1] = "News";
        Phase[Phase["Event"] = 2] = "Event";
        Phase[Phase["Fight"] = 3] = "Fight";
        Phase[Phase["Day"] = 4] = "Day";
        Phase[Phase["Dusk"] = 5] = "Dusk";
    })(Phase = Model.Phase || (Model.Phase = {}));
    class State {
        constructor() {
            this.money = 1000;
            this.phase = Phase.Dawn;
            this.buildings = new Model.Buildings.State();
            this.fight = null;
            this.fighters = {};
            this.news = [];
            this.events = [];
            this.nextFighterID = 1;
            this.time = 0; // Minutes.
            this.speed = 1; // Game minutes per second. 
            this.news.push(new Model.News("It's the first day. There will be a fight tomorrow."));
            this.events.push(new Model.FightEvent(1));
        }
        update(seconds) {
            Util.assert(this.phase == Phase.Day);
            let changed = this.addMinutes(seconds * this.speed);
            Model.saveState();
            return changed;
        }
        skipToNextDay() {
            let newTime = (this.getDay() + 1) * minutesPerDay;
            let changed = this.addMinutes(newTime - this.time);
            Model.saveState();
            return changed;
        }
        addMinutes(minutes) {
            let oldDay = this.getDay();
            this.time += minutes;
            let hoursPassed = minutes / 60;
            let changed = this.updateActivities(hoursPassed);
            if (this.getDay() > oldDay) {
                this.phase = Phase.Dusk;
            }
            return changed;
        }
        isNight() { return this.phase == Phase.Dawn || this.phase == Phase.Dusk; }
        advancePhase() {
            switch (this.phase) {
                case Phase.Dawn:
                    this.phase = Phase.News;
                    if (this.news.length == 0)
                        this.advancePhase();
                    break;
                case Phase.News:
                    this.news.length = 0;
                    this.phase = Phase.Event;
                    if (this.getEventsForToday().length == 0)
                        this.advancePhase();
                    break;
                case Phase.Event:
                    Util.assert(this.fight == null); // Otherwise startFight sets the phase. 
                    let today = this.getDay();
                    this.events = this.events.filter(e => e.day != today);
                    this.phase = Phase.Day;
                    break;
                case Phase.Day:
                    this.phase = Phase.Dusk;
                    break;
                case Phase.Dusk:
                    this.phase = Phase.Dawn;
                    break;
            }
            Model.saveState();
        }
        getEventsForToday() {
            let today = this.getDay();
            return this.events.filter(e => e.day == today);
        }
        updateActivities(hours) {
            let workPower = {}; // Activity -> power.
            let workers = {}; // Activity -> workers.
            for (let id in Data.Activities.Types) {
                workPower[id] = Data.Activities.Types[id].freeWork;
                workers[id] = [];
            }
            let UpdateExperience = function (activity) {
                if (activity in workers)
                    for (let i = 0, fighter; fighter = workers[activity][i]; ++i)
                        fighter.addExperience(activity, hours);
            };
            for (let id in this.fighters) {
                let fighter = this.fighters[id];
                let activity = fighter.getActivity();
                Util.assert(activity in Data.Activities.Types);
                if (Data.Activities.Types[activity].job) {
                    workPower[activity] += 1 + fighter.getExperience(activity) * Data.Misc.ExperienceBenefit;
                    workers[activity].push(fighter);
                }
                else {
                }
            }
            // Building, training animals, training gladiators, crafting, repairing:
            let redraw = false;
            if ('build' in workPower && this.buildings.update(hours * workPower['build'])) {
                UpdateExperience('build');
                redraw = true;
            }
            return redraw;
        }
        setSpeed(speed) {
            if (speed > this.speed) {
                this.time = Math.floor(this.time / speed) * speed;
            }
            this.speed = speed;
        }
        getDay() {
            return Math.floor(this.time / minutesPerDay);
        }
        getTimeString() {
            let dusk = this.phase == Phase.Dusk;
            let days = this.getDay() - (dusk ? 1 : 0);
            let hours = dusk ? 12 : Math.floor((this.time % minutesPerDay) / 60);
            let mins = dusk ? 0 : Math.floor(this.time % 60);
            return 'Day ' + (days + 1).toString() + ' ' + ('00' + (hours + 6)).slice(-2) + ':' + ('00' + mins).slice(-2);
        }
        getMoney() { return Model.state.money; }
        spendMoney(amount) {
            Util.assert(amount >= 0 && Model.state.money >= amount);
            Model.state.money -= amount;
            Model.saveState();
        }
        addMoney(amount) {
            Util.assert(amount >= 0);
            Model.state.money += amount;
            Model.saveState();
        }
        buyAnimal(tag) {
            Util.assert(tag in Data.Animals.Types);
            this.spendMoney(Data.Animals.Types[tag].cost);
            this.fighters[this.nextFighterID] = new Model.Animal(this.nextFighterID, tag, this.getUniqueFighterName(Data.Animals.Types[tag].name));
            ++this.nextFighterID;
            Model.saveState();
        }
        buyPerson(tag) {
            Util.assert(tag in Data.People.Types);
            this.spendMoney(Data.People.Types[tag].cost);
            this.fighters[this.nextFighterID] = new Model.Person(this.nextFighterID, tag, this.getUniqueFighterName(Data.People.Types[tag].name));
            ++this.nextFighterID;
            Model.saveState();
        }
        getPeople() {
            let people = [];
            for (let id in this.fighters)
                if (this.fighters[id] instanceof Model.Person)
                    people.push(this.fighters[id]);
            return people;
        }
        getAnimals() {
            let animals = [];
            for (let id in this.fighters)
                if (this.fighters[id] instanceof Model.Animal)
                    animals.push(this.fighters[id]);
            return animals;
        }
        getFighterIDs() {
            let ids = [];
            for (let id in this.fighters)
                ids.push(id);
            return ids;
        }
        startFight(teamA, teamB) {
            Util.assert(this.fight == null);
            Util.assert(this.phase == Phase.Event);
            this.fight = new Model.Fight.State(teamA, teamB);
            this.phase = Phase.Fight;
            Model.saveState();
        }
        endFight() {
            Util.assert(!!this.fight);
            Util.assert(this.time / minutesPerDay == this.getDay()); // Fight must happen at dawn.
            this.fight = null;
            this.time += minutesPerDay; // Skip to tomorrow.
            this.phase = Phase.Dusk;
            Model.saveState();
        }
        getUniqueFighterName(name) {
            let find = (name) => {
                for (let id in this.fighters)
                    if (this.fighters[id].name == name)
                        return true;
                return false;
            };
            let tryName = '';
            let i = 1;
            while (true) {
                let tryName = name + ' ' + i.toString();
                if (!find(tryName))
                    return tryName;
                ++i;
            }
        }
    }
    State.key = "state.v15";
    Model.State = State;
    function init() {
        let str = localStorage.getItem(State.key);
        if (str) {
            Model.state = JSON.parse(str);
            Model.state.__proto__ = State.prototype;
            Model.state.buildings.__proto__ = Model.Buildings.State.prototype;
            if (Model.state.fight)
                Model.state.fight.__proto__ = Model.Fight.State.prototype;
            for (let id in Model.state.fighters) {
                let fighter = Model.state.fighters[id];
                if (fighter.species == 'human')
                    fighter.__proto__ = Model.Person.prototype;
                else
                    fighter.__proto__ = Model.Animal.prototype;
                fighter.onLoad();
            }
            for (let event of Model.state.events)
                Model.setEventPrototype(event);
            if (Model.state.phase == Phase.Dusk)
                Model.state.phase = Phase.Dawn;
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
"use strict";
var Model;
(function (Model) {
    class News {
        constructor(description) {
            this.description = description;
        }
    }
    Model.News = News;
})(Model || (Model = {}));
/// <reference path="fighter.ts" />
"use strict";
var Model;
(function (Model) {
    class Person extends Model.Fighter {
        constructor(id, tag, name) {
            let type = Data.People.Types[tag];
            super(id, 'human', name, type.shopImage, type.weapons, type.armour);
        }
    }
    Model.Person = Person;
})(Model || (Model = {}));
"use strict";
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    clone() { return new Point(this.x, this.y); }
    translate(ctx) { ctx.translate(this.x, this.y); }
    ;
}
class Rect {
    constructor(left, top, right, bottom) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    }
    clone() { return new Rect(this.left, this.top, this.right, this.bottom); }
    width() { return this.right - this.left; }
    height() { return this.bottom - this.top; }
    centre() { return new Point((this.left + this.right) / 2, (this.bottom + this.top) / 2); }
    path(ctx) { ctx.rect(this.left, this.top, this.width(), this.height()); }
    ;
    fill(ctx) { ctx.fillRect(this.left, this.top, this.width(), this.height()); }
    ;
    stroke(ctx) { ctx.strokeRect(this.left, this.top, this.width(), this.height()); }
    ;
    expand(left, top, right, bottom) {
        this.left += left;
        this.top += top;
        this.right += right;
        this.bottom += bottom;
    }
    pointInRect(point) {
        return point.x >= this.left && point.y >= this.top && point.x < this.right && point.y < this.bottom;
    }
    offset(dx, dy) {
        this.left += dx;
        this.right += dx;
        this.top += dy;
        this.bottom += dy;
    }
}
class Xform {
    constructor() {
        this.matrix = document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGMatrix();
    }
    transformPoint(point) {
        let svgPoint = document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGPoint();
        svgPoint.x = point.x;
        svgPoint.y = point.y;
        svgPoint = svgPoint.matrixTransform(this.matrix);
        return new Point(svgPoint.x, svgPoint.y);
    }
    apply(ctx) {
        let m = this.matrix;
        ctx.transform(m.a, m.b, m.c, m.d, m.e, m.f);
    }
}
"use strict";
var Util;
(function (Util) {
    function formatMoney(amount) {
        return '§' + amount;
    }
    Util.formatMoney = formatMoney;
    function getEventPos(event, element) {
        var rect = element.getBoundingClientRect();
        return new Point(event.clientX - rect.left, event.clientY - rect.top);
    }
    Util.getEventPos = getEventPos;
    function assert(condition, message) {
        if (!condition)
            alert(message ? 'Assertion failed: ' + message : 'Assertion failed');
    }
    Util.assert = assert;
    function formatRows(rows) {
        let columns = [];
        for (let i = 0; i < rows.length; ++i)
            for (let j = 0; j < rows[i].length; ++j) {
                if (i == 0)
                    columns[j] = '<table>';
                columns[j] += '<tr><td>' + rows[i][j] + '</tr></td>';
                if (i == rows.length - 1)
                    columns[j] += '</table>';
            }
        return columns;
    }
    Util.formatRows = formatRows;
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
    Util.getRandomInt = getRandomInt;
    function lerp(start, end, param) {
        return start + (end - start) * param;
    }
    Util.lerp = lerp;
    function querp(start, end, param) {
        return start + (end - start) * param * param;
    }
    Util.querp = querp;
    function scaleCentred(ctx, scale, x, y) {
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        ctx.translate(-x, -y);
    }
    Util.scaleCentred = scaleCentred;
})(Util || (Util = {}));
"use strict";
var View;
(function (View) {
    class Animation {
        constructor(duration) {
            this.duration = duration;
            this.startTime = 0;
            this.progress = 0;
            this.onStart = null;
        }
        start(speed) {
            this.duration /= speed;
            this.startTime = new Date().getTime();
            if (this.onStart)
                this.onStart();
        }
        update() {
            let now = new Date().getTime();
            this.progress = (now - this.startTime) / this.duration;
            if (this.progress >= 1) {
                this.progress = 1;
                return false;
            }
            return true;
        }
        draw(ctx, xform) { }
    }
    View.Animation = Animation;
    class Sequence {
        constructor(speed) {
            this.speed = speed;
            this.items = [];
        }
        start() {
            if (this.items.length) {
                this.items[0].start(this.speed);
                return true;
            }
            return false;
        }
        update() {
            if (this.items.length) {
                if (this.items[0].update())
                    return true;
                this.items.shift(); // Finished.
            }
            return this.start();
        }
        draw(ctx, xform) {
            if (this.items.length) {
                ctx.save();
                this.items[0].draw(ctx, xform ? xform : new Xform());
            }
        }
    }
    View.Sequence = Sequence;
})(View || (View = {}));
"use strict";
var View;
(function (View) {
    class Page {
        constructor(title) {
            this.title = title;
            Util.assert(Page.Current == null);
            Page.Current = this;
            this.div = document.createElement('div');
        }
        static hideCurrent() {
            if (Page.Current && Page.Current.onClose()) {
                Page.Current = null;
                let elem = document.getElementById('page');
                elem.className = '';
                elem.innerHTML = '';
            }
        }
        show() {
            let elem = document.getElementById('page');
            elem.innerHTML = '';
            if (this.title) {
                let title = document.createElement('p');
                title.innerText = this.title;
                elem.appendChild(title);
            }
            let backButton = document.createElement('button');
            backButton.id = 'back_button';
            backButton.innerText = 'Back';
            backButton.addEventListener('click', Page.hideCurrent);
            elem.appendChild(backButton);
            elem.appendChild(this.div);
            elem.className = 'show';
            this.onShow();
        }
        onShow() { }
        onClose() { return true; }
    }
    Page.Current = null;
    View.Page = Page;
    class ListPage extends Page {
        constructor(title) {
            super(title);
            this.tableFactory = new View.Table.Factory();
            this.div.appendChild(this.tableFactory.element);
        }
        addItem(title, description, image, locked, handler) {
            let cells = [new View.Table.TextCell('<h4>' + title + '</h4>', 20), new View.Table.ImageCell(image, 20), new View.Table.TextCell(description)];
            this.tableFactory.addRow(cells, locked, function () {
                Page.hideCurrent();
                handler();
            });
        }
    }
    View.ListPage = ListPage;
})(View || (View = {}));
/// <reference path="page.ts" />
"use strict";
var View;
(function (View) {
    class ArenaPage extends View.Page {
        constructor() {
            super('Choose Fighters');
            this.onStartButton = () => {
                let teams = [];
                let fighterIDs = Model.state.getFighterIDs();
                teams.push([fighterIDs[this.selectA.selectedIndex]]);
                teams.push([fighterIDs[this.selectB.selectedIndex]]);
                Model.state.startFight(teams[0], teams[1]);
                View.Page.hideCurrent();
            };
            this.onFightersChanged = () => {
                this.updateStartButton();
            };
            let topDiv = document.createElement('div');
            this.selectA = document.createElement('select');
            this.selectB = document.createElement('select');
            this.selectA.addEventListener('change', this.onFightersChanged);
            this.selectB.addEventListener('change', this.onFightersChanged);
            let makeOption = function (id) {
                let option = document.createElement('option');
                option.text = Model.state.fighters[id].name;
                if (Model.state.fighters[id].isDead())
                    option.text += ' (x_x)';
                return option;
            };
            for (let id in Model.state.fighters) {
                this.selectB.options.add(makeOption(id));
                this.selectA.options.add(makeOption(id));
            }
            if (this.selectB.options.length > 1)
                this.selectB.selectedIndex = 1;
            this.button = document.createElement('button');
            this.button.addEventListener('click', this.onStartButton);
            topDiv.appendChild(this.selectA);
            topDiv.appendChild(this.selectB);
            topDiv.appendChild(this.button);
            this.div.appendChild(topDiv);
            this.updateStartButton();
        }
        onShow() {
        }
        onClose() {
            if (Model.state.fight == null)
                Model.state.advancePhase();
            return true;
        }
        getFighters() {
            let fighterIDs = Model.state.getFighterIDs();
            let fighterA = this.selectA.selectedIndex < 0 ? null : Model.state.fighters[fighterIDs[this.selectA.selectedIndex]];
            let fighterB = this.selectB.selectedIndex < 0 ? null : Model.state.fighters[fighterIDs[this.selectB.selectedIndex]];
            return [fighterA, fighterB];
        }
        updateStartButton() {
            if (Model.state.fight) {
                this.button.innerText = 'Stop';
                this.button.disabled = false;
                return;
            }
            this.button.innerText = 'Start';
            let fighters = this.getFighters();
            this.button.disabled = !fighters[0] || !fighters[1] || fighters[0] == fighters[1] || fighters[0].isDead() || fighters[1].isDead();
        }
    }
    View.ArenaPage = ArenaPage;
})(View || (View = {}));
/// <reference path="page.ts" />
"use strict";
var View;
(function (View) {
    class BarracksPage extends View.Page {
        constructor() {
            super('Barracks');
            let tableFactory = new View.Table.Factory();
            this.div.appendChild(tableFactory.element);
            tableFactory.addColumnHeader('Name', 20);
            tableFactory.addColumnHeader('Image', 30);
            tableFactory.addColumnHeader('Part', 10);
            tableFactory.addColumnHeader('Health', 10);
            tableFactory.addColumnHeader('Armour', 10);
            tableFactory.addColumnHeader('Weapon', 10);
            tableFactory.addColumnHeader('Activity', 10);
            const activityItems = [];
            for (let id in Data.Activities.Types)
                activityItems.push(new View.Table.SelectCellItem(id, Data.Activities.Types[id].name));
            for (let person of Model.state.getPeople()) {
                let cells = [new View.Table.TextCell('<h4>' + person.name + '</h4>'), new View.Table.ImageCell(person.image)];
                for (let c of Util.formatRows(person.getStatus()))
                    cells.push(new View.Table.TextCell('<small>' + c + '</small>'));
                let cell = new View.Table.SelectCell(100, activityItems, (value) => { person.setActivity(value); });
                cell.selectedTag = person.getActivity();
                cells.push(cell);
                tableFactory.addRow(cells, false, null);
            }
        }
    }
    View.BarracksPage = BarracksPage;
})(View || (View = {}));
"use strict";
var View;
(function (View) {
    class CanvasObject {
        constructor() { }
        draw(ctx) { }
        getRect() { return null; }
        onClick() { }
        isEnabled() { return true; }
    }
    View.CanvasObject = CanvasObject;
    class CanvasImage extends CanvasObject {
        constructor() {
            super(...arguments);
            this.pos = new Point(0, 0);
        }
        loadImage(path, onLoad) {
            this.image = new Image();
            this.image.onload = () => { onLoad(); };
            this.image.src = path;
        }
        draw(ctx) {
            ctx.drawImage(this.image, this.pos.x, this.pos.y);
        }
        getRect() {
            return new Rect(this.pos.x, this.pos.y, this.pos.x + this.image.width, this.pos.y + this.image.height);
        }
        isComplete() {
            return this.image && this.image.complete;
        }
    }
    View.CanvasImage = CanvasImage;
    class Canvas {
        constructor(element) {
            this.element = element;
        }
        devToLog(x, y) {
            let scale = this.element.clientWidth / this.element.width;
            return new Point(x / scale, y / scale);
        }
        draw() {
            Util.assert(false);
        }
    }
    View.Canvas = Canvas;
})(View || (View = {}));
/// <reference path="page.ts" />
"use strict";
var View;
(function (View) {
    class DebugPage extends View.Page {
        constructor() {
            super('Debug');
            this.onBuyAllAnimals = () => {
                for (let tag in Data.Animals.Types) {
                    Model.state.addMoney(Data.Animals.Types[tag].cost);
                    Model.state.buyAnimal(tag);
                }
                View.Page.hideCurrent();
            };
            this.onBuyAllPeople = () => {
                for (let tag in Data.People.Types) {
                    Model.state.addMoney(Data.People.Types[tag].cost);
                    Model.state.buyPerson(tag);
                }
                View.Page.hideCurrent();
            };
            this.onBuyAllBuildings = () => {
                for (let tag in Data.Buildings.Levels) {
                    if (Model.state.buildings.canUpgrade(tag)) {
                        var level = Data.Buildings.getLevel(tag, Model.state.buildings.getNextUpgradeIndex(tag));
                        if (level.cost)
                            Model.state.addMoney(level.cost);
                        Model.state.buildings.buyUpgrade(tag);
                    }
                }
                View.Page.hideCurrent();
            };
            this.onHeal = () => {
                for (let id in Model.state.fighters)
                    Model.state.fighters[id].resetHealth();
                View.Page.hideCurrent();
            };
            this.addButton('Buy all animals', this.onBuyAllAnimals);
            this.addButton('Buy all people', this.onBuyAllPeople);
            this.addButton('Buy all buildings', this.onBuyAllBuildings);
            this.addButton('Heal fighters', this.onHeal);
        }
        addButton(caption, handler) {
            let button = document.createElement('button');
            button.innerText = caption;
            button.addEventListener('click', handler);
            this.div.appendChild(button);
            this.div.appendChild(document.createElement('br'));
        }
    }
    View.DebugPage = DebugPage;
})(View || (View = {}));
/// <reference path="page.ts" />
"use strict";
var View;
(function (View) {
    function drawAttack(name, ctx) {
        ctx.textAlign = "center";
        ctx.textBaseline = 'middle';
        ctx.font = '40px Arial';
        ctx.fillStyle = '#ff0000';
        ctx.fillText(name, 0, 0);
    }
    class GrowAnimation extends View.Animation {
        constructor(name, point) {
            super(300);
            this.name = name;
            this.point = point;
        }
        draw(ctx, xform) {
            let scale = Util.querp(0, 1, this.progress);
            let point = xform.transformPoint(this.point);
            ctx.translate(point.x, point.y);
            ctx.scale(scale, scale);
            drawAttack(this.name, ctx);
        }
    }
    //class ExplodeAnimation extends Animation
    //{
    //	constructor(private name: string, private point: Point)
    //	{
    //		super(300);
    //	}
    //	draw(ctx: CanvasRenderingContext2D)
    //	{
    //		let scale = Util.lerp(1, 15, this.progress); 
    //		ctx.translate(this.point.x, this.point.y);
    //		ctx.scale(scale, scale);
    //		ctx.globalAlpha = 1 - this.progress;
    //		drawAttack(this.name, ctx);
    //		ctx.globalAlpha = 1;
    //	}
    //}
    class DamageAnimation extends View.Animation {
        constructor(name, point) {
            super(1000);
            this.name = name;
            this.point = point;
        }
        draw(ctx, xform) {
            let offset = Util.querp(0, 100, this.progress);
            let point = xform.transformPoint(this.point);
            ctx.translate(point.x, point.y - offset);
            ctx.globalAlpha = 1 - this.progress * this.progress;
            drawAttack(this.name, ctx);
            ctx.globalAlpha = 1;
        }
    }
    class PauseAnimation extends View.Animation {
        constructor(name, point, duration) {
            super(duration);
            this.name = name;
            this.point = point;
        }
        draw(ctx, xform) {
            let point = xform.transformPoint(this.point);
            ctx.translate(point.x, point.y);
            drawAttack(this.name, ctx);
        }
    }
    class MoveAnimation extends View.Animation {
        constructor(name, pointA, pointB) {
            super(500);
            this.name = name;
            this.pointA = pointA;
            this.pointB = pointB;
        }
        draw(ctx, xform) {
            let pointA = xform.transformPoint(this.pointA);
            let pointB = xform.transformPoint(this.pointB);
            let x = Util.querp(pointA.x, pointB.x, this.progress);
            let y = Util.querp(pointA.y, pointB.y, this.progress);
            ctx.translate(x, y);
            ctx.rotate(2 * Math.PI * this.progress * 2 * (pointA.x > pointB.x ? -1 : 1));
            drawAttack(this.name, ctx);
        }
    }
    class FightPage extends View.Page {
        constructor() {
            super('Fight');
            this.backgroundImage = new View.CanvasImage();
            this.imageA = new View.CanvasImage();
            this.imageB = new View.CanvasImage();
            this.sequence = null;
            this.timer = 0;
            this.healths = [];
            this.onStartButton = () => {
                Util.assert(Model.state.fight != null);
                if (this.timer) {
                    this.stopFight();
                }
                else {
                    this.button.innerText = 'Stop';
                    this.doAttack();
                    this.timer = window.setInterval(this.onTick, 40);
                }
            };
            this.onTick = () => {
                if (this.sequence) {
                    if (this.sequence.update()) {
                        this.draw();
                    }
                    else {
                        this.sequence = null;
                        if (Model.state.fight)
                            this.doAttack();
                        else {
                            window.clearInterval(this.timer);
                            this.timer = 0;
                        }
                    }
                }
            };
            Util.assert(Model.state.fight != null);
            let topDiv = document.createElement('div');
            topDiv.id = 'fight_top_div';
            this.button = document.createElement('button');
            this.button.addEventListener('click', this.onStartButton);
            this.button.innerText = 'Start';
            this.speedCheckbox = document.createElement('input');
            this.speedCheckbox.type = 'checkbox';
            this.speedCheckboxLabel = document.createElement('span');
            this.speedCheckboxLabel.innerText = 'Oh, just get on with it!';
            topDiv.appendChild(this.button);
            topDiv.appendChild(this.speedCheckbox);
            topDiv.appendChild(this.speedCheckboxLabel);
            this.para = document.createElement('p');
            this.para.style.margin = '0';
            this.scroller = document.createElement('div');
            this.scroller.id = 'fight_scroller';
            this.scroller.className = 'scroller';
            this.scroller.appendChild(this.para);
            let canvas = document.createElement('canvas');
            canvas.id = 'fight_canvas';
            this.canvas = new View.Canvas(canvas);
            this.div.appendChild(topDiv);
            this.div.appendChild(canvas);
            this.div.appendChild(this.scroller);
            this.backgroundImage.loadImage(Data.Misc.FightBackgroundImage, () => { this.draw(); });
            let fighters = Model.state.fighters;
            this.fighters = [fighters[Model.state.fight.teams[0][0]], fighters[Model.state.fight.teams[1][0]]];
            this.update();
            this.updateHealths();
            this.updateImages();
        }
        onShow() {
            this.canvas.element.width = View.Width;
            this.canvas.element.height = View.Width * this.canvas.element.clientHeight / this.canvas.element.clientWidth;
            this.draw();
        }
        onClose() {
            if (Model.state.fight)
                return false;
            Util.assert(this.timer == 0);
            return true;
        }
        stopFight() {
            Model.state.endFight();
            this.button.disabled = true;
        }
        doAttack() {
            Util.assert(!!Model.state.fight);
            let attackerIndex = Model.state.fight.nextTeamIndex;
            let result = Model.state.fight.step();
            let defenderIndex = Model.state.fight.nextTeamIndex;
            this.update();
            if (Model.state.fight.finished)
                this.stopFight();
            let sourcePart = this.fighters[attackerIndex].bodyParts[result.sourceID];
            let targetPart = this.fighters[defenderIndex].bodyParts[result.targetID];
            this.sequence = new View.Sequence(this.speedCheckbox.checked ? 5 : 1);
            let pointA = this.getBodyPartPoint(attackerIndex, sourcePart);
            let pointB = this.getBodyPartPoint(defenderIndex, targetPart);
            this.sequence.items.push(new GrowAnimation(result.name, pointA));
            this.sequence.items.push(new PauseAnimation(result.name, pointA, 500));
            this.sequence.items.push(new MoveAnimation(result.name, pointA, pointB));
            let damageString = result.attackDamage.toString() + ' x ' + (100 - result.defense).toString() + '%';
            let damageAnim = new DamageAnimation(damageString, pointB);
            damageAnim.onStart = () => { this.updateHealths(); };
            this.sequence.items.push(damageAnim);
            this.sequence.items.push(new View.Animation(1000));
            this.sequence.start();
        }
        update() {
            if (!Model.state.fight)
                return;
            let atEnd = Math.abs(this.scroller.scrollTop + this.scroller.clientHeight - this.scroller.scrollHeight) <= 10;
            this.para.innerHTML = Model.state.fight.text;
            if (atEnd)
                this.scroller.scrollTop = this.scroller.scrollHeight;
        }
        updateImages() {
            if (this.fighters.indexOf(null) >= 0)
                return;
            this.imageA.loadImage(this.fighters[0].image, () => { this.draw(); });
            this.imageB.loadImage(this.fighters[1].image, () => { this.draw(); });
            this.draw();
        }
        updateHealths() {
            this.healths.length = 0;
            for (let i = 0; i < 2; ++i) {
                this.healths.push([]);
                if (this.fighters[i])
                    for (let part of this.fighters[i].getBodyParts())
                        this.healths[this.healths.length - 1].push(part.health);
            }
        }
        getImageRect(index) {
            let image = index ? this.imageB : this.imageA;
            let rect = new Rect(0, 0, image.image.width, image.image.height);
            let x = this.canvas.element.width / 2 + (index ? 50 : -50 - rect.width());
            let y = this.canvas.element.height - rect.height();
            rect.offset(x, y);
            return rect;
        }
        getBodyPartPoint(fighterIndex, part) {
            let fighter = this.fighters[fighterIndex];
            let rect = this.getImageRect(fighterIndex);
            let data = part.getInstanceData(fighter.getSpeciesData());
            return new Point(fighterIndex ? rect.right - data.x : rect.left + data.x, rect.top + data.y);
        }
        drawHealthBar(ctx, centre, current, max) {
            let scale = 5, height = 8;
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#802020';
            ctx.fillStyle = '#f08080';
            let innerRect = new Rect(centre.x - scale * max / 2, centre.y - height / 2, centre.x + scale * max / 2, centre.y + height / 2);
            let outerRect = innerRect.clone();
            outerRect.expand(1, 1, 1, 1);
            innerRect.right = innerRect.left + innerRect.width() * current / max;
            innerRect.fill(ctx);
            outerRect.stroke(ctx);
        }
        drawHealthBars(ctx, sceneXform, fighterIndex) {
            let fighter = this.fighters[fighterIndex];
            let parts = fighter.getBodyParts();
            for (let i = 0; i < parts.length; ++i) {
                let part = parts[i];
                let data = part.getData(fighter.getSpeciesData());
                let point = this.getBodyPartPoint(fighterIndex, part);
                this.drawHealthBar(ctx, sceneXform.transformPoint(point), this.healths[fighterIndex][i], data.health);
            }
        }
        draw() {
            if (!this.backgroundImage.image.complete)
                return;
            let ctx = this.canvas.element.getContext("2d");
            let width = this.canvas.element.width;
            let height = this.canvas.element.height;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, width, height);
            let gotImages = this.imageA.isComplete() && this.imageB.isComplete();
            let rectA, rectB;
            let sceneXform = new Xform();
            if (gotImages) {
                rectA = this.getImageRect(0);
                rectB = this.getImageRect(1);
                // Scale to fit.
                let scaleX = Math.max(rectA.width(), rectB.width()) / 1485; // Giant crab.
                let scaleY = Math.max(rectA.height(), rectB.height()) / 848; // Giant crab.
                let scale = Math.max(Math.max(scaleX, scaleY), 0.4);
                sceneXform.matrix = sceneXform.matrix.translate(640, height);
                sceneXform.matrix = sceneXform.matrix.scale(1 / scale);
                sceneXform.matrix = sceneXform.matrix.translate(-640, -height);
            }
            ctx.save();
            sceneXform.apply(ctx);
            ctx.scale(1280 / 800, 1280 / 800);
            Util.scaleCentred(ctx, 1.5, 400, 0);
            ctx.translate(-12, -200);
            this.backgroundImage.draw(ctx);
            ctx.restore();
            if (!gotImages)
                return;
            // Scale because all the animals are too big. 
            sceneXform.matrix = sceneXform.matrix.translate(640, height);
            sceneXform.matrix = sceneXform.matrix.scale(0.4);
            sceneXform.matrix = sceneXform.matrix.translate(-640, -height);
            ctx.fillStyle = '#80f080';
            ctx.save();
            sceneXform.apply(ctx);
            ctx.translate(rectA.left, rectA.top);
            this.imageA.draw(ctx);
            ctx.restore();
            ctx.save();
            sceneXform.apply(ctx);
            ctx.translate(rectB.right, rectB.top);
            ctx.scale(-1, 1);
            this.imageB.draw(ctx);
            ctx.restore();
            this.drawHealthBars(ctx, sceneXform, 0);
            this.drawHealthBars(ctx, sceneXform, 1);
            //sceneXform.apply(ctx);
            if (this.sequence)
                this.sequence.draw(ctx, sceneXform);
        }
    }
    View.FightPage = FightPage;
})(View || (View = {}));
/// <reference path="page.ts" />
"use strict";
var View;
(function (View) {
    class KennelsPage extends View.Page {
        constructor() {
            super('Kennels');
            let tableFactory = new View.Table.Factory();
            this.div.appendChild(tableFactory.element);
            tableFactory.addColumnHeader('Name', 20);
            tableFactory.addColumnHeader('Image', 30);
            tableFactory.addColumnHeader('Part', 10);
            tableFactory.addColumnHeader('Health', 10);
            tableFactory.addColumnHeader('Armour', 15);
            tableFactory.addColumnHeader('Weapon', 15);
            for (let animal of Model.state.getAnimals()) {
                let cells = [new View.Table.TextCell('<h4>' + animal.name + '</h4>'), new View.Table.ImageCell(animal.image)];
                for (let c of Util.formatRows(animal.getStatus()))
                    cells.push(new View.Table.TextCell('<small>' + c + '</small>'));
                tableFactory.addRow(cells, false, null);
            }
        }
    }
    View.KennelsPage = KennelsPage;
})(View || (View = {}));
"use strict";
var View;
(function (View) {
    class Trigger extends View.CanvasImage {
        constructor(id, handler) {
            super();
            this.id = id;
            this.handler = handler;
        }
        onClick() {
            if (this.isEnabled())
                this.handler(this.id);
        }
    }
    View.Trigger = Trigger;
    class Building extends Trigger {
        constructor(id, handler) {
            super(id, handler);
            this.handler = handler;
            this.levelIndex = -1;
            this.progress = -1;
        }
        isEnabled() {
            return Model.state.buildings.getCurrentLevelIndex(this.id) >= 0;
        }
        update() {
            let changed = false;
            var index = Model.state.buildings.getCurrentLevelIndex(this.id);
            if (index < 0 && !this.image) {
                let level = Data.Buildings.getLevel(this.id, 0);
                this.loadImage(Data.Misc.ConstructionImage, () => { this.onload(); });
                this.pos = new Point(level.mapX, level.mapY);
                changed = true;
            }
            else if (this.levelIndex != index) {
                this.levelIndex = index;
                var level = Data.Buildings.getLevel(this.id, index);
                this.loadImage(level.mapImage, () => { this.onload(); });
                this.pos = new Point(level.mapX, level.mapY);
                changed = true;
            }
            let oldProgress = this.progress;
            if (Model.state.buildings.isConstructing(this.id))
                this.progress = Model.state.buildings.getConstructionProgress(this.id);
            else
                this.progress = -1;
            if (this.progress != oldProgress)
                changed = true;
            return changed;
        }
        onload() {
            View.ludus.draw();
        }
        draw(ctx) {
            if (this.progress >= 0) {
                let rect = this.getRect();
                rect.left = rect.right + 3;
                rect.right += 10;
                rect.top += 3;
                let rect2 = Object.create(rect);
                rect2.top = rect2.bottom - rect2.height() * this.progress;
                ctx.beginPath();
                rect2.path(ctx);
                ctx.closePath();
                ctx.fillStyle = '#80f080';
                ctx.fill();
                ctx.beginPath();
                rect.path(ctx);
                ctx.closePath();
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#208020';
                ctx.stroke();
            }
            super.draw(ctx);
        }
    }
    View.Building = Building;
    class Ludus extends View.Canvas {
        constructor() {
            super(document.getElementById('canvas_ludus'));
            this.Objects = [];
            this.Buildings = {};
            this.BackgroundImage = new View.CanvasImage();
            this.BackgroundImage.loadImage(Data.Misc.LudusBackgroundImage, () => { this.draw(); });
            this.element.width = View.Width;
            this.element.height = View.Height;
            this.initObjects();
        }
        draw() {
            if (!this.BackgroundImage.image.complete)
                return;
            var ctx = this.element.getContext("2d");
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, this.element.width, this.element.height);
            this.BackgroundImage.draw(ctx);
            for (var i = 0, obj; obj = this.Objects[i]; ++i) {
                obj.draw(ctx);
                if (obj == Controller.Canvas.HotObject) {
                    ctx.beginPath();
                    obj.getRect().path(ctx);
                    ctx.closePath();
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = 'cornflowerblue';
                    ctx.stroke();
                }
            }
        }
        initObjects() {
            this.Objects.length = 0;
            this.Buildings = {};
            let town = Data.Misc.TownTrigger;
            let trigger = new View.Trigger('town', Controller.onTownTriggerClicked);
            trigger.loadImage(town.mapImage, () => { this.draw(); });
            trigger.pos = new Point(town.mapX, town.mapY);
            this.Objects.push(trigger);
            this.updateObjects();
            this.draw();
        }
        updateObjects() {
            let redraw = false;
            for (var id in Data.Buildings.Levels) {
                if (Model.state.buildings.getCurrentLevelIndex(id) >= 0 || Model.state.buildings.isConstructing(id)) {
                    let building = this.Buildings[id];
                    if (!(id in this.Buildings)) {
                        building = new Building(id, Controller.onBuildingTriggerClicked);
                        this.Buildings[id] = building;
                        this.Objects.push(building);
                    }
                    if (building.update())
                        redraw = true;
                }
            }
            if (redraw)
                this.draw();
        }
    }
    View.Ludus = Ludus;
})(View || (View = {}));
/// <reference path="page.ts" />
"use strict";
var View;
(function (View) {
    class NewsPage extends View.Page {
        constructor(closeHandler) {
            super('News');
            this.closeHandler = closeHandler;
            this.div.style.overflow = 'auto';
            for (let item of Model.state.news) {
                let e = document.createElement('p');
                e.innerText = item.description;
                this.div.appendChild(e);
            }
            for (let item of Model.state.getEventsForToday()) {
                let e = document.createElement('p');
                e.innerText = item.getDescription();
                this.div.appendChild(e);
            }
        }
        onShow() {
        }
        onClose() {
            this.closeHandler();
            return true;
        }
    }
    View.NewsPage = NewsPage;
})(View || (View = {}));
"use strict";
var View;
(function (View) {
    var Table;
    (function (Table) {
        class Cell {
            constructor(width) {
                this.width = width;
            } // %
            getElement() {
                let e = document.createElement('td');
                if (this.width)
                    e.style.width = this.width.toString() + '%';
                return e;
            }
        }
        Table.Cell = Cell;
        class TextCell extends Cell {
            constructor(content, width) {
                super(width);
                this.content = content;
            }
            getElement() {
                let e = super.getElement();
                e.innerHTML = this.content;
                return e;
            }
        }
        Table.TextCell = TextCell;
        class ImageCell extends Cell {
            constructor(src, width) {
                super(width);
                this.src = src;
            }
            getElement() {
                let e = super.getElement();
                e.style.position = 'relative';
                let child = document.createElement('img');
                child.className = "centre";
                child.style.height = '90%';
                child.src = this.src;
                e.appendChild(child);
                return e;
            }
        }
        Table.ImageCell = ImageCell;
        class SelectCellItem {
            constructor(tag, name) {
                this.tag = tag;
                this.name = name;
            }
        }
        Table.SelectCellItem = SelectCellItem;
        class SelectCell extends Cell {
            constructor(width, items, handler) {
                super(width);
                this.items = items;
                this.handler = handler;
            }
            getElement() {
                let e = super.getElement();
                let select = document.createElement('select');
                for (let i = 0, item; item = this.items[i]; ++i) {
                    let optionElement = document.createElement('option');
                    optionElement.value = item.tag;
                    optionElement.innerText = item.name;
                    select.appendChild(optionElement);
                }
                select.value = this.selectedTag;
                select.addEventListener('change', () => { this.handler(select.value); });
                e.appendChild(select);
                return e;
            }
        }
        Table.SelectCell = SelectCell;
        class Factory {
            constructor() {
                this.element = document.createElement('div');
                this.table = document.createElement('table');
                this.element.appendChild(this.table);
                this.element.className = 'scroller';
            }
            addColumnHeader(name, width) {
                if (!this.headerRow) {
                    this.headerRow = this.table.insertRow(0);
                    this.headerRow.className = 'disabled';
                }
                let th = document.createElement('th');
                this.headerRow.appendChild(th);
                th.innerText = name;
                if (width)
                    th.style.width = width.toString() + '%';
            }
            addRow(cells, locked, handler) {
                let row = document.createElement('tr');
                row.className = 'table_row';
                this.table.appendChild(row);
                for (let cell of cells)
                    row.appendChild(cell.getElement());
                row.addEventListener('click', handler);
                if (locked)
                    row.style.opacity = '0.5';
                if (!locked && handler)
                    row.className += ' highlight';
            }
        }
        Table.Factory = Factory;
    })(Table = View.Table || (View.Table = {}));
})(View || (View = {}));
"use strict";
var View;
(function (View) {
    View.Width = 1280;
    View.Height = 720;
    let speeds = [0, 1, 10, 60];
    class Transition {
        constructor(reverse, endHandler) {
            this.reverse = reverse;
            this.endHandler = endHandler;
            this.progress = 0;
            this.id = 0;
        }
    }
    View.Transition = Transition;
    let currentTransition = null;
    function setOpacity(opacity) {
        document.getElementById('master_div').style.opacity = opacity.toString();
    }
    function init() {
        View.ludus = new View.Ludus();
        View.updateLayout();
        document.getElementById('reset_btn').addEventListener('click', Controller.onResetClicked);
        document.getElementById('debug_btn').addEventListener('click', Controller.onDebugClicked);
        for (let i = 0; i < speeds.length; ++i) {
            document.getElementById('speed_label_' + i).innerText = 'x' + speeds[i];
            let button = document.getElementById('speed_btn_' + i);
            button.addEventListener('click', () => { Controller.setSpeed(speeds[i]); });
        }
        updateSpeedButtons();
        setOpacity(Model.state.isNight() ? 0 : 1);
    }
    View.init = init;
    function showInfo(title, description) {
        let page = new View.Page(title);
        page.div.innerHTML = '<p>' + description + '</p>';
        page.show();
    }
    View.showInfo = showInfo;
    function setHUDText(money, time) {
        document.getElementById('hud_money_span').innerText = money;
        document.getElementById('hud_time_span').innerText = time;
    }
    View.setHUDText = setHUDText;
    function updateLayout() {
        let width = document.documentElement.clientWidth;
        let height = document.documentElement.clientHeight;
        let offset = new Point(0, 0);
        let scale = 1;
        let sx = width / View.Width;
        let sy = height / View.Height;
        let imageAspect = View.Width / View.Height;
        if (sx < sy) {
            let devHeight = width / imageAspect;
            offset = new Point(0, (height - devHeight) / 2);
            scale = sx;
        }
        else {
            let devWidth = height * imageAspect;
            offset = new Point((width - devWidth) / 2, 0);
            scale = sy;
        }
        let div = document.getElementById('master_div');
        div.style.top = offset.y.toString() + 'px';
        div.style.bottom = offset.y.toString() + 'px';
        div.style.left = offset.x.toString() + 'px';
        div.style.right = offset.x.toString() + 'px';
        div.style.fontSize = (scale * 20).toString() + 'px';
        View.ludus.draw();
    }
    View.updateLayout = updateLayout;
    function updateSpeedButtons() {
        for (let i = 0; i < speeds.length; ++i) {
            let button = document.getElementById('speed_btn_' + i);
            button.checked = Model.state.speed == speeds[i];
        }
    }
    View.updateSpeedButtons = updateSpeedButtons;
    function startTransition(transition) {
        currentTransition = transition;
        currentTransition.id = window.setInterval(View.onTransitionTick, 100);
    }
    View.startTransition = startTransition;
    function isTransitioning() {
        return currentTransition != null;
    }
    View.isTransitioning = isTransitioning;
    function onTransitionTick() {
        const steps = 20;
        Util.assert(currentTransition != null);
        let opacity = ++currentTransition.progress / steps;
        if (currentTransition.reverse)
            opacity = 1 - opacity;
        setOpacity(opacity);
        if (currentTransition.progress == steps) {
            window.clearInterval(currentTransition.id);
            let handler = currentTransition.endHandler;
            currentTransition = null;
            handler();
        }
    }
    View.onTransitionTick = onTransitionTick;
    function enable(enable) {
        document.body.style.pointerEvents = enable ? 'auto' : 'none';
    }
    View.enable = enable;
})(View || (View = {}));
