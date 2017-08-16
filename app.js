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
            constructor(name, cost, fame, description, sites, defence) {
                this.name = name;
                this.cost = cost;
                this.fame = fame;
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
            getDescription() {
                return this.description + ' (fame: ' + this.fame + ')';
            }
        }
        Armour.Type = Type;
    })(Armour = Data.Armour || (Data.Armour = {}));
    var Weapons;
    (function (Weapons) {
        class Type {
            constructor(name, block, cost, fame, description, sites, attacks) {
                this.name = name;
                this.block = block;
                this.cost = cost;
                this.fame = fame;
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
            getDescription() {
                return this.description + ' (fame: ' + this.fame + ')';
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
        constructor(attack, instances, weaponSite = null) {
            this.attack = attack;
            this.instances = instances;
            this.weaponSite = weaponSite;
        }
    }
    Data.BodyPart = BodyPart;
    var Species;
    (function (Species) {
        class Type {
            constructor(name, health) {
                this.name = name;
                this.health = health;
            }
        }
        Species.Type = Type;
    })(Species = Data.Species || (Data.Species = {}));
    var Animals;
    (function (Animals) {
        class Type {
            constructor(cost, fame, species, name, description) {
                this.cost = cost;
                this.fame = fame;
                this.species = species;
                this.name = name;
                this.description = description;
            }
            validate() {
                if (!Species.Types[this.species])
                    console.log('Animal: "%s" references unknown species "%s"', this.name, this.species);
                if (!Species.Types[this.species].bodyParts)
                    console.log('Animal: "%s" has no body parts', this.name);
            }
            getDescription() {
                return this.description + ' (fame: ' + this.fame + ')';
            }
        }
        Animals.Type = Type;
    })(Animals = Data.Animals || (Data.Animals = {}));
    var People;
    (function (People) {
        class Type {
            constructor(cost, fame, name, description) {
                this.cost = cost;
                this.fame = fame;
                this.name = name;
                this.description = description;
            }
            validate() {
            }
            getDescription() {
                return this.description + ' (fame: ' + this.fame + ')';
            }
        }
        People.Type = Type;
    })(People = Data.People || (Data.People = {}));
    var Buildings;
    (function (Buildings) {
        class Level {
            constructor(cost, buildTime, mapX, mapY, capacity, name, description) {
                this.cost = cost;
                this.buildTime = buildTime;
                this.mapX = mapX;
                this.mapY = mapY;
                this.capacity = capacity;
                this.name = name;
                this.description = description;
            }
        }
        Buildings.Level = Level;
        function getLevel(tag, index) {
            Util.assert(tag in Buildings.Levels);
            return index >= 0 && index < Buildings.Levels[tag].length ? Buildings.Levels[tag][index] : null;
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
    var Events;
    (function (Events_1) {
        class AwayFightEvent {
            constructor(day, injuryThreshold, fameRequired, losingFameReward, winningFameReward, losingMoneyReward, winningMoneyReward, name) {
                this.day = day;
                this.injuryThreshold = injuryThreshold;
                this.fameRequired = fameRequired;
                this.losingFameReward = losingFameReward;
                this.winningFameReward = winningFameReward;
                this.losingMoneyReward = losingMoneyReward;
                this.winningMoneyReward = winningMoneyReward;
                this.name = name;
            }
        }
        Events_1.AwayFightEvent = AwayFightEvent;
    })(Events = Data.Events || (Data.Events = {}));
    function validate() {
        console.log('Validating data...');
        for (let tag in Armour.Types)
            Armour.Types[tag].validate();
        for (let tag in Weapons.Types)
            Weapons.Types[tag].validate();
        for (let tag in Animals.Types)
            Animals.Types[tag].validate();
        for (let tag in People.Types)
            People.Types[tag].validate();
        console.log('Validating finished.');
    }
    Data.validate = validate;
    var Skills;
    (function (Skills) {
        class Type {
            constructor(name) {
                this.name = name;
            }
        }
        Skills.Type = Type;
    })(Skills = Data.Skills || (Data.Skills = {}));
    var Misc;
    (function (Misc) {
    })(Misc = Data.Misc || (Data.Misc = {}));
})(Data || (Data = {}));
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
class NumberMap {
    constructor() {
        this.map = {};
    }
    get(key) {
        return key in this.map ? this.map[key] : 0;
    }
    add(key, count) {
        this.map[key] = this.get(key) + count;
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
    function setPrototype(obj, type) {
        obj.__proto__ = type.prototype;
    }
    Util.setPrototype = setPrototype;
    function dynamicCast(instance, ctor) {
        return (instance instanceof ctor) ? instance : null;
    }
    Util.dynamicCast = dynamicCast;
    function assertCast(instance, ctor) {
        assert(instance instanceof ctor);
        return instance;
    }
    Util.assertCast = assertCast;
    function getImage(dir, name) {
        return 'images/' + dir + '/' + name + '.png';
    }
    Util.getImage = getImage;
})(Util || (Util = {}));
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
                showEventUI(Model.state.getEventsForDay(Model.state.getDay()));
                break;
            case Model.Phase.Fight:
                new View.FightPage().show();
                break;
        }
        updateHUD();
    }
    Controller.onTick = onTick;
    function showEventUI(events) {
        Util.assert(events.length == 1);
        if (events[0] instanceof Model.FightEvent)
            new View.ArenaPage(events[0]).show();
        else
            Util.assert(false);
    }
    function startTransition(dusk) {
        View.startTransition(new View.Transition(dusk, () => { Model.state.advancePhase(); }));
    }
    function onBuildingTriggerClicked(tag) {
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
        Util.assert(handlers[tag]);
        handlers[tag]();
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
    function onSkipDayClicked() {
        Model.state.skipToNextDay(true);
        View.ludus.updateObjects();
    }
    Controller.onSkipDayClicked = onSkipDayClicked;
    function onHomeTriggerClicked() {
        let page = new View.HomePage();
        page.show();
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
        let page = new View.StoragePage();
        page.show();
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
        if (evt.keyCode == 27) {
            if (View.Page.Current) {
                View.Page.hideCurrent();
            }
            else if (View.isTransitioning()) {
                View.cancelTransition();
                Model.state.cancelNight();
            }
        }
    }
    Controller.onKeyDown = onKeyDown;
})(Controller || (Controller = {}));
"use strict";
var Controller;
(function (Controller) {
    var Shop;
    (function (Shop) {
        function getShopTitle(name) {
            return name + ' (money available: ' + Util.formatMoney(Model.state.getMoney()) + ')';
        }
        function showShopsPage() {
            let page = new View.ShopPage('Let\'s go shopping!');
            populateBuildings(page);
            populateAnimals(page);
            populatePeople(page);
            populateArmour(page);
            populateWeapons(page);
            page.show();
        }
        Shop.showShopsPage = showShopsPage;
        function populateBuildings(page) {
            let table = page.addTable('Buildings');
            for (let tag in Data.Buildings.Levels)
                if (Model.state.buildings.getNextUpgradeIndex(tag) >= 0)
                    page.addItem(new Controller.Shop.BuildingItem(tag), table);
        }
        function populateAnimals(page) {
            let table = page.addTable('Animals');
            for (let tag in Data.Animals.Types)
                page.addItem(new Controller.Shop.AnimalItem(tag), table);
        }
        function populatePeople(page) {
            let table = page.addTable('People');
            for (let tag in Data.People.Types)
                page.addItem(new Controller.Shop.PeopleItem(tag), table);
        }
        function populateArmour(page) {
            let table = page.addTable('Armour');
            for (let tag in Data.Armour.Types)
                page.addItem(new Controller.Shop.ArmourItem(tag), table);
        }
        function populateWeapons(page) {
            let table = page.addTable('Weapons');
            for (let tag in Data.Weapons.Types)
                page.addItem(new Controller.Shop.WeaponItem(tag), table);
        }
    })(Shop = Controller.Shop || (Controller.Shop = {}));
})(Controller || (Controller = {}));
"use strict";
var Controller;
(function (Controller) {
    var Shop;
    (function (Shop) {
        class Item {
            constructor(type, tag, title, description, image, cost) {
                this.type = type;
                this.tag = tag;
                this.title = title;
                this.description = description;
                this.image = image;
                this.cost = cost;
            }
            canBuy() { return true; }
            canAddToBasket(basket) {
                return basket.get(this.type) < this.getMaxTypeCount();
            }
        }
        Shop.Item = Item;
        class BuildingItem extends Item {
            constructor(tag) {
                let levelIndex = Model.state.buildings.getNextUpgradeIndex(tag);
                let level = Data.Buildings.getLevel(tag, levelIndex);
                Util.assert(level != null);
                super('building:' + tag, tag, level.name, level.description, Util.getImage('buildings', tag + levelIndex), level.cost);
            }
            getMaxTypeCount() {
                return 1;
            }
            canBuy() {
                return Model.state.buildings.canUpgrade(this.tag);
            }
            buy() {
                Model.state.buildings.buyUpgrade(this.tag);
            }
        }
        Shop.BuildingItem = BuildingItem;
        class AnimalItem extends Item {
            constructor(tag) {
                let data = Data.Animals.Types[tag];
                Util.assert(data != null);
                super('animal', tag, data.name, data.getDescription(), Util.getImage('animals', tag), data.cost);
            }
            getMaxTypeCount() {
                return Model.state.buildings.getCapacity('kennels') - Model.state.team.getAnimals().length;
            }
            buy() {
                Model.state.buyAnimal(this.tag);
            }
        }
        Shop.AnimalItem = AnimalItem;
        class PeopleItem extends Item {
            constructor(tag) {
                let data = Data.People.Types[tag];
                Util.assert(data != null);
                super('person', tag, data.name, data.getDescription(), Util.getImage('people', tag), data.cost);
            }
            getMaxTypeCount() {
                return Model.state.buildings.getCapacity('barracks') - Model.state.team.getPeople().length;
            }
            buy() {
                Model.state.buyPerson(this.tag);
            }
        }
        Shop.PeopleItem = PeopleItem;
        class AccessoryItem extends Item {
            constructor(tag, title, description, cost) {
                super('accessory', tag, title, description, Util.getImage('items', tag), cost);
                this.tag = tag;
                this.title = title;
                this.description = description;
                this.cost = cost;
            }
            getMaxTypeCount() {
                return Model.state.buildings.getCapacity('storage') - Model.state.team.getItemCount();
            }
        }
        class ArmourItem extends AccessoryItem {
            constructor(tag) {
                let data = Data.Armour.Types[tag];
                Util.assert(data != null);
                super(tag, data.name, data.getDescription(), data.cost);
            }
            buy() {
                Model.state.buyArmour(this.tag);
            }
        }
        Shop.ArmourItem = ArmourItem;
        class WeaponItem extends AccessoryItem {
            constructor(tag) {
                let data = Data.Weapons.Types[tag];
                Util.assert(data != null);
                super(tag, data.name, data.getDescription(), data.cost);
            }
            buy() {
                Model.state.buyWeapon(this.tag);
            }
        }
        Shop.WeaponItem = WeaponItem;
    })(Shop = Controller.Shop || (Controller.Shop = {}));
})(Controller || (Controller = {}));
"use strict";
var Model;
(function (Model) {
    class BodyPart {
        constructor(id, tag, index) {
            this.id = id;
            this.tag = tag;
            this.index = index;
        }
        getData(speciesData) {
            return speciesData.bodyParts[this.tag];
        }
        getInstanceData(speciesData) {
            return this.getData(speciesData).instances[this.index];
        }
        // Gets tag of armour or weapon site, if present.
        getSiteTag(accType, speciesData) {
            if (accType == Model.ItemType.Armour)
                return this.tag;
            let site = this.getData(speciesData).weaponSite;
            return site ? site.type : null;
        }
    }
    Model.BodyPart = BodyPart;
    class Attack {
        constructor(data, weaponTag, sourceID, skill) {
            this.data = data;
            this.weaponTag = weaponTag;
            this.sourceID = sourceID;
            this.skill = skill;
        }
    }
    Model.Attack = Attack;
    class Fighter {
        constructor(id, species, name, image, fame) {
            this.id = id;
            this.species = species;
            this.name = name;
            this.image = image;
            this.fame = fame;
            this.bodyParts = {};
            this.skills = {}; // +/- percent.
            this.nextBodyPartID = 1;
            this.health = 0;
            this.activity = 'idle';
            this.experience = {};
            let data = this.getSpeciesData();
            this.health = data.health;
            for (let tag in data.bodyParts) {
                let part = data.bodyParts[tag];
                for (let i = 0; i < part.instances.length; ++i) {
                    this.bodyParts[this.nextBodyPartID] = new BodyPart(this.nextBodyPartID.toString(), tag, i);
                    ++this.nextBodyPartID;
                }
            }
        }
        static initPrototype(fighter) {
            if (fighter.species == 'human')
                Util.setPrototype(fighter, Model.Person);
            else
                Util.setPrototype(fighter, Model.Animal);
            fighter.onLoad();
        }
        onLoad() {
            for (let id in this.bodyParts)
                Util.setPrototype(this.bodyParts[id], BodyPart);
        }
        isHuman() { return this.species == 'human'; }
        getSpeciesData() {
            let type = Data.Species.Types[this.species];
            Util.assert(type != undefined);
            return type;
        }
        getSkills() {
            let rows = [];
            for (let tag in this.skills)
                rows.push([Data.Skills.Types[tag].name, this.getSkill(tag).toFixed(1)]);
            if (rows.length == 0)
                rows.push(['', '']);
            return rows;
        }
        getAttacks(loadout, team) {
            let attacks = [];
            let usedBodyParts = new Set();
            for (let itemPos of loadout.itemPositions) {
                let item = team.getItem(itemPos.itemID);
                if (item.type == Model.ItemType.Weapon) {
                    let data = team.getWeaponData(itemPos.itemID);
                    for (let attack of data.attacks)
                        attacks.push(new Attack(attack, item.tag, itemPos.bodyPartIDs[0], this.getSkill('attack'))); // Just use the first body part for the source.
                    for (let bpid of itemPos.bodyPartIDs)
                        usedBodyParts.add(bpid);
                }
            }
            let speciesData = this.getSpeciesData();
            for (let id in this.bodyParts) {
                if (usedBodyParts.has(id))
                    continue;
                let part = this.bodyParts[id];
                let data = speciesData.bodyParts[part.tag];
                if (data.attack)
                    attacks.push(new Attack(data.attack, null, id, this.getSkill('attack'))); // TODO: Check body part health.
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
            return this.health <= 0;
        }
        canFight(healthThresholdPercent) {
            return this.health / this.getSpeciesData().health > healthThresholdPercent / 100;
        }
        resetHealth() {
            this.health = this.getSpeciesData().health;
            Model.invalidate();
        }
        addFame(fame) {
            this.fame += fame;
            Model.invalidate();
        }
        getExperience(tag) {
            return this.experience[tag] || 0;
        }
        addExperience(tag, hours) {
            this.experience[tag] = this.experience[tag] || 0;
            this.experience[tag] += hours;
            Model.invalidate();
        }
        getActivity() {
            return this.activity;
        }
        setActivity(tag) {
            this.activity = tag;
            Model.invalidate();
        }
        getSkill(tag) {
            Util.assert(tag in Data.Skills.Types);
            return this.skills[tag] || 0;
        }
        addSkill(tag, value) {
            this.skills[tag] = this.getSkill(tag) + value;
            Model.invalidate();
        }
        getHealth() {
            return this.health;
        }
        addHealth(value) {
            this.health = Math.max(Math.min(this.health + value, this.getSpeciesData().health), 0);
            Model.invalidate();
        }
    }
    Model.Fighter = Fighter;
})(Model || (Model = {}));
/// <reference path="fighter.ts" />
"use strict";
var Model;
(function (Model) {
    class Animal extends Model.Fighter {
        constructor(id, tag, name, fame) {
            let type = Data.Animals.Types[tag];
            super(id, type.species, name, Util.getImage('animals', tag), fame);
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
                for (var tag in Data.Buildings.Levels) {
                    var free = Data.Buildings.getLevel(tag, 0).cost == 0;
                    this.types[tag] = { levelIndex: free ? 0 : -1, progress: -1 };
                }
            }
            update(hours) {
                let changed = false;
                let buildingCount = 0;
                for (let tag in this.types)
                    if (this.isConstructing(tag))
                        ++buildingCount;
                for (let tag in this.types)
                    if (this.continueConstruction(tag, hours / buildingCount))
                        changed = true;
                return changed;
            }
            getCapacity(tag) {
                let level = this.getCurrentLevel(tag);
                return level ? level.capacity : 0;
            }
            getCurrentLevelIndex(tag) {
                Util.assert(tag in this.types);
                return this.types[tag].levelIndex;
            }
            getNextLevelIndex(tag) {
                var nextIndex = this.getCurrentLevelIndex(tag) + 1;
                return nextIndex < this.getLevelCount(tag) ? nextIndex : -1;
            }
            getNextUpgradeIndex(tag) {
                var index = this.getCurrentLevelIndex(tag) + 1;
                if (this.isConstructing(tag))
                    ++index;
                return index < this.getLevelCount(tag) ? index : -1;
            }
            setLevelIndex(tag, index) {
                Util.assert(tag in this.types);
                Util.assert(index < this.getLevelCount(tag));
                this.types[tag].levelIndex = index;
                Model.invalidate();
            }
            canUpgrade(tag) {
                Util.assert(tag in this.types);
                var level = this.getNextLevel(tag);
                return level && !this.isConstructing(tag);
            }
            buyUpgrade(tag) {
                Util.assert(this.canUpgrade(tag));
                Model.state.spendMoney(this.getNextLevel(tag).cost);
                this.types[tag].progress = 0;
                Model.invalidate();
            }
            isConstructing(tag) {
                return this.types[tag].progress >= 0;
            }
            continueConstruction(tag, manHours) {
                Util.assert(tag in this.types);
                if (!this.isConstructing(tag))
                    return false;
                let level = this.getNextLevel(tag);
                Util.assert(level != null);
                if (this.types[tag].progress + manHours >= level.buildTime) {
                    this.types[tag].progress = -1;
                    ++this.types[tag].levelIndex;
                }
                else
                    this.types[tag].progress += manHours;
                Model.invalidate();
                return true;
            }
            getConstructionProgress(tag) {
                Util.assert(tag in this.types);
                let progress = this.types[tag].progress;
                if (progress < 0)
                    return 0;
                let level = this.getNextLevel(tag);
                Util.assert(level != null);
                return progress / level.buildTime;
            }
            getCurrentLevel(tag) {
                return Data.Buildings.getLevel(tag, this.getCurrentLevelIndex(tag));
            }
            getNextLevel(tag) {
                return Data.Buildings.getLevel(tag, this.getNextLevelIndex(tag));
            }
            getLevelCount(tag) {
                return Data.Buildings.Levels[tag].length;
            }
        }
        Buildings.State = State;
    })(Buildings = Model.Buildings || (Model.Buildings = {}));
})(Model || (Model = {}));
"use strict";
var Model;
(function (Model) {
    class Event {
        constructor(type, day) {
            this.type = type;
            this.day = day;
        }
        static initPrototype(event) {
            if (event.type == 'home_fight')
                Util.setPrototype(event, HomeFightEvent);
            else if (event.type == 'away_fight')
                Util.setPrototype(event, AwayFightEvent);
        }
        getDescription() { Util.assert(false); return ''; }
    }
    Model.Event = Event;
    class FightRewards {
        constructor() {
            this.money = 0;
            this.fame = [];
        }
    }
    Model.FightRewards = FightRewards;
    class FightEvent extends Event {
        constructor(type, day, injuryThreshold) {
            super(type, day);
            this.injuryThreshold = injuryThreshold;
        }
        getRewards(fight) {
            Util.assert(fight.winnerIndex >= 0);
            let rewards = new FightRewards();
            rewards.money = this.getMoneyReward(fight, fight.winnerIndex == 0);
            for (let i = 0; i < 2; ++i)
                rewards.fame.push(this.getFameReward(fight, fight.winnerIndex == i));
            return rewards;
        }
        getFameReward(fight, winning) {
            return 0;
        }
        getMoneyReward(fight, winning) {
            return 0;
        }
    }
    Model.FightEvent = FightEvent;
    class HomeFightEvent extends FightEvent {
        constructor(day, injuryThreshold) {
            super('home_fight', day, injuryThreshold);
        }
        getDescription() {
            return "Home Fight";
        }
        getAttendance(fame) {
            return Math.floor(fame * Data.Misc.HomeFightPopularity);
        }
        getFameReward(fight, winning) {
            const fame = fight.getFame(); // TODO: Arena fame.
            const rate = winning ? Data.Misc.HomeFightWinningFame : Data.Misc.HomeFightLosingFame;
            return this.getAttendance(fame) * rate;
        }
        getMoneyReward(fight, winning) {
            // Doesn't matter who won.
            const fame = fight.getFame(); // TODO: Arena fame.
            return this.getAttendance(fame) * Data.Misc.HomeFightMoney;
        }
    }
    Model.HomeFightEvent = HomeFightEvent;
    class AwayFightEvent extends FightEvent {
        constructor(day, injuryThreshold, fameRequired, losingFameReward, winningFameReward, losingMoneyReward, winningMoneyReward, name) {
            super('away_fight', day, injuryThreshold);
            this.fameRequired = fameRequired;
            this.losingFameReward = losingFameReward;
            this.winningFameReward = winningFameReward;
            this.losingMoneyReward = losingMoneyReward;
            this.winningMoneyReward = winningMoneyReward;
            this.name = name;
        }
        getDescription() {
            return this.name;
        }
        createNPCSide() {
            let team = new Model.Team();
            team.fighters[1] = new Model.Person(0, 'man', "Slapper Nuremberg", 0);
            let loadout = new Model.Loadout('1');
            return new Model.Fight.Side(loadout, team);
        }
        getFameReward(fight, winning) {
            return winning ? this.winningFameReward : this.losingFameReward;
        }
        getMoneyReward(fight, winning) {
            return winning ? this.winningMoneyReward : this.losingMoneyReward;
        }
    }
    Model.AwayFightEvent = AwayFightEvent;
})(Model || (Model = {}));
"use strict";
var Model;
(function (Model) {
    var Fight;
    (function (Fight) {
        class AttackResult {
            constructor(attack, description, attackDamage, defense, targetID) {
                this.attack = attack;
                this.description = description;
                this.attackDamage = attackDamage;
                this.defense = defense;
                this.targetID = targetID;
            }
        }
        Fight.AttackResult = AttackResult;
        class Side {
            constructor(loadout, npcTeam) {
                this.loadout = loadout;
                this.npcTeam = npcTeam;
                Util.assert(!npcTeam || npcTeam !== Model.state.team); // Use null for player team.
                let team = this.getTeam();
                Util.assert(!!team.fighters[loadout.fighterID]);
            }
            getFighter() {
                return this.getTeam().fighters[this.loadout.fighterID];
            }
            getTeam() {
                return this.npcTeam ? this.npcTeam : Model.state.team;
            }
            getAttacks() {
                return this.getFighter().getAttacks(this.loadout, this.getTeam());
            }
            getEquipmentFame() {
                return this.loadout.getEquipmentFame(this.getTeam());
            }
            onLoad() {
                if (this.npcTeam) {
                    Util.setPrototype(this.npcTeam, Model.Team);
                    this.npcTeam.onLoad();
                }
                Util.setPrototype(this.loadout, Model.Loadout);
                this.loadout.onLoad();
            }
        }
        Fight.Side = Side;
        class State {
            constructor(sideA, sideB, event) {
                this.event = event;
                this.winnerIndex = -1;
                this.sides = [sideA, sideB];
                this.text = '';
                this.nextSideIndex = 0;
                this.steps = 0;
            }
            onLoad() {
                for (let side of this.sides) {
                    Util.setPrototype(side, Side);
                    side.onLoad();
                }
            }
            getFighter(index) {
                let side = this.sides[index];
                return side && side.getFighter();
            }
            getImages(fighterIndex, attack) {
                let fighter = this.getFighter(fighterIndex);
                if (!fighter.isHuman())
                    return [fighter.image];
                let basePath = 'images/people/man/';
                let images = [];
                // Add body image.
                let bodyImage = 'idle';
                if (attack) {
                    let part = fighter.bodyParts[attack.sourceID];
                    Util.assert(part.tag in fighter.getSpeciesData().bodyParts);
                    Util.assert(fighter.getSpeciesData().bodyParts[part.tag].instances.length == 2); // Arms or legs.
                    bodyImage = (part.index == 1 ? 'right ' : 'left ') + part.tag + ' up';
                    if (attack.weaponTag && Data.Weapons.Types[attack.weaponTag].sites[0].count == 2)
                        bodyImage = 'both arms up';
                }
                images.push(basePath + bodyImage + '.png');
                // Add weapon images.
                let side = this.sides[fighterIndex];
                for (let itemPos of side.loadout.itemPositions) {
                    let item = side.getTeam().getItem(itemPos.itemID);
                    if (item.type == Model.ItemType.Weapon) {
                        let weaponPath = '';
                        if (itemPos.bodyPartIDs.length == 1)
                            weaponPath = fighter.bodyParts[itemPos.bodyPartIDs[0]].index == 1 ? 'right ' : 'left ';
                        weaponPath += item.tag;
                        if (attack && itemPos.bodyPartIDs.indexOf(attack.sourceID) >= 0)
                            weaponPath += ' up';
                        images.push(basePath + weaponPath + '.png');
                    }
                }
                return images;
            }
            addAllImagesForFighter(index, set) {
                for (let image of this.getImages(index, null))
                    set.add(image);
                for (let attack of this.sides[index].getAttacks())
                    for (let image of this.getImages(index, attack))
                        set.add(image);
            }
            getAllImages() {
                let set = new Set();
                for (let i = 0; i < 2; ++i)
                    this.addAllImagesForFighter(i, set);
                return Array.from(set);
            }
            step() {
                let attackerIndex = this.nextSideIndex;
                let defenderIndex = (this.nextSideIndex + 1) % this.sides.length;
                let attackerSide = this.sides[attackerIndex];
                let defenderSide = this.sides[defenderIndex];
                let result = this.attack(attackerSide, defenderSide);
                this.text += result.description + '<br>';
                if (!this.isFighterOK(defenderSide.getFighter())) {
                    this.winnerIndex = attackerIndex;
                    let rewards = this.getRewards();
                    Model.state.addMoney(rewards.money);
                    for (let i = 0; i < 2; ++i)
                        this.getFighter(i).addFame(rewards.fame[i]);
                }
                else
                    this.nextSideIndex = defenderIndex;
                Model.invalidate();
                return result;
            }
            getRewards() {
                return this.event.getRewards(this);
            }
            attack(attackerSide, defenderSide) {
                let attacker = attackerSide.getFighter();
                let defender = defenderSide.getFighter();
                let attacks = attackerSide.getAttacks();
                let attack = attacks[Util.getRandomInt(attacks.length)];
                let defenderSpeciesData = defender.getSpeciesData();
                let targetID = defender.chooseRandomBodyPart();
                let target = defender.bodyParts[targetID];
                let targetData = target.getData(defenderSpeciesData);
                let baseDamage = 0;
                let defense = 0;
                let attackSkill = Math.floor(attack.skill);
                let evadeSkill = Math.floor(defender.getSkill('evade'));
                let msg = attacker.name + ' uses ' + attack.data.name + ' on ' + defender.name + ' ' + targetData.instances[target.index].name + '. ';
                msg += 'Skill = ' + Data.Misc.BaseAttackSkill + ' + ' + attackSkill + ' - ' + evadeSkill + '. ';
                if (Util.getRandomInt(100) < Data.Misc.BaseAttackSkill + attackSkill - evadeSkill) {
                    let armourData = defenderSide.loadout.getBodyPartArmourData(target.id, defenderSide.getTeam());
                    defense = armourData ? armourData.getDefense(attack.data.type) : 0;
                    baseDamage = attack.data.damage;
                    let damage = baseDamage * (100 - defense) / 100;
                    defender.addHealth(-damage);
                    msg += 'Damage = ' + baseDamage + ' x ' + (100 - defense) + '% = ' + damage.toFixed(1) + '. ';
                }
                else {
                    msg += 'Missed!';
                }
                Model.invalidate();
                return new AttackResult(attack, msg, baseDamage, defense, targetID);
            }
            isFighterOK(fighter) {
                return fighter.canFight(this.event.injuryThreshold);
            }
            canStart() {
                let fighterA = this.getFighter(0);
                let fighterB = this.getFighter(1);
                return fighterA && fighterB && fighterA !== fighterB && this.isFighterOK(fighterA) && this.isFighterOK(fighterB);
            }
            getFame() {
                let fame = 0;
                for (let side of this.sides)
                    fame += side.getEquipmentFame() + side.getFighter().fame;
                return fame;
            }
        }
        Fight.State = State;
    })(Fight = Model.Fight || (Model.Fight = {}));
})(Model || (Model = {}));
"use strict";
var Model;
(function (Model) {
    class ItemPosition {
        constructor(itemID, bodyPartIDs) {
            this.itemID = itemID;
            this.bodyPartIDs = bodyPartIDs;
        }
    }
    Model.ItemPosition = ItemPosition;
    class Loadout {
        constructor(fighterID) {
            this.fighterID = fighterID;
            this.itemPositions = [];
        }
        onLoad() {
        }
        getFighter(team) {
            Util.assert(this.fighterID in team.fighters);
            return team.fighters[this.fighterID];
        }
        getOccupiedSites(itemType, team) {
            let bodyPartIDs = [];
            for (let itemPos of this.itemPositions)
                if (team.getItem(itemPos.itemID).type == itemType)
                    bodyPartIDs = bodyPartIDs.concat(itemPos.bodyPartIDs);
            return bodyPartIDs;
        }
        // Returns first available body parts compatible with specified site.
        findBodyPartsForSite(accType, site, team) {
            let fighter = this.getFighter(team);
            if (site.species != fighter.species)
                return null;
            let bodyPartIDs = [];
            let occupied = this.getOccupiedSites(accType, team);
            let speciesData = fighter.getSpeciesData();
            for (let id in fighter.bodyParts) {
                let part = fighter.bodyParts[id];
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
        findBodyPartsForItem(itemID, team) {
            let data = team.getItemData(itemID);
            for (let site of data.sites) {
                let bodyPartIDs = this.findBodyPartsForSite(team.getItem(itemID).type, site, team);
                if (bodyPartIDs)
                    return bodyPartIDs;
            }
            return null;
        }
        canAddItem(itemID, team) {
            return !!this.findBodyPartsForItem(itemID, team);
        }
        addItem(itemID, team) {
            // TODO: Choose site.
            let bodyPartIDs = this.findBodyPartsForItem(itemID, team);
            if (bodyPartIDs) {
                this.itemPositions.push(new ItemPosition(itemID, bodyPartIDs));
                Model.invalidate();
                return;
            }
            Util.assert(false);
        }
        removeItem(itemID) {
            for (let i = 0, itemPos; itemPos = this.itemPositions[i]; ++i)
                if (itemPos.itemID == itemID) {
                    this.itemPositions.splice(i, 1);
                    Model.invalidate();
                    return;
                }
            Util.assert(false);
        }
        hasItemID(id) {
            for (let itemPos of this.itemPositions)
                if (itemPos.itemID == id)
                    return true;
            return false;
        }
        getBodyPartArmourData(bodyPartID, team) {
            for (let itemPos of this.itemPositions) {
                if (team.getItem(itemPos.itemID).type == Model.ItemType.Armour)
                    for (let id of itemPos.bodyPartIDs)
                        if (id == bodyPartID)
                            return team.getArmourData(itemPos.itemID);
            }
            return null;
        }
        getEquipmentFame(team) {
            let fame = 0;
            for (let itemPos of this.itemPositions)
                fame += team.getItemData(itemPos.itemID).fame;
            return fame;
        }
    }
    Model.Loadout = Loadout;
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
            this.money = Data.Misc.StartingMoney;
            this.phase = Phase.Dawn;
            this.buildings = new Model.Buildings.State();
            this.team = new Model.Team();
            this.fight = null;
            this.news = [];
            this.events = [];
            this.time = 0; // Minutes.
            this.speed = 1; // Game minutes per second. 
            for (let data of Data.Events.Events) {
                let awayData = Util.dynamicCast(data, Data.Events.AwayFightEvent);
                if (awayData) {
                    const event = new Model.AwayFightEvent(awayData.day, awayData.injuryThreshold, awayData.fameRequired, awayData.losingFameReward, awayData.winningFameReward, awayData.losingMoneyReward, awayData.winningMoneyReward, awayData.name);
                    this.news.push(new Model.EventNews(event));
                    this.events.push(event);
                }
            }
        }
        onLoad() {
            Util.setPrototype(this.buildings, Model.Buildings.State);
            if (this.fight) {
                Util.setPrototype(this.fight, Model.Fight.State);
                this.fight.onLoad();
            }
            Util.setPrototype(this.team, Model.Team);
            this.team.onLoad();
            for (let event of this.events)
                Model.Event.initPrototype(event);
            if (this.phase == Phase.Dusk)
                this.phase = Phase.Dawn;
        }
        update(seconds) {
            Util.assert(this.phase == Phase.Day);
            let changed = this.addMinutes(seconds * this.speed, true);
            Model.saveState();
            return changed;
        }
        skipToNextDay(doWork) {
            Util.assert(this.phase == Phase.Day || this.phase == Phase.Fight);
            let newTime = (this.getDay() + 1) * minutesPerDay;
            let changed = this.addMinutes(newTime - this.time, doWork);
            this.phase = Phase.Dusk;
            Model.invalidate();
            return changed;
        }
        addMinutes(minutes, doWork) {
            let oldDay = this.getDay();
            this.time += minutes;
            let hoursPassed = minutes / 60;
            let changed = doWork && this.updateActivities(hoursPassed);
            if (this.getDay() > oldDay) {
                this.phase = Phase.Dusk;
            }
            Model.invalidate();
            return changed;
        }
        deleteEventsForToday() {
            this.events = this.events.filter(e => e.day != this.getDay());
            Model.invalidate();
        }
        isNight() { return this.phase == Phase.Dawn || this.phase == Phase.Dusk; }
        cancelNight() {
            Util.assert(this.isNight());
            this.phase = Phase.Dawn;
            this.advancePhase();
            Model.invalidate();
        }
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
                    if (this.getEventsForDay(this.getDay()).length == 0)
                        this.advancePhase();
                    break;
                case Phase.Event:
                    Util.assert(this.fight == null); // Otherwise startFight sets the phase. 
                    this.deleteEventsForToday();
                    this.phase = Phase.Day;
                    break;
                case Phase.Day:
                    this.phase = Phase.Dusk;
                    break;
                case Phase.Dusk:
                    this.phase = Phase.Dawn;
                    break;
            }
            Model.invalidate();
        }
        addEvent(event) {
            Util.assert(this.getEventsForDay(event.day).length == 0);
            this.events.push(event);
            this.events.sort((a, b) => { return a.day - b.day; });
            Model.invalidate();
        }
        getEventsForDay(day) {
            return this.events.filter(e => e.day == day);
        }
        updateActivities(hours) {
            let workPower = {}; // Activity -> power.
            let workers = {}; // Activity -> workers.
            for (let tag in Data.Activities.Types) {
                workPower[tag] = Data.Activities.Types[tag].freeWork;
                workers[tag] = [];
            }
            let UpdateExperience = function (activity) {
                if (activity in workers)
                    for (let i = 0, fighter; fighter = workers[activity][i]; ++i)
                        fighter.addExperience(activity, hours);
            };
            for (let id in this.team.fighters) {
                let fighter = this.team.fighters[id];
                let activity = fighter.getActivity();
                Util.assert(activity in Data.Activities.Types);
                if (Data.Activities.Types[activity].job) {
                    workPower[activity] += 1 + fighter.getExperience(activity) * Data.Misc.ExperienceBenefit;
                    workers[activity].push(fighter);
                }
                else {
                    let healRate = 0;
                    let parts = activity.split(':');
                    if (parts.length == 2 && parts[0] == 'train') {
                        let skill = parts[1];
                        fighter.addSkill(skill, hours * Data.Misc.TrainingRate);
                    }
                    else if (activity == 'heal') {
                        healRate = Data.Misc.HealingRate;
                    }
                    else if (activity == 'idle') {
                        healRate = Data.Misc.IdleHealingRate;
                    }
                    if (healRate)
                        fighter.addHealth(hours * healRate);
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
            Model.invalidate();
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
            Model.invalidate();
        }
        addMoney(amount) {
            Util.assert(amount >= 0);
            Model.state.money += amount;
            Model.invalidate();
        }
        buyAnimal(tag) {
            Util.assert(tag in Data.Animals.Types);
            this.spendMoney(Data.Animals.Types[tag].cost);
            this.team.addAnimal(tag);
            Model.invalidate();
        }
        buyPerson(tag) {
            Util.assert(tag in Data.People.Types);
            this.spendMoney(Data.People.Types[tag].cost);
            this.team.addPerson(tag);
            Model.invalidate();
        }
        buyArmour(tag) {
            Util.assert(tag in Data.Armour.Types);
            this.spendMoney(Data.Armour.Types[tag].cost);
            this.team.addItem(Model.ItemType.Armour, tag);
            Model.invalidate();
        }
        buyWeapon(tag) {
            Util.assert(tag in Data.Weapons.Types);
            this.spendMoney(Data.Weapons.Types[tag].cost);
            this.team.addItem(Model.ItemType.Weapon, tag);
            Model.invalidate();
        }
        startFight(fight) {
            Util.assert(this.fight == null);
            Util.assert(this.phase == Phase.Event);
            Util.assert(fight && fight.canStart());
            this.fight = fight;
            this.deleteEventsForToday();
            this.phase = Phase.Fight;
            Model.invalidate();
        }
        endFight() {
            Util.assert(!!this.fight);
            Util.assert(this.time % minutesPerDay == 0); // Fight must happen at dawn.
            this.fight = null;
            this.skipToNextDay(false);
            Model.invalidate();
        }
    }
    State.key = "state.v20";
    Model.State = State;
    let dirty = false;
    function init() {
        let str = localStorage.getItem(State.key);
        if (str) {
            Model.state = JSON.parse(str);
            Util.setPrototype(Model.state, State);
            Model.state.onLoad();
        }
        else
            resetState();
    }
    Model.init = init;
    function invalidate() {
        dirty = true;
    }
    Model.invalidate = invalidate;
    function saveState() {
        if (dirty) {
            localStorage.setItem(State.key, JSON.stringify(Model.state));
            dirty = false;
        }
    }
    Model.saveState = saveState;
    function resetState() {
        Model.state = new State();
        localStorage.removeItem(State.key);
        invalidate();
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
    class EventNews extends News {
        constructor(event) {
            let desc = 'Announcement: \n';
            desc += 'There will be an event on day ' + (event.day + 1) + '.\n';
            desc += 'The name of the event is "' + event.getDescription() + '".';
            super(desc);
        }
    }
    Model.EventNews = EventNews;
})(Model || (Model = {}));
/// <reference path="fighter.ts" />
"use strict";
var Model;
(function (Model) {
    class Person extends Model.Fighter {
        constructor(id, tag, name, fame) {
            let type = Data.People.Types[tag];
            super(id, 'human', name, Util.getImage('people', tag), fame);
        }
    }
    Model.Person = Person;
})(Model || (Model = {}));
"use strict";
var Model;
(function (Model) {
    var ItemType;
    (function (ItemType) {
        ItemType[ItemType["Weapon"] = 0] = "Weapon";
        ItemType[ItemType["Armour"] = 1] = "Armour";
    })(ItemType = Model.ItemType || (Model.ItemType = {}));
    ;
    class Item {
        constructor(type, tag) {
            this.type = type;
            this.tag = tag;
        }
    }
    Model.Item = Item;
    class Team {
        constructor() {
            this.fighters = {};
            this.items = {};
            this.nextFighterID = 1;
            this.nextItemID = 1;
        }
        onLoad() {
            for (let id in this.fighters) {
                let fighter = this.fighters[id];
                Model.Fighter.initPrototype(fighter);
                fighter.onLoad();
            }
        }
        addAnimal(tag) {
            Util.assert(tag in Data.Animals.Types);
            let data = Data.Animals.Types[tag];
            this.fighters[this.nextFighterID] = new Model.Animal(this.nextFighterID, tag, this.getUniqueFighterName(data.name), data.fame);
            ++this.nextFighterID;
            Model.invalidate();
        }
        addPerson(tag) {
            Util.assert(tag in Data.People.Types);
            let data = Data.People.Types[tag];
            this.fighters[this.nextFighterID] = new Model.Person(this.nextFighterID, tag, this.getUniqueFighterName(data.name), data.fame);
            ++this.nextFighterID;
            Model.invalidate();
        }
        addItem(type, tag) {
            let data = type == ItemType.Armour ? Data.Armour.Types : Data.Weapons.Types;
            Util.assert(tag in data);
            this.items[this.nextItemID] = new Item(type, tag);
            ++this.nextItemID;
            Model.invalidate();
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
        getItem(id) {
            Util.assert(id in this.items);
            return this.items[id];
        }
        getItemCount() {
            let count = 0;
            for (let id in this.items)
                ++count;
            return count;
        }
        getItemData(id) {
            let item = this.getItem(id);
            let data = item.type == ItemType.Armour ? Data.Armour.Types : Data.Weapons.Types;
            Util.assert(item.tag in data);
            return data[item.tag];
        }
        getArmourData(id) {
            let data = this.getItemData(id);
            Util.assert(data != null);
            return data;
        }
        getWeaponData(id) {
            let data = this.getItemData(id);
            Util.assert(data != null);
            return data;
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
    Model.Team = Team;
})(Model || (Model = {}));
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
            this.progress = this.duration ? (now - this.startTime) / this.duration : 1;
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
                ctx.restore();
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
})(View || (View = {}));
/// <reference path="page.ts" />
"use strict";
var View;
(function (View) {
    class FighterUI {
        constructor(index, arenaPage) {
            this.index = index;
            this.loadout = null;
            this.itemIDs = [];
            this.checkboxCells = [];
            this.fameCells = [];
            this.totalFame = 0;
            this.other = null;
            this.div = document.createElement('div');
            this.div.id = 'fighter_ui_div';
            // Fighter select.
            let makeOption = function (id) {
                let option = document.createElement('option');
                option.text = Model.state.team.fighters[id].name;
                if (!Model.state.team.fighters[id].canFight(arenaPage.event.injuryThreshold))
                    option.text += ' (x_x)';
                return option;
            };
            let items = [];
            for (let id in Model.state.team.fighters) {
                let fighter = Model.state.team.fighters[id];
                let name = fighter.name;
                if (!fighter.canFight(arenaPage.event.injuryThreshold))
                    name += ' (x_x)';
                items.push(new View.Table.SelectCellItem(id, name));
            }
            let tableFactory = new View.Table.Factory();
            tableFactory.addColumnHeader('Fighter ' + (index + 1));
            tableFactory.addColumnHeader('Fame');
            tableFactory.addColumnHeader('Equip');
            // Fighter row.
            let selectCell = new View.Table.SelectCell(0, items, (value) => { arenaPage.onFighterSelected(index); });
            this.fighterFameCell = new View.Table.TextCell('');
            tableFactory.addRow([selectCell, this.fighterFameCell, null], false, null);
            this.select = selectCell.selectElement;
            this.select.selectedIndex = 0;
            // Item rows.
            for (let id in Model.state.team.items) {
                let item = Model.state.team.items[id];
                let data = Model.state.team.getItemData(id);
                let handler = (value) => { arenaPage.onItemChecked(index, id, value); };
                let checkboxCell = new View.Table.CheckboxCell(20, handler);
                let fameCell = new View.Table.TextCell(data.fame.toString());
                let cells = [new View.Table.TextCell(data.name), fameCell, checkboxCell];
                tableFactory.addRow(cells, false, null);
                this.itemIDs.push(id);
                this.checkboxCells.push(checkboxCell);
                this.fameCells.push(fameCell);
            }
            // Total row.
            this.totalFameCell = new View.Table.TextCell('');
            let cells = [new View.Table.TextCell('Total'), this.totalFameCell, null];
            let row = tableFactory.addRow(cells, false, null);
            row.style.fontWeight = 'bold';
            this.div.appendChild(tableFactory.makeScroller());
        }
        getOtherLoadout() {
            return this.other ? this.other.loadout : null;
        }
        getFighterID() {
            return this.select.selectedIndex < 0 ? null : Model.state.team.getFighterIDs()[this.select.selectedIndex];
        }
        getFighter() {
            let id = this.getFighterID();
            return id ? Model.state.team.fighters[id] : null;
        }
        makeSide() {
            return this.getFighter() ? new Model.Fight.Side(this.loadout, null) : null;
        }
        updateFighter() {
            if (this.select.selectedIndex < 0) {
                this.loadout = null;
                return;
            }
            let fighterID = Model.state.team.getFighterIDs()[this.select.selectedIndex];
            let otherLoadout = this.getOtherLoadout();
            if (otherLoadout && otherLoadout.fighterID == fighterID)
                this.loadout = otherLoadout;
            else
                this.loadout = new Model.Loadout(fighterID);
            this.fighterFameCell.cellElement.innerText = this.getFighter().fame.toString();
            this.updateItems();
        }
        equipItem(itemID, value) {
            if (value)
                this.loadout.addItem(itemID, Model.state.team);
            else
                this.loadout.removeItem(itemID);
        }
        updateItems() {
            for (let i = 0; i < this.checkboxCells.length; ++i) {
                let checkbox = this.checkboxCells[i].checkbox;
                let itemID = this.itemIDs[i];
                let otherLoadout = this.getOtherLoadout();
                checkbox.checked = this.loadout && this.loadout.hasItemID(itemID);
                checkbox.disabled = !this.loadout || (!checkbox.checked && ((otherLoadout && otherLoadout.hasItemID(itemID)) || !this.loadout.canAddItem(itemID, Model.state.team)));
                this.fameCells[i].cellElement.style.color = checkbox.checked ? 'black' : 'grey';
            }
            this.totalFame = this.getFighter().fame + this.makeSide().getEquipmentFame();
            this.totalFameCell.cellElement.innerText = this.totalFame.toString();
        }
    }
    class ArenaPage extends View.Page {
        constructor(event) {
            super('Choose Fighters');
            this.fighterUIs = [];
            this.fameOK = true;
            this.fight = null;
            this.onStartButton = () => {
                Model.state.startFight(this.fight);
                View.Page.hideCurrent();
            };
            this.onFighterSelected = (fighterIndex) => {
                this.fighterUIs[fighterIndex].updateFighter();
                this.updateFight();
            };
            this.onItemChecked = (fighterIndex, itemID, value) => {
                this.fighterUIs[fighterIndex].equipItem(itemID, value);
                this.updateItems();
                this.updateFight();
            };
            this.event = Util.assertCast(event, Model.FightEvent);
            this.addFighterUI();
            if (this.getHomeFightEvent())
                this.addFighterUI();
            let statsDiv = document.createElement('div');
            statsDiv.id = 'arena_stats_div';
            this.div.appendChild(statsDiv);
            const home = this.getHomeFightEvent() != null;
            this.statsTable = document.createElement('table');
            this.statsTable.id = 'arena_stats_table';
            statsDiv.appendChild(this.statsTable);
            let hr = document.createElement('hr');
            statsDiv.appendChild(hr);
            let rewardsTitle = document.createElement('span');
            rewardsTitle.innerHTML = '<strong>Rewards:</strong>';
            statsDiv.appendChild(rewardsTitle);
            this.rewardsTable = document.createElement('table');
            this.rewardsTable.id = 'arena_stats_table';
            statsDiv.appendChild(this.rewardsTable);
            this.button = document.createElement('button');
            this.button.addEventListener('click', this.onStartButton);
            this.button.innerText = 'Start';
            this.div.appendChild(this.button);
            this.updateFight();
        }
        addFighterUI() {
            let index = this.fighterUIs.length;
            let fighterUI = new FighterUI(index, this);
            this.fighterUIs.push(fighterUI);
            this.div.appendChild(fighterUI.div);
            if (index == 1) {
                if (fighterUI.select.options.length > 1)
                    fighterUI.select.selectedIndex = 1;
                this.fighterUIs[0].other = fighterUI;
                fighterUI.other = this.fighterUIs[0];
            }
            fighterUI.updateFighter();
        }
        onShow() {
        }
        onClose() {
            if (Model.state.fight == null)
                Model.state.advancePhase();
            return true;
        }
        updateItems() {
            for (let ui of this.fighterUIs)
                ui.updateItems();
        }
        updateFight() {
            let awayFightEvent = this.getAwayFightEvent();
            let sideA = this.fighterUIs[0].makeSide();
            let sideB = awayFightEvent ? awayFightEvent.createNPCSide() : this.fighterUIs[1].makeSide();
            this.fight = new Model.Fight.State(sideA, sideB, this.event);
            this.updateStats();
            this.button.disabled = !this.fight.canStart() || !this.fameOK;
        }
        updateStats() {
            let tableFactory = new View.Table.Factory(this.statsTable);
            let addRow = (a, b) => {
                return tableFactory.addRow([new View.Table.TextCell(a), new View.Table.TextCell(b)], false, null);
            };
            let away = this.getAwayFightEvent();
            if (away) {
                this.fameOK = this.fighterUIs[0].totalFame >= away.fameRequired;
                let row = addRow('Fame required', away.fameRequired.toString());
                row.style.fontWeight = 'bold';
                row.style.color = this.fameOK ? 'green' : 'red';
            }
            else {
                let total = 0;
                for (let ui of this.fighterUIs) {
                    let label = 'Fighter ' + (ui.index + 1) + " fame";
                    addRow(label, ui.totalFame.toString());
                    total += ui.totalFame;
                }
                addRow('Arena fame', 'n/a');
                addRow('Total fame', total.toString());
                let attendance = this.getHomeFightEvent().getAttendance(total);
                let row = addRow('Attendance', attendance.toString());
                row.style.fontWeight = 'bold';
            }
            tableFactory = new View.Table.Factory(this.rewardsTable);
            addRow('Winning fame', this.event.getFameReward(this.fight, true).toString());
            addRow('Losing fame', this.event.getFameReward(this.fight, false).toString());
            if (away) {
                addRow('Winning money', this.event.getMoneyReward(this.fight, true).toString());
                addRow('Losing money', this.event.getMoneyReward(this.fight, false).toString());
            }
            else
                addRow('Money', this.event.getMoneyReward(this.fight, false).toString());
        }
        getHomeFightEvent() {
            return Util.dynamicCast(this.event, Model.HomeFightEvent);
        }
        getAwayFightEvent() {
            return Util.dynamicCast(this.event, Model.AwayFightEvent);
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
            super('Barracks (' + Model.state.team.getPeople().length + '/' + Model.state.buildings.getCapacity('barracks') + ')');
            let tableFactory = new View.Table.Factory();
            this.div.appendChild(tableFactory.makeScroller());
            tableFactory.addColumnHeader('Name', 20);
            tableFactory.addColumnHeader('Image', 30);
            tableFactory.addColumnHeader('Health', 10);
            tableFactory.addColumnHeader('Fame', 10);
            tableFactory.addColumnHeader('Skills', 10);
            tableFactory.addColumnHeader('Activity', 10);
            const activityItems = [];
            for (let id in Data.Activities.Types)
                activityItems.push(new View.Table.SelectCellItem(id, Data.Activities.Types[id].name));
            for (let person of Model.state.team.getPeople()) {
                let cells = [];
                cells.push(new View.Table.TextCell('<h4>' + person.name + '</h4>'));
                cells.push(new View.Table.ImageCell(person.image));
                cells.push(new View.Table.TextCell(person.getHealth().toString() + '/' + person.getSpeciesData().health));
                cells.push(new View.Table.TextCell(person.fame.toString()));
                for (let c of Util.formatRows(person.getSkills()))
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
            if (onLoad)
                this.image.onload = () => { onLoad(); };
            this.image.src = path;
        }
        draw(ctx) {
            ctx.drawImage(this.image, this.pos.x, this.pos.y);
        }
        drawCentred(ctx) {
            ctx.drawImage(this.image, this.pos.x - this.image.width / 2, this.pos.y - this.image.height / 2);
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
            };
            this.onBuyAllPeople = () => {
                for (let tag in Data.People.Types) {
                    Model.state.addMoney(Data.People.Types[tag].cost);
                    Model.state.buyPerson(tag);
                }
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
            };
            this.onHeal = () => {
                for (let id in Model.state.team.fighters)
                    Model.state.team.fighters[id].resetHealth();
            };
            this.onAddMoney = () => {
                Model.state.addMoney(100);
            };
            this.addButton('Buy all animals', this.onBuyAllAnimals);
            this.addButton('Buy all people', this.onBuyAllPeople);
            this.addButton('Buy all buildings', this.onBuyAllBuildings);
            this.addButton('Heal fighters', this.onHeal);
            this.addButton('Add 100 money', this.onAddMoney);
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
    class HitAnimation extends View.Animation {
        constructor(point) {
            super(1000);
            this.point = point;
            this.image = new View.CanvasImage();
            this.image.loadImage('images/hit.png', null);
        }
        draw(ctx, xform) {
            let point = xform.transformPoint(this.point);
            ctx.translate(point.x, point.y);
            ctx.scale(0.3, 0.3);
            this.image.drawCentred(ctx);
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
            this.images = [[], []];
            this.idleImagePaths = [[], []];
            this.currentAttack = null;
            this.currentAttackerIndex = 0;
            this.sequence = null;
            this.timer = 0;
            this.healths = [];
            this.winnerIndex = -1;
            this.onStartButton = () => {
                Util.assert(Model.state.fight != null && this.timer == 0);
                this.button.disabled = true;
                this.doAttack();
                this.timer = window.setInterval(this.onTick, 40);
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
            topDiv.className = 'top_section';
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
            canvas.className = 'bottom_section';
            this.canvas = new View.Canvas(canvas);
            this.div.appendChild(topDiv);
            this.div.appendChild(canvas);
            this.div.appendChild(this.scroller);
            this.backgroundImage.loadImage(Data.Misc.FightBackgroundImage, null);
            this.preloader = new View.Preloader(() => { this.draw(); });
            this.preloader.paths = Model.state.fight.getAllImages();
            this.preloader.paths.push(this.backgroundImage.image.src);
            this.preloader.go();
            this.fighters = [Model.state.fight.getFighter(0), Model.state.fight.getFighter(1)];
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
            Util.assert(Model.state.fight != null);
            this.winnerIndex = Model.state.fight.winnerIndex;
            const loserIndex = this.winnerIndex ? 0 : 1;
            const rewards = Model.state.fight.getRewards();
            let div = document.createElement('div');
            div.id = 'fight_results';
            this.div.appendChild(div);
            let html = '<b>' + Model.state.fight.getFighter(this.winnerIndex).name + ' has won! Fame +' + rewards.fame[this.winnerIndex] + '</b><br>';
            html += Model.state.fight.getFighter(loserIndex).name + ' has lost. Fame +' + rewards.fame[loserIndex] + '<br><br>';
            html += 'Money earned: ' + rewards.money;
            div.innerHTML = html;
            Model.state.endFight();
        }
        doAttack() {
            Util.assert(!!Model.state.fight);
            let attackerIndex = Model.state.fight.nextSideIndex;
            let result = Model.state.fight.step();
            let defenderIndex = Model.state.fight.nextSideIndex;
            let attacker = this.fighters[attackerIndex];
            let defender = this.fighters[defenderIndex];
            if (this.fighters[attackerIndex].isHuman()) {
                this.currentAttack = result.attack;
                this.currentAttackerIndex = attackerIndex;
                this.updateImages();
                this.sequence = this.makeHumanSequence(result, attackerIndex, defenderIndex);
            }
            else
                this.sequence = this.makeAnimalSequence(result, attackerIndex, defenderIndex);
            this.sequence.items.push(new View.Animation(1000));
            this.sequence.start();
            this.update();
            if (Model.state.fight.winnerIndex >= 0)
                this.stopFight();
        }
        makeHumanSequence(result, attackerIndex, defenderIndex) {
            let sourcePart = this.fighters[attackerIndex].bodyParts[result.attack.sourceID];
            let targetPart = this.fighters[defenderIndex].bodyParts[result.targetID];
            let sequence = new View.Sequence(this.speedCheckbox.checked ? 5 : 1);
            let pointB = this.getBodyPartPoint(defenderIndex, targetPart);
            if (result.attackDamage > 0)
                sequence.items.push(new HitAnimation(pointB));
            else
                sequence.items.push(new View.Animation(1000));
            let endAnim = new View.Animation(0);
            endAnim.onStart = () => { this.currentAttack = null; this.updateImages(); };
            sequence.items.push(endAnim);
            if (result.attackDamage > 0) {
                let damageString = result.attackDamage.toString() + ' x ' + (100 - result.defense).toString() + '%';
                let damageAnim = new DamageAnimation(damageString, pointB);
                damageAnim.onStart = () => { this.updateHealths(); };
                sequence.items.push(damageAnim);
            }
            return sequence;
        }
        makeAnimalSequence(result, attackerIndex, defenderIndex) {
            let sourcePart = this.fighters[attackerIndex].bodyParts[result.attack.sourceID];
            let targetPart = this.fighters[defenderIndex].bodyParts[result.targetID];
            let sequence = new View.Sequence(this.speedCheckbox.checked ? 5 : 1);
            let pointA = this.getBodyPartPoint(attackerIndex, sourcePart);
            let pointB = this.getBodyPartPoint(defenderIndex, targetPart);
            sequence.items.push(new GrowAnimation(result.attack.data.name, pointA));
            sequence.items.push(new PauseAnimation(result.attack.data.name, pointA, 500));
            sequence.items.push(new MoveAnimation(result.attack.data.name, pointA, pointB));
            if (result.attackDamage > 0) {
                let damageString = result.attackDamage.toString() + ' x ' + (100 - result.defense).toString() + '%';
                let damageAnim = new DamageAnimation(damageString, pointB);
                damageAnim.onStart = () => { this.updateHealths(); };
                sequence.items.push(damageAnim);
            }
            return sequence;
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
            for (let i = 0; i < 2; ++i) {
                this.images[i].length = 0;
                let paths = Model.state.fight ? Model.state.fight.getImages(i, i == this.currentAttackerIndex ? this.currentAttack : null) : this.idleImagePaths[i];
                if (this.idleImagePaths[i].length == 0)
                    this.idleImagePaths[i] = paths.slice();
                for (let path of paths) {
                    let image = new View.CanvasImage();
                    image.loadImage(path, () => { this.draw(); });
                    this.images[i].push(image);
                }
            }
            this.draw();
        }
        updateHealths() {
            for (let i = 0; i < 2; ++i) {
                if (this.fighters[i])
                    this.healths[i] = this.fighters[i].getHealth();
            }
        }
        getImageRect(index) {
            let image = this.images[index][0];
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
        drawHealthBar(ctx, base, current, max) {
            let scale = 5, width = 8;
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#802020';
            ctx.fillStyle = '#f08080';
            let innerRect = new Rect(base.x - width / 2, base.y - scale * max, base.x + width / 2, base.y);
            let outerRect = innerRect.clone();
            outerRect.expand(1, 1, 1, 1);
            innerRect.top = innerRect.bottom - innerRect.height() * current / max;
            innerRect.fill(ctx);
            outerRect.stroke(ctx);
        }
        drawHealthBars(ctx, sceneXform, fighterIndex) {
            let fighter = this.fighters[fighterIndex];
            let fighterRect = this.getImageRect(fighterIndex);
            let point = new Point(fighterIndex ? fighterRect.right + 50 : fighterRect.left - 50, fighterRect.bottom - 10);
            this.drawHealthBar(ctx, sceneXform.transformPoint(point), this.healths[fighterIndex], fighter.getSpeciesData().health);
        }
        draw() {
            if (!this.preloader.isFinished())
                return;
            let ctx = this.canvas.element.getContext("2d");
            let width = this.canvas.element.width;
            let height = this.canvas.element.height;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, width, height);
            let sceneXform = new Xform();
            let rectA = this.getImageRect(0);
            let rectB = this.getImageRect(1);
            // Scale to fit.
            let scaleX = Math.max(rectA.width(), rectB.width()) / 1485; // Giant crab.
            let scaleY = Math.max(rectA.height(), rectB.height()) / 848; // Giant crab.
            let scale = Math.max(Math.max(scaleX, scaleY), 0.4);
            sceneXform.matrix = sceneXform.matrix.translate(640, height);
            sceneXform.matrix = sceneXform.matrix.scale(1 / scale);
            sceneXform.matrix = sceneXform.matrix.translate(-640, -height);
            ctx.save();
            sceneXform.apply(ctx);
            ctx.scale(1280 / 800, 1280 / 800);
            Util.scaleCentred(ctx, 1.5, 400, 0);
            ctx.translate(-12, -200);
            this.backgroundImage.draw(ctx);
            ctx.restore();
            // Scale because all the animals are too big. 
            sceneXform.matrix = sceneXform.matrix.translate(640, height);
            sceneXform.matrix = sceneXform.matrix.scale(0.4);
            sceneXform.matrix = sceneXform.matrix.translate(-640, -height);
            ctx.fillStyle = '#80f080';
            ctx.save();
            sceneXform.apply(ctx);
            ctx.translate(rectA.left, rectA.top);
            this.drawFighter(0, ctx);
            ctx.restore();
            ctx.save();
            sceneXform.apply(ctx);
            ctx.translate(rectB.right, rectB.top);
            ctx.scale(-1, 1);
            this.drawFighter(1, ctx);
            ctx.restore();
            this.drawHealthBars(ctx, sceneXform, 0);
            this.drawHealthBars(ctx, sceneXform, 1);
            if (this.sequence)
                this.sequence.draw(ctx, sceneXform);
        }
        drawFighter(index, ctx) {
            if (this.winnerIndex >= 0 && index != this.winnerIndex) {
                let rect = this.getImageRect(index);
                ctx.translate(0, rect.height());
                ctx.rotate(-Math.PI / 2);
                ctx.translate(0, -rect.height());
            }
            for (let image of this.images[index])
                image.draw(ctx);
        }
    }
    View.FightPage = FightPage;
})(View || (View = {}));
/// <reference path="page.ts" />
"use strict";
var View;
(function (View) {
    class HomePage extends View.Page {
        constructor() {
            super('Home');
            this.onAddHomeFight = () => {
                Model.state.addEvent(new Model.HomeFightEvent(Model.state.getDay() + 1, Data.Misc.HomeFightInjuryThreshold));
                this.update();
            };
            let topDiv = document.createElement('div');
            topDiv.className = 'top_section';
            this.bottomDiv = document.createElement('div');
            this.bottomDiv.className = 'bottom_section';
            this.homeButton = document.createElement('button');
            this.homeButton.addEventListener('click', this.onAddHomeFight);
            this.homeButton.innerText = 'Add Home Fight';
            topDiv.appendChild(this.homeButton);
            this.div.appendChild(topDiv);
            this.div.appendChild(this.bottomDiv);
            this.update();
        }
        update() {
            let tableFactory = new View.Table.Factory();
            tableFactory.addColumnHeader('Day', 10);
            tableFactory.addColumnHeader('Event', 90);
            for (let event of Model.state.events) {
                let cells = [new View.Table.TextCell((event.day + 1).toString()), new View.Table.TextCell(event.getDescription())];
                tableFactory.addRow(cells, false, null);
            }
            if (this.bottomDiv.firstChild)
                this.bottomDiv.removeChild(this.bottomDiv.firstChild);
            this.bottomDiv.appendChild(tableFactory.makeScroller());
            let eventsForTomorrow = Model.state.getEventsForDay(Model.state.getDay() + 1);
            this.homeButton.disabled = eventsForTomorrow.length > 0;
        }
    }
    View.HomePage = HomePage;
})(View || (View = {}));
/// <reference path="page.ts" />
"use strict";
var View;
(function (View) {
    class KennelsPage extends View.Page {
        constructor() {
            super('Kennels (' + Model.state.team.getAnimals().length + '/' + Model.state.buildings.getCapacity('kennels') + ')');
            let tableFactory = new View.Table.Factory();
            this.div.appendChild(tableFactory.makeScroller());
            tableFactory.addColumnHeader('Name', 20);
            tableFactory.addColumnHeader('Image', 30);
            tableFactory.addColumnHeader('Health', 10);
            tableFactory.addColumnHeader('Fame', 10);
            for (let animal of Model.state.team.getAnimals()) {
                let cells = [];
                cells.push(new View.Table.TextCell('<h4>' + animal.name + '</h4>'));
                cells.push(new View.Table.ImageCell(animal.image));
                cells.push(new View.Table.TextCell(animal.getHealth().toString() + '/' + animal.getSpeciesData().health));
                cells.push(new View.Table.TextCell(animal.fame.toString()));
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
        constructor(tag, handler) {
            super();
            this.tag = tag;
            this.handler = handler;
        }
        onClick() {
            if (this.isEnabled())
                this.handler(this.tag);
        }
    }
    View.Trigger = Trigger;
    class Building extends Trigger {
        constructor(tag, handler) {
            super(tag, handler);
            this.handler = handler;
            this.levelIndex = -1;
            this.progress = -1;
        }
        isEnabled() {
            return Model.state.buildings.getCurrentLevelIndex(this.tag) >= 0;
        }
        update() {
            let changed = false;
            var index = Model.state.buildings.getCurrentLevelIndex(this.tag);
            if (index < 0 && !this.image) {
                let level = Data.Buildings.getLevel(this.tag, 0);
                this.loadImage(Data.Misc.ConstructionImage, () => { this.onload(); });
                this.pos = new Point(level.mapX, level.mapY);
                changed = true;
            }
            else if (this.levelIndex != index) {
                this.levelIndex = index;
                var level = Data.Buildings.getLevel(this.tag, index);
                this.loadImage(Util.getImage('buildings', this.tag + index), () => { this.onload(); });
                this.pos = new Point(level.mapX, level.mapY);
                changed = true;
            }
            let oldProgress = this.progress;
            if (Model.state.buildings.isConstructing(this.tag))
                this.progress = Model.state.buildings.getConstructionProgress(this.tag);
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
            trigger.loadImage(Util.getImage('buildings', 'town'), () => { this.draw(); });
            trigger.pos = new Point(town.mapX, town.mapY);
            this.Objects.push(trigger);
            this.updateObjects();
            this.draw();
        }
        updateObjects() {
            let redraw = false;
            for (var tag in Data.Buildings.Levels) {
                if (Model.state.buildings.getCurrentLevelIndex(tag) >= 0 || Model.state.buildings.isConstructing(tag)) {
                    let building = this.Buildings[tag];
                    if (!(tag in this.Buildings)) {
                        building = new Building(tag, Controller.onBuildingTriggerClicked);
                        this.Buildings[tag] = building;
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
    class Preloader {
        constructor(onFinished = null) {
            this.onFinished = onFinished;
            this.paths = [];
            this.images = [];
            this.finished = 0;
        }
        go() {
            for (let path of this.paths) {
                let image = new Image();
                if (this.onFinished)
                    image.onload = () => { this.onLoad(); };
                image.src = path;
                this.images.push(image);
            }
        }
        isFinished() {
            return this.finished == this.paths.length;
        }
        onLoad() {
            ++this.finished;
            if (this.isFinished())
                this.onFinished();
        }
    }
    View.Preloader = Preloader;
})(View || (View = {}));
/// <reference path="page.ts" />
"use strict";
var View;
(function (View) {
    class ShopPage extends View.Page {
        constructor(title) {
            super(title);
            this.scrollers = [];
            this.items = [];
            let topDiv = document.createElement('div');
            let bottomDiv = document.createElement('div');
            topDiv.id = 'shop_top';
            bottomDiv.id = 'shop_bottom';
            this.tabs = new View.TabBar((data) => { this.onTabClicked(data); });
            topDiv.appendChild(this.tabs.div);
            this.div.appendChild(topDiv);
            this.div.appendChild(bottomDiv);
            this.totalSpan = document.createElement('span');
            this.checkoutButton = document.createElement('button');
            this.checkoutButton.innerText = 'Check out';
            this.checkoutButton.addEventListener('click', () => { this.onCheckOut(); });
            this.totalSpan.style.cssFloat = this.checkoutButton.style.cssFloat = 'right';
            bottomDiv.appendChild(this.checkoutButton);
            bottomDiv.appendChild(this.totalSpan);
        }
        addTable(name) {
            let table = new View.Table.Factory();
            let scroller = table.makeScroller();
            scroller.id = 'shop_scroller';
            scroller.hidden = this.scrollers.length > 0;
            this.div.appendChild(scroller);
            this.tabs.addTab(name, scroller);
            this.scrollers.push(scroller);
            return table;
        }
        onShow() {
            this.updateItems();
        }
        onTabClicked(data) {
            for (let scroller of this.scrollers)
                scroller.hidden = scroller !== data;
        }
        onCheckOut() {
            for (let [item, cell] of this.items)
                for (let i = 0; i < cell.value; ++i)
                    item.buy();
            View.Page.hideCurrent();
            Controller.updateHUD();
            View.ludus.updateObjects();
        }
        updateItems() {
            let total = 0;
            let basket = new NumberMap();
            for (let [item, cell] of this.items) {
                total += item.cost * cell.value;
                basket.add(item.type, cell.value);
            }
            let moneyLeft = Model.state.getMoney() - total;
            for (let [item, cell] of this.items) {
                let canAdd = item.canBuy() && item.canAddToBasket(basket) && item.cost <= moneyLeft;
                cell.decButton.disabled = cell.value == 0;
                cell.incButton.disabled = !canAdd;
            }
            this.totalSpan.innerText = 'Total: ' + total + '. Money left: ' + moneyLeft;
            this.totalSpan.style.marginRight = '1em';
            this.checkoutButton.disabled = total == 0;
        }
        addItem(item, table) {
            let inputCell = new View.Table.NumberInputCell(15, () => { this.updateItems(); });
            let cells = [
                new View.Table.TextCell('<h4>' + item.title + '</h4>', 15),
                new View.Table.ImageCell(item.image, 15),
                new View.Table.TextCell(item.description, 40),
                new View.Table.TextCell(Util.formatMoney(item.cost), 15),
                inputCell
            ];
            table.addRow(cells, !item.canBuy(), null);
            this.items.push([item, inputCell]);
        }
    }
    View.ShopPage = ShopPage;
})(View || (View = {}));
/// <reference path="page.ts" />
"use strict";
var View;
(function (View) {
    class StoragePage extends View.Page {
        constructor() {
            super('Storage (' + Model.state.team.getItemCount() + '/' + Model.state.buildings.getCapacity('storage') + ')');
            let tableFactory = new View.Table.Factory();
            this.div.appendChild(tableFactory.makeScroller());
            tableFactory.addColumnHeader('Name', 20);
            tableFactory.addColumnHeader('Image', 10);
            tableFactory.addColumnHeader('Fame', 10);
            tableFactory.addColumnHeader('Type', 60);
            for (let id in Model.state.team.items) {
                let item = Model.state.team.items[id];
                let data = Model.state.team.getItemData(id);
                let cells = [new View.Table.TextCell('<h4>' + data.name + ' </h4>'), new View.Table.ImageCell(Util.getImage('items', item.tag)), new View.Table.TextCell(data.fame.toString()), new View.Table.TextCell(item.type == Model.ItemType.Armour ? 'Armour' : 'Weapon')];
                tableFactory.addRow(cells, false, null);
            }
        }
    }
    View.StoragePage = StoragePage;
})(View || (View = {}));
"use strict";
var View;
(function (View) {
    class TabBar {
        constructor(handler) {
            this.handler = handler;
            this.div = document.createElement('div');
            this.tabs = [];
            this.div.className = 'tab_bar';
        }
        onTabClicked(tab, data) {
            for (let t of this.tabs) {
                if (t === tab)
                    t.classList.add('tab_selected');
                else
                    t.classList.remove('tab_selected');
            }
            this.handler(data);
        }
        addTab(name, data) {
            let tab = document.createElement('div');
            tab.innerText = name;
            tab.className = 'tab';
            tab.addEventListener('click', () => { this.onTabClicked(tab, data); });
            this.tabs.push(tab);
            this.div.appendChild(tab);
            if (this.tabs.length == 1)
                this.onTabClicked(tab, data);
        }
    }
    View.TabBar = TabBar;
})(View || (View = {}));
"use strict";
var View;
(function (View) {
    var Table;
    (function (Table) {
        class Cell {
            constructor(width) {
                this.width = width;
                this.cellElement = null;
            } // %
            getElement() {
                this.cellElement = document.createElement('td');
                if (this.width)
                    this.cellElement.style.width = this.width.toString() + '%';
                return this.cellElement;
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
                this.selectElement = document.createElement('select');
                for (let i = 0, item; item = this.items[i]; ++i) {
                    let optionElement = document.createElement('option');
                    optionElement.value = item.tag;
                    optionElement.innerText = item.name;
                    this.selectElement.appendChild(optionElement);
                }
                this.selectElement.value = this.selectedTag;
                this.selectElement.addEventListener('change', () => { this.handler(this.selectElement.value); });
                e.appendChild(this.selectElement);
                return e;
            }
        }
        Table.SelectCell = SelectCell;
        class CheckboxCell extends Cell {
            constructor(width, handler) {
                super(width);
                this.handler = handler;
            }
            getElement() {
                this.checkbox = document.createElement('input');
                this.checkbox.type = 'checkbox';
                this.checkbox.addEventListener('click', () => { this.handler(this.checkbox.checked); });
                let e = super.getElement();
                e.appendChild(this.checkbox);
                return e;
            }
        }
        Table.CheckboxCell = CheckboxCell;
        class NumberInputCell extends Cell {
            constructor(width, handler) {
                super(width);
                this.handler = handler;
                this.value = 0;
            }
            getElement() {
                let addButton = (text, delta) => {
                    let button = document.createElement('button');
                    button.innerText = text;
                    button.addEventListener('click', () => { this.value += delta; this.update(); this.handler(); });
                    return button;
                };
                this.decButton = addButton('-', -1);
                this.incButton = addButton('+', 1);
                this.span = document.createElement('span');
                this.span.style.margin = '0 0.2em 0 0.2em';
                let e = super.getElement();
                e.appendChild(this.decButton);
                e.appendChild(this.span);
                e.appendChild(this.incButton);
                this.update();
                return e;
            }
            update() {
                this.span.innerText = this.value.toString();
            }
        }
        Table.NumberInputCell = NumberInputCell;
        class Factory {
            constructor(table = null) {
                this.table = table ? table : document.createElement('table');
                this.table.innerHTML = '';
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
                    row.appendChild((cell ? cell : new Cell()).getElement());
                row.addEventListener('click', handler);
                if (locked)
                    row.style.opacity = '0.5';
                if (!locked && handler)
                    row.className += ' highlight';
                return row;
            }
            makeScroller() {
                let div = document.createElement('div');
                div.appendChild(this.table);
                div.className = 'scroller';
                return div;
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
        document.getElementById('skip_day_btn').addEventListener('click', Controller.onSkipDayClicked);
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
    function cancelTransition() {
        if (!currentTransition)
            return;
        window.clearInterval(currentTransition.id);
        currentTransition = null;
        setOpacity(1);
    }
    View.cancelTransition = cancelTransition;
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
        document.getElementById('skip_day_btn').disabled = !enable;
    }
    View.enable = enable;
})(View || (View = {}));
