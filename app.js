var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
            for (var _i = 0, _a = View.ludus.Objects; _i < _a.length; _i++) {
                var obj = _a[_i];
                if (obj.isEnabled() && obj.getRect().pointInRect(new Point(x, y)))
                    return obj;
            }
            return null;
        }
        function onClick() {
            if (Canvas.HotObject)
                Canvas.HotObject.onClick();
        }
        Canvas.onClick = onClick;
        function onMouseMove(e) {
            var devPos = Util.getEventPos(e, View.ludus.element);
            var logPos = View.ludus.devToLog(devPos.x, devPos.y);
            var obj = hitTestObjects(logPos.x, logPos.y);
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
            onArenaTriggerClicked();
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
        if (Model.state.update(1)) {
            View.ludus.updateObjects();
        }
        updateHUD();
    }
    Controller.onTick = onTick;
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
        var page = new View.BarracksPage();
        page.show();
    }
    function onKennelsTriggerClicked() {
        var page = new View.KennelsPage();
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
        var page = new View.ArenaPage();
        page.show();
    }
    function onTownTriggerClicked() {
        Controller.Shop.showShopsPage();
    }
    Controller.onTownTriggerClicked = onTownTriggerClicked;
    function updateHUD() {
        var money = ' Money: ' + Util.formatMoney(Model.state.getMoney());
        var time = Model.state.getTimeString();
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
            var page = new View.ListPage('Let\'s go shopping!');
            page.addItem('Builders\' Merchant', 'Buy building kits', 'images/builders.jpg', false, onBuildersMerchantClicked);
            page.addItem('Animal Market', 'Buy animals', 'images/animals.jpg', false, onAnimalMarketClicked);
            page.addItem('People Market', 'Buy people', 'images/people.png', false, onPeopleMarketClicked);
            page.addItem('Armourer', 'Buy armour', 'images/armourer.jpg', true, null);
            page.show();
        }
        Shop.showShopsPage = showShopsPage;
        function onBuildersMerchantClicked() {
            var page = new View.ListPage(getShopTitle('Builders\' Merchant'));
            var _loop_1 = function (id) {
                level = Data.Buildings.getLevel(id, Model.state.buildings.getNextUpgradeIndex(id));
                if (level) {
                    handler = function () {
                        Model.state.buildings.buyUpgrade(id);
                        Controller.updateHUD();
                        View.ludus.updateObjects();
                    };
                    addItem(page, level.name, level.description, level.shopImage, !Model.state.buildings.canUpgrade(id), level.cost, handler);
                    page.show();
                }
            };
            var level, handler;
            for (var _i = 0, _a = ['home', 'arena', 'barracks', 'kennels', 'storage', 'weapon', 'armour', 'training', 'surgery', 'lab', 'merch']; _i < _a.length; _i++) {
                var id = _a[_i];
                _loop_1(id);
            }
        }
        function onAnimalMarketClicked() {
            var page = new View.ListPage(getShopTitle('Animal Market'));
            var hasKennels = Model.state.buildings.getCurrentLevelIndex('kennels') >= 0;
            var _loop_2 = function (id) {
                handler = function () {
                    Model.state.buyAnimal(id);
                    Controller.updateHUD();
                };
                var type = Data.Animals.Types[id];
                addItem(page, type.name, type.description, type.shopImage, !hasKennels, type.cost, handler);
                page.show();
            };
            var handler;
            for (var id in Data.Animals.Types) {
                _loop_2(id);
            }
        }
        function onPeopleMarketClicked() {
            var page = new View.ListPage(getShopTitle('People Market'));
            var hasBarracks = Model.state.buildings.getCurrentLevelIndex('barracks') >= 0;
            var _loop_3 = function (id) {
                handler = function () {
                    Model.state.buyPerson(id);
                    Controller.updateHUD();
                };
                var type = Data.People.Types[id];
                addItem(page, type.name, type.description, type.shopImage, !hasBarracks, type.cost, handler);
                page.show();
            };
            var handler;
            for (var id in Data.People.Types) {
                _loop_3(id);
            }
        }
    })(Shop = Controller.Shop || (Controller.Shop = {}));
})(Controller || (Controller = {}));
"use strict";
var Data;
(function (Data) {
    var Attack = (function () {
        function Attack(name, type, damage) {
            this.name = name;
            this.type = type;
            this.damage = damage;
        }
        return Attack;
    }());
    Data.Attack = Attack;
    var WeaponSite = (function () {
        function WeaponSite(name, type, replacesAttack) {
            this.name = name;
            this.type = type;
            this.replacesAttack = replacesAttack;
        }
        return WeaponSite;
    }());
    Data.WeaponSite = WeaponSite;
    var Site = (function () {
        function Site(species, type, count) {
            this.species = species;
            this.type = type;
            this.count = count;
        }
        return Site;
    }());
    Data.Site = Site;
    var Armour;
    (function (Armour) {
        var Type = (function () {
            function Type(name, cost, image, description, sites, defence) {
                this.name = name;
                this.cost = cost;
                this.image = image;
                this.description = description;
                this.sites = sites;
                this.defence = defence;
            }
            Type.prototype.validate = function () {
                for (var _i = 0, _a = this.sites; _i < _a.length; _i++) {
                    var site = _a[_i];
                    var speciesData = Species.Types[site.species];
                    if (!(speciesData && speciesData.bodyParts && speciesData.bodyParts[site.type]))
                        console.log('Armour: "%s" site references unknown body part "%s/%s"', this.name, site.species, site.type);
                }
            };
            Type.prototype.getDefense = function (attackType) {
                return this.defence[attackType] ? this.defence[attackType] : 0;
            };
            return Type;
        }());
        Armour.Type = Type;
    })(Armour = Data.Armour || (Data.Armour = {}));
    var Weapons;
    (function (Weapons) {
        var Type = (function () {
            function Type(name, block, cost, image, description, sites, attacks) {
                this.name = name;
                this.block = block;
                this.cost = cost;
                this.image = image;
                this.description = description;
                this.sites = sites;
                this.attacks = attacks;
            }
            Type.prototype.validate = function () {
                for (var _i = 0, _a = this.sites; _i < _a.length; _i++) {
                    var site = _a[_i];
                    var found = false;
                    var speciesData = Species.Types[site.species];
                    if (speciesData) {
                        for (var id in speciesData.bodyParts) {
                            var weaponSite = speciesData.bodyParts[id].weaponSite;
                            if (weaponSite && weaponSite.type == site.type) {
                                found = true;
                                break;
                            }
                        }
                    }
                    if (!found)
                        console.log('Weapon: "%s" site references unknown weapon site "%s/%s"', this.name, site.species, site.type);
                }
            };
            return Type;
        }());
        Weapons.Type = Type;
    })(Weapons = Data.Weapons || (Data.Weapons = {}));
    var BodyPartInstance = (function () {
        function BodyPartInstance(name, x, y) {
            this.name = name;
            this.x = x;
            this.y = y;
        }
        return BodyPartInstance;
    }());
    Data.BodyPartInstance = BodyPartInstance;
    var BodyPart = (function () {
        function BodyPart(health, attack, weaponSite, instances) {
            this.health = health;
            this.attack = attack;
            this.weaponSite = weaponSite;
            this.instances = instances;
        }
        return BodyPart;
    }());
    Data.BodyPart = BodyPart;
    var Species;
    (function (Species) {
        var Type = (function () {
            function Type(name) {
                this.name = name;
            }
            return Type;
        }());
        Species.Type = Type;
    })(Species = Data.Species || (Data.Species = {}));
    var Animals;
    (function (Animals) {
        var Type = (function () {
            function Type(cost, shopImage, species, name, description, armour, weapons) {
                this.cost = cost;
                this.shopImage = shopImage;
                this.species = species;
                this.name = name;
                this.description = description;
                this.armour = armour;
                this.weapons = weapons;
            }
            Type.prototype.validate = function () {
                if (!Species.Types[this.species])
                    console.log('Animal: "%s" references unknown species "%s"', this.name, this.species);
                if (!Species.Types[this.species].bodyParts)
                    console.log('Animal: "%s" has no body parts', this.name);
                for (var _i = 0, _a = this.weapons; _i < _a.length; _i++) {
                    var weapon = _a[_i];
                    if (!Weapons.Types[weapon])
                        console.log('Animal: "%s" references unknown weapon "%s"', this.name, weapon);
                }
                for (var _b = 0, _c = this.armour; _b < _c.length; _b++) {
                    var armour = _c[_b];
                    if (!Armour.Types[armour])
                        console.log('Animal: "%s" references unknown armour "%s"', this.name, armour);
                }
            };
            return Type;
        }());
        Animals.Type = Type;
    })(Animals = Data.Animals || (Data.Animals = {}));
    var People;
    (function (People) {
        var Type = (function () {
            function Type(cost, shopImage, name, description, armour, weapons) {
                this.cost = cost;
                this.shopImage = shopImage;
                this.name = name;
                this.description = description;
                this.armour = armour;
                this.weapons = weapons;
            }
            Type.prototype.validate = function () {
                for (var _i = 0, _a = this.weapons; _i < _a.length; _i++) {
                    var weapon = _a[_i];
                    if (!Weapons.Types[weapon])
                        console.log('People: "%s" references unknown weapon "%s"', this.name, weapon);
                }
                for (var _b = 0, _c = this.armour; _b < _c.length; _b++) {
                    var armour = _c[_b];
                    if (!Armour.Types[armour])
                        console.log('People: "%s" references unknown armour "%s"', this.name, armour);
                }
            };
            return Type;
        }());
        People.Type = Type;
    })(People = Data.People || (Data.People = {}));
    var Buildings;
    (function (Buildings) {
        var Level = (function () {
            function Level(cost, buildTime, mapX, mapY, mapImage, shopImage, name, description) {
                this.cost = cost;
                this.buildTime = buildTime;
                this.mapX = mapX;
                this.mapY = mapY;
                this.mapImage = mapImage;
                this.shopImage = shopImage;
                this.name = name;
                this.description = description;
            }
            return Level;
        }());
        Buildings.Level = Level;
        function getLevel(id, index) {
            Util.assert(id in Buildings.Levels);
            return index >= 0 && index < Buildings.Levels[id].length ? Buildings.Levels[id][index] : null;
        }
        Buildings.getLevel = getLevel;
    })(Buildings = Data.Buildings || (Data.Buildings = {}));
    var Activities;
    (function (Activities) {
        var Type = (function () {
            function Type(name, job, human, animal, freeWork) {
                this.name = name;
                this.job = job;
                this.human = human;
                this.animal = animal;
                this.freeWork = freeWork;
            }
            return Type;
        }());
        Activities.Type = Type;
    })(Activities = Data.Activities || (Data.Activities = {}));
    function validate() {
        console.log('Validating data...');
        for (var id in Armour.Types)
            Armour.Types[id].validate();
        for (var id in Weapons.Types)
            Weapons.Types[id].validate();
        for (var id in Animals.Types)
            Animals.Types[id].validate();
        for (var id in People.Types)
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
    var Accessory = (function () {
        function Accessory(tag, bodyPartIDs) {
            this.tag = tag;
            this.bodyPartIDs = bodyPartIDs;
        }
        return Accessory;
    }());
    Model.Accessory = Accessory;
    var Weapon = (function (_super) {
        __extends(Weapon, _super);
        function Weapon(tag, bodyPartIDs) {
            return _super.call(this, tag, bodyPartIDs) || this;
        }
        return Weapon;
    }(Accessory));
    Model.Weapon = Weapon;
    var Armour = (function (_super) {
        __extends(Armour, _super);
        function Armour(tag, bodyPartIDs) {
            return _super.call(this, tag, bodyPartIDs) || this;
        }
        return Armour;
    }(Accessory));
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
    var BodyPart = (function () {
        function BodyPart(id, tag, index, health) {
            this.id = id;
            this.tag = tag;
            this.index = index;
            this.health = health;
        }
        BodyPart.prototype.getData = function (speciesData) {
            return speciesData.bodyParts[this.tag];
        };
        BodyPart.prototype.getInstanceData = function (speciesData) {
            return this.getData(speciesData).instances[this.index];
        };
        // Gets tag of armour or weapon site, if present.
        BodyPart.prototype.getSiteTag = function (accType, speciesData) {
            if (accType == AccessoryType.Armour)
                return this.tag;
            var site = this.getData(speciesData).weaponSite;
            return site ? site.type : null;
        };
        return BodyPart;
    }());
    Model.BodyPart = BodyPart;
    var Attack = (function () {
        function Attack(data, sourceID) {
            this.data = data;
            this.sourceID = sourceID;
        }
        return Attack;
    }());
    Model.Attack = Attack;
    var Fighter = (function () {
        function Fighter(id, species, name, image, weapons, armour) {
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
            var data = this.getSpeciesData();
            for (var tag in data.bodyParts) {
                var part = data.bodyParts[tag];
                for (var i = 0; i < part.instances.length; ++i) {
                    this.bodyParts[this.nextBodyPartID] = new BodyPart(this.nextBodyPartID.toString(), tag, i, part.health);
                    ++this.nextBodyPartID;
                }
            }
            for (var _i = 0, weapons_1 = weapons; _i < weapons_1.length; _i++) {
                var tag = weapons_1[_i];
                this.addWeapon(tag);
            }
            for (var _a = 0, armour_1 = armour; _a < armour_1.length; _a++) {
                var tag = armour_1[_a];
                this.addArmour(tag);
            }
        }
        Fighter.prototype.onLoad = function () {
            for (var id in this.bodyParts)
                this.bodyParts[id].__proto__ = BodyPart.prototype;
            for (var _i = 0, _a = this.weapons; _i < _a.length; _i++) {
                var weapon = _a[_i];
                weapon.__proto__ = Model.Weapon.prototype;
            }
            for (var _b = 0, _c = this.armour; _b < _c.length; _b++) {
                var armour = _c[_b];
                armour.__proto__ = Model.Armour.prototype;
            }
        };
        Fighter.prototype.isHuman = function () { return this.species == 'human'; };
        Fighter.prototype.getAccessories = function (type) {
            return type == AccessoryType.Weapon ? this.weapons : this.armour;
        };
        Fighter.prototype.getSpeciesData = function () {
            var type = Data.Species.Types[this.species];
            Util.assert(type != undefined);
            return type;
        };
        Fighter.prototype.getOccupiedSites = function (accType) {
            var bodyPartIDs = [];
            for (var _i = 0, _a = this.getAccessories(accType); _i < _a.length; _i++) {
                var acc = _a[_i];
                bodyPartIDs = bodyPartIDs.concat(acc.bodyPartIDs);
            }
            return bodyPartIDs;
        };
        // Returns first available body parts compatible with specified site. 
        Fighter.prototype.findBodyPartsForSite = function (accType, site) {
            if (site.species != this.species)
                return null;
            var bodyPartIDs = [];
            var occupied = this.getOccupiedSites(accType);
            var speciesData = this.getSpeciesData();
            for (var id in this.bodyParts) {
                var part = this.bodyParts[id];
                if (occupied.indexOf(id) < 0) {
                    if (part.getSiteTag(accType, speciesData) == site.type) {
                        bodyPartIDs.push(id);
                        if (bodyPartIDs.length == site.count)
                            return bodyPartIDs;
                    }
                }
            }
            return null;
        };
        Fighter.prototype.findBodyPartsForAccessory = function (accType, accTag) {
            var data = accType == AccessoryType.Weapon ? Data.Weapons.Types[accTag] : Data.Armour.Types[accTag];
            for (var _i = 0, _a = data.sites; _i < _a.length; _i++) {
                var site = _a[_i];
                var bodyPartIDs = this.findBodyPartsForSite(accType, site);
                if (bodyPartIDs)
                    return bodyPartIDs;
            }
            return null;
        };
        Fighter.prototype.canAddWeapon = function (weaponTag) {
            return !!this.findBodyPartsForAccessory(AccessoryType.Weapon, weaponTag);
        };
        Fighter.prototype.canAddArmour = function (armourTag) {
            return !!this.findBodyPartsForAccessory(AccessoryType.Armour, armourTag);
        };
        Fighter.prototype.addWeapon = function (weaponTag) {
            // TODO: Choose site.
            var bodyPartIDs = this.findBodyPartsForAccessory(AccessoryType.Weapon, weaponTag);
            if (bodyPartIDs) {
                this.weapons.push(new Model.Weapon(weaponTag, bodyPartIDs));
                return;
            }
            Util.assert(false);
        };
        Fighter.prototype.addArmour = function (armourTag) {
            // TODO: Choose site.
            var bodyPartIDs = this.findBodyPartsForAccessory(AccessoryType.Armour, armourTag);
            if (bodyPartIDs) {
                this.armour.push(new Model.Armour(armourTag, bodyPartIDs));
                return;
            }
            Util.assert(false);
        };
        Fighter.prototype.getBodyPartArmour = function (bodyPartID) {
            for (var _i = 0, _a = this.armour; _i < _a.length; _i++) {
                var armour = _a[_i];
                for (var _b = 0, _c = armour.bodyPartIDs; _b < _c.length; _b++) {
                    var id = _c[_b];
                    if (id == bodyPartID)
                        return armour;
                }
            }
            return null;
        };
        Fighter.prototype.getStatus = function () {
            // Get armour string for each body part.
            var partArmour = {};
            for (var _i = 0, _a = this.armour; _i < _a.length; _i++) {
                var armour = _a[_i];
                var data = Data.Armour.Types[armour.tag];
                for (var _b = 0, _c = armour.bodyPartIDs; _b < _c.length; _b++) {
                    var partID = _c[_b];
                    partArmour[partID] = data.name + (armour.bodyPartIDs.length > 1 ? '*' : '');
                }
            }
            // Get weapon string for each body part.
            var partWeapons = {};
            for (var _d = 0, _e = this.weapons; _d < _e.length; _d++) {
                var weapon = _e[_d];
                var data = Data.Weapons.Types[weapon.tag];
                for (var _f = 0, _g = weapon.bodyPartIDs; _f < _g.length; _f++) {
                    var partID = _g[_f];
                    partWeapons[partID] = data.name + (weapon.bodyPartIDs.length > 1 ? '*' : '');
                }
            }
            var speciesData = this.getSpeciesData();
            var rows = [];
            var status = '';
            for (var id in this.bodyParts) {
                var part = this.bodyParts[id];
                var data = speciesData.bodyParts[part.tag];
                var row = [];
                rows.push(row);
                row.push(part.getInstanceData(speciesData).name);
                row.push(part.health.toString() + '/' + data.health);
                row.push(partArmour[id] ? partArmour[id] : '');
                row.push(partWeapons[id] ? partWeapons[id] : '');
            }
            return rows;
        };
        Fighter.prototype.getAttacks = function () {
            var attacks = [];
            var speciesData = this.getSpeciesData();
            for (var id in this.bodyParts) {
                var part = this.bodyParts[id];
                var data = speciesData.bodyParts[part.tag];
                if (data.attack)
                    attacks.push(new Attack(data.attack, id)); // TODO: Check body part health.
            }
            for (var _i = 0, _a = this.weapons; _i < _a.length; _i++) {
                var weapon = _a[_i];
                var data = Data.Weapons.Types[weapon.tag];
                for (var _b = 0, _c = data.attacks; _b < _c.length; _b++) {
                    var attack = _c[_b];
                    attacks.push(new Attack(attack, weapon.bodyPartIDs[0]));
                } // Just use the first body part for the source. 
            }
            return attacks;
        };
        Fighter.prototype.getBodyParts = function () {
            var parts = [];
            for (var id in this.bodyParts)
                parts.push(this.bodyParts[id]); // TODO: Check body part health ? 
            return parts;
        };
        Fighter.prototype.getBodyPartIDs = function () {
            var ids = [];
            for (var id in this.bodyParts)
                ids.push(id); // TODO: Check body part health ? 
            return ids;
        };
        Fighter.prototype.chooseRandomBodyPart = function () {
            var targets = this.getBodyPartIDs();
            var targetIndex = Util.getRandomInt(targets.length);
            return targets[targetIndex];
        };
        Fighter.prototype.isDead = function () {
            for (var id in this.bodyParts)
                if (this.bodyParts[id].health == 0)
                    return true;
            return false;
        };
        Fighter.prototype.resetHealth = function () {
            for (var _i = 0, _a = this.getBodyParts(); _i < _a.length; _i++) {
                var part = _a[_i];
                part.health = part.getData(this.getSpeciesData()).health;
            }
            Model.saveState();
        };
        Fighter.prototype.getExperience = function (tag) {
            return this.experience[tag] || 0;
        };
        Fighter.prototype.addExperience = function (tag, hours) {
            this.experience[tag] = this.experience[tag] || 0;
            this.experience[tag] += hours;
        };
        Fighter.prototype.getActivity = function () {
            return this.activity;
        };
        Fighter.prototype.setActivity = function (tag) {
            this.activity = tag;
            Model.saveState();
        };
        return Fighter;
    }());
    Model.Fighter = Fighter;
})(Model || (Model = {}));
/// <reference path="fighter.ts" />
"use strict";
var Model;
(function (Model) {
    var Animal = (function (_super) {
        __extends(Animal, _super);
        function Animal(id, tag, name) {
            var _this = this;
            var type = Data.Animals.Types[tag];
            _this = _super.call(this, id, type.species, name, type.shopImage, type.weapons, type.armour) || this;
            return _this;
        }
        return Animal;
    }(Model.Fighter));
    Model.Animal = Animal;
})(Model || (Model = {}));
"use strict";
var Model;
(function (Model) {
    var Buildings;
    (function (Buildings) {
        var State = (function () {
            function State() {
                this.types = {};
                for (var type in Data.Buildings.Levels) {
                    var free = Data.Buildings.getLevel(type, 0).cost == 0;
                    this.types[type] = { levelIndex: free ? 0 : -1, progress: -1 };
                }
            }
            State.prototype.update = function (hours) {
                var changed = false;
                var buildingCount = 0;
                for (var id in this.types)
                    if (this.isConstructing(id))
                        ++buildingCount;
                for (var id in this.types)
                    if (this.continueConstruction(id, hours / buildingCount))
                        changed = true;
                return changed;
            };
            State.prototype.getCurrentLevelIndex = function (id) {
                Util.assert(id in this.types);
                return this.types[id].levelIndex;
            };
            State.prototype.getNextLevelIndex = function (id) {
                var nextIndex = this.getCurrentLevelIndex(id) + 1;
                return nextIndex < this.getLevelCount(id) ? nextIndex : -1;
            };
            State.prototype.getNextUpgradeIndex = function (id) {
                var index = this.getCurrentLevelIndex(id) + 1;
                if (this.isConstructing(id))
                    ++index;
                return index < this.getLevelCount(id) ? index : -1;
            };
            State.prototype.setLevelIndex = function (id, index) {
                Util.assert(id in this.types);
                Util.assert(index < this.getLevelCount(id));
                this.types[id].levelIndex = index;
                Model.saveState();
            };
            State.prototype.canUpgrade = function (id) {
                Util.assert(id in this.types);
                var level = this.getNextLevel(id);
                return level && Model.state.getMoney() >= level.cost && !this.isConstructing(id);
            };
            State.prototype.buyUpgrade = function (id) {
                Util.assert(this.canUpgrade(id));
                Model.state.spendMoney(this.getNextLevel(id).cost);
                this.types[id].progress = 0;
                Model.saveState();
            };
            State.prototype.isConstructing = function (id) {
                return this.types[id].progress >= 0;
            };
            State.prototype.continueConstruction = function (id, manHours) {
                Util.assert(id in this.types);
                if (!this.isConstructing(id))
                    return false;
                var level = this.getNextLevel(id);
                Util.assert(level != null);
                if (this.types[id].progress + manHours >= level.buildTime) {
                    this.types[id].progress = -1;
                    ++this.types[id].levelIndex;
                }
                else
                    this.types[id].progress += manHours;
                return true;
            };
            State.prototype.getConstructionProgress = function (id) {
                Util.assert(id in this.types);
                var progress = this.types[id].progress;
                if (progress < 0)
                    return 0;
                var level = this.getNextLevel(id);
                Util.assert(level != null);
                return progress / level.buildTime;
            };
            State.prototype.getNextLevel = function (id) {
                return Data.Buildings.getLevel(id, this.getNextLevelIndex(id));
            };
            State.prototype.getLevelCount = function (id) {
                return Data.Buildings.Levels[id].length;
            };
            return State;
        }());
        Buildings.State = State;
    })(Buildings = Model.Buildings || (Model.Buildings = {}));
})(Model || (Model = {}));
"use strict";
var Model;
(function (Model) {
    var Fight;
    (function (Fight) {
        var AttackResult = (function () {
            function AttackResult(name, description, attackDamage, defense, sourceID, targetID) {
                this.name = name;
                this.description = description;
                this.attackDamage = attackDamage;
                this.defense = defense;
                this.sourceID = sourceID;
                this.targetID = targetID;
            }
            return AttackResult;
        }());
        Fight.AttackResult = AttackResult;
        var State = (function () {
            function State(teamA, teamB) {
                this.teams = [teamA, teamB];
                this.text = '';
                this.nextTeamIndex = 0;
                this.steps = 0;
                this.finished = false;
            }
            State.prototype.step = function () {
                // Assume 2 teams of 1 fighter each. 
                var attacker = Model.state.fighters[this.teams[this.nextTeamIndex][0]];
                this.nextTeamIndex = (this.nextTeamIndex + 1) % this.teams.length;
                var defender = Model.state.fighters[this.teams[this.nextTeamIndex][0]];
                var result = this.attack(attacker, defender);
                this.text += result.description + '<br>';
                this.finished = defender.isDead();
                Model.saveState();
                return result;
            };
            State.prototype.attack = function (attacker, defender) {
                var attacks = attacker.getAttacks();
                var attack = attacks[Util.getRandomInt(attacks.length)];
                var defenderSpeciesData = defender.getSpeciesData();
                var targetID = defender.chooseRandomBodyPart();
                var target = defender.bodyParts[targetID];
                var targetData = target.getData(defenderSpeciesData);
                var armour = defender.getBodyPartArmour(target.id);
                var armourData = armour ? Data.Armour.Types[armour.tag] : null;
                var defense = armourData ? armourData.getDefense(attack.data.type) : 0;
                var damage = attack.data.damage * (100 - defense) / 100;
                var oldHealth = target.health;
                target.health = Math.max(0, oldHealth - damage);
                var msg = attacker.name + ' uses ' + attack.data.name + ' on ' + defender.name + ' ' + targetData.instances[target.index].name + '. ';
                msg += 'Damage = ' + attack.data.damage + ' x ' + (100 - defense) + '% = ' + damage.toFixed(1) + '. ';
                msg += 'Health ' + oldHealth.toFixed(1) + ' -> ' + target.health.toFixed(1) + '. ';
                return new AttackResult(attack.data.name, msg, attack.data.damage, defense, attack.sourceID, targetID);
            };
            return State;
        }());
        Fight.State = State;
    })(Fight = Model.Fight || (Model.Fight = {}));
})(Model || (Model = {}));
"use strict";
var Model;
(function (Model) {
    var State = (function () {
        function State() {
            this.money = 1000;
            this.buildings = new Model.Buildings.State();
            this.fight = null;
            this.fighters = {};
            this.nextFighterID = 1;
            this.time = 0; // Minutes.
            this.speed = 1; // Game minutes per second. 
        }
        State.prototype.update = function (seconds) {
            var minutesPassed = seconds * this.speed;
            this.time += minutesPassed;
            var hoursPassed = minutesPassed / 60;
            var changed = this.updateActivities(hoursPassed);
            Model.saveState();
            return changed;
        };
        State.prototype.updateActivities = function (hours) {
            var workPower = {}; // Activity -> power.
            var workers = {}; // Activity -> workers.
            for (var id in Data.Activities.Types) {
                workPower[id] = Data.Activities.Types[id].freeWork;
                workers[id] = [];
            }
            var UpdateExperience = function (activity) {
                if (activity in workers)
                    for (var i = 0, fighter = void 0; fighter = workers[activity][i]; ++i)
                        fighter.addExperience(activity, hours);
            };
            for (var id in this.fighters) {
                var fighter = this.fighters[id];
                var activity = fighter.getActivity();
                Util.assert(activity in Data.Activities.Types);
                if (Data.Activities.Types[activity].job) {
                    workPower[activity] += 1 + fighter.getExperience(activity) * Data.Misc.ExperienceBenefit;
                    workers[activity].push(fighter);
                }
                else {
                }
            }
            // Building, training animals, training gladiators, crafting, repairing:
            var redraw = false;
            if ('build' in workPower && this.buildings.update(hours * workPower['build'])) {
                UpdateExperience('build');
                redraw = true;
            }
            return redraw;
        };
        State.prototype.setSpeed = function (speed) {
            if (speed > this.speed) {
                this.time = Math.floor(this.time / speed) * speed;
            }
            this.speed = speed;
        };
        State.prototype.getTimeString = function () {
            var minutesPerDay = 60 * 12;
            var days = Math.floor(this.time / minutesPerDay);
            var hours = Math.floor((this.time % minutesPerDay) / 60);
            var mins = Math.floor(this.time % 60);
            return 'Day ' + (days + 1).toString() + ' ' + ('00' + (hours + 6)).slice(-2) + ':' + ('00' + mins).slice(-2);
        };
        State.prototype.getMoney = function () { return Model.state.money; };
        State.prototype.spendMoney = function (amount) {
            Util.assert(amount >= 0 && Model.state.money >= amount);
            Model.state.money -= amount;
            Model.saveState();
        };
        State.prototype.addMoney = function (amount) {
            Util.assert(amount >= 0);
            Model.state.money += amount;
            Model.saveState();
        };
        State.prototype.buyAnimal = function (tag) {
            Util.assert(tag in Data.Animals.Types);
            this.spendMoney(Data.Animals.Types[tag].cost);
            this.fighters[this.nextFighterID] = new Model.Animal(this.nextFighterID, tag, this.getUniqueFighterName(Data.Animals.Types[tag].name));
            ++this.nextFighterID;
            Model.saveState();
        };
        State.prototype.buyPerson = function (tag) {
            Util.assert(tag in Data.People.Types);
            this.spendMoney(Data.People.Types[tag].cost);
            this.fighters[this.nextFighterID] = new Model.Person(this.nextFighterID, tag, this.getUniqueFighterName(Data.People.Types[tag].name));
            ++this.nextFighterID;
            Model.saveState();
        };
        State.prototype.getPeople = function () {
            var people = [];
            for (var id in this.fighters)
                if (this.fighters[id] instanceof Model.Person)
                    people.push(this.fighters[id]);
            return people;
        };
        State.prototype.getAnimals = function () {
            var animals = [];
            for (var id in this.fighters)
                if (this.fighters[id] instanceof Model.Animal)
                    animals.push(this.fighters[id]);
            return animals;
        };
        State.prototype.getFighterIDs = function () {
            var ids = [];
            for (var id in this.fighters)
                ids.push(id);
            return ids;
        };
        State.prototype.startFight = function (teamA, teamB) {
            Util.assert(this.fight == null);
            this.fight = new Model.Fight.State(teamA, teamB);
            Model.saveState();
        };
        State.prototype.endFight = function () {
            Util.assert(!!this.fight);
            this.fight = null;
            Model.saveState();
        };
        State.prototype.getUniqueFighterName = function (name) {
            var _this = this;
            var find = function (name) {
                for (var id in _this.fighters)
                    if (_this.fighters[id].name == name)
                        return true;
                return false;
            };
            var tryName = '';
            var i = 1;
            while (true) {
                var tryName_1 = name + ' ' + i.toString();
                if (!find(tryName_1))
                    return tryName_1;
                ++i;
            }
        };
        return State;
    }());
    State.key = "state.v9";
    Model.State = State;
    function init() {
        var str = localStorage.getItem(State.key);
        if (str) {
            Model.state = JSON.parse(str);
            Model.state.__proto__ = State.prototype;
            Model.state.buildings.__proto__ = Model.Buildings.State.prototype;
            if (Model.state.fight)
                Model.state.fight.__proto__ = Model.Fight.State.prototype;
            for (var id in Model.state.fighters) {
                var fighter = Model.state.fighters[id];
                if (fighter.species == 'human')
                    fighter.__proto__ = Model.Person.prototype;
                else
                    fighter.__proto__ = Model.Animal.prototype;
                fighter.onLoad();
            }
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
/// <reference path="fighter.ts" />
"use strict";
var Model;
(function (Model) {
    var Person = (function (_super) {
        __extends(Person, _super);
        function Person(id, tag, name) {
            var _this = this;
            var type = Data.People.Types[tag];
            _this = _super.call(this, id, 'human', name, type.shopImage, type.weapons, type.armour) || this;
            return _this;
        }
        return Person;
    }(Model.Fighter));
    Model.Person = Person;
})(Model || (Model = {}));
"use strict";
var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    Point.prototype.clone = function () { return new Point(this.x, this.y); };
    Point.prototype.translate = function (ctx) { ctx.translate(this.x, this.y); };
    ;
    return Point;
}());
var Rect = (function () {
    function Rect(left, top, right, bottom) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    }
    Rect.prototype.clone = function () { return new Rect(this.left, this.top, this.right, this.bottom); };
    Rect.prototype.width = function () { return this.right - this.left; };
    Rect.prototype.height = function () { return this.bottom - this.top; };
    Rect.prototype.centre = function () { return new Point((this.left + this.right) / 2, (this.bottom + this.top) / 2); };
    Rect.prototype.path = function (ctx) { ctx.rect(this.left, this.top, this.width(), this.height()); };
    ;
    Rect.prototype.fill = function (ctx) { ctx.fillRect(this.left, this.top, this.width(), this.height()); };
    ;
    Rect.prototype.stroke = function (ctx) { ctx.strokeRect(this.left, this.top, this.width(), this.height()); };
    ;
    Rect.prototype.expand = function (left, top, right, bottom) {
        this.left += left;
        this.top += top;
        this.right += right;
        this.bottom += bottom;
    };
    Rect.prototype.pointInRect = function (point) {
        return point.x >= this.left && point.y >= this.top && point.x < this.right && point.y < this.bottom;
    };
    Rect.prototype.offset = function (dx, dy) {
        this.left += dx;
        this.right += dx;
        this.top += dy;
        this.bottom += dy;
    };
    return Rect;
}());
var Xform = (function () {
    function Xform() {
        this.matrix = document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGMatrix();
    }
    Xform.prototype.transformPoint = function (point) {
        var svgPoint = document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGPoint();
        svgPoint.x = point.x;
        svgPoint.y = point.y;
        svgPoint = svgPoint.matrixTransform(this.matrix);
        return new Point(svgPoint.x, svgPoint.y);
    };
    Xform.prototype.apply = function (ctx) {
        var m = this.matrix;
        ctx.transform(m.a, m.b, m.c, m.d, m.e, m.f);
    };
    return Xform;
}());
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
        var columns = [];
        for (var i = 0; i < rows.length; ++i)
            for (var j = 0; j < rows[i].length; ++j) {
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
    var Animation = (function () {
        function Animation(duration) {
            this.duration = duration;
            this.startTime = 0;
            this.progress = 0;
            this.onStart = null;
        }
        Animation.prototype.start = function () {
            this.startTime = new Date().getTime();
            if (this.onStart)
                this.onStart();
        };
        Animation.prototype.update = function () {
            var now = new Date().getTime();
            this.progress = (now - this.startTime) / this.duration;
            if (this.progress >= 1) {
                this.progress = 1;
                return false;
            }
            return true;
        };
        Animation.prototype.draw = function (ctx, xform) { };
        return Animation;
    }());
    View.Animation = Animation;
    var Sequence = (function () {
        function Sequence() {
            this.items = [];
        }
        Sequence.prototype.start = function () {
            if (this.items.length) {
                this.items[0].start();
                return true;
            }
            return false;
        };
        Sequence.prototype.update = function () {
            if (this.items.length) {
                if (this.items[0].update())
                    return true;
                this.items.shift(); // Finished.
            }
            return this.start();
        };
        Sequence.prototype.draw = function (ctx, xform) {
            if (this.items.length) {
                ctx.save();
                this.items[0].draw(ctx, xform ? xform : new Xform());
            }
        };
        return Sequence;
    }());
    View.Sequence = Sequence;
})(View || (View = {}));
"use strict";
var View;
(function (View) {
    var Page = (function () {
        function Page(title) {
            this.title = title;
            Util.assert(Page.Current == null);
            Page.Current = this;
            this.div = document.createElement('div');
        }
        Page.hideCurrent = function () {
            if (Page.Current && Page.Current.onClose()) {
                Page.Current = null;
                var elem = document.getElementById('page');
                elem.className = '';
                elem.innerHTML = '';
            }
        };
        Page.prototype.show = function () {
            var elem = document.getElementById('page');
            elem.innerHTML = '';
            if (this.title) {
                var title = document.createElement('p');
                title.innerText = this.title;
                elem.appendChild(title);
            }
            var backButton = document.createElement('button');
            backButton.id = 'back_button';
            backButton.innerText = 'Back';
            backButton.addEventListener('click', Page.hideCurrent);
            elem.appendChild(backButton);
            elem.appendChild(this.div);
            elem.className = 'show';
            this.onShow();
        };
        Page.prototype.onShow = function () { };
        Page.prototype.onClose = function () { return true; };
        return Page;
    }());
    Page.Current = null;
    View.Page = Page;
    var ListPage = (function (_super) {
        __extends(ListPage, _super);
        function ListPage(title) {
            var _this = _super.call(this, title) || this;
            _this.tableFactory = new View.Table.Factory();
            _this.div.appendChild(_this.tableFactory.element);
            return _this;
        }
        ListPage.prototype.addItem = function (title, description, image, locked, handler) {
            var cells = [new View.Table.TextCell('<h4>' + title + '</h4>', 20), new View.Table.ImageCell(image, 20), new View.Table.TextCell(description)];
            this.tableFactory.addRow(cells, locked, function () {
                Page.hideCurrent();
                handler();
            });
        };
        return ListPage;
    }(Page));
    View.ListPage = ListPage;
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
    var GrowAnimation = (function (_super) {
        __extends(GrowAnimation, _super);
        function GrowAnimation(name, point) {
            var _this = _super.call(this, 300) || this;
            _this.name = name;
            _this.point = point;
            return _this;
        }
        GrowAnimation.prototype.draw = function (ctx, xform) {
            var scale = Util.querp(0, 1, this.progress);
            var point = xform.transformPoint(this.point);
            ctx.translate(point.x, point.y);
            ctx.scale(scale, scale);
            drawAttack(this.name, ctx);
        };
        return GrowAnimation;
    }(View.Animation));
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
    var DamageAnimation = (function (_super) {
        __extends(DamageAnimation, _super);
        function DamageAnimation(name, point) {
            var _this = _super.call(this, 1000) || this;
            _this.name = name;
            _this.point = point;
            return _this;
        }
        DamageAnimation.prototype.draw = function (ctx, xform) {
            var offset = Util.querp(0, 100, this.progress);
            var point = xform.transformPoint(this.point);
            ctx.translate(point.x, point.y - offset);
            ctx.globalAlpha = 1 - this.progress * this.progress;
            drawAttack(this.name, ctx);
            ctx.globalAlpha = 1;
        };
        return DamageAnimation;
    }(View.Animation));
    var PauseAnimation = (function (_super) {
        __extends(PauseAnimation, _super);
        function PauseAnimation(name, point, duration) {
            var _this = _super.call(this, duration) || this;
            _this.name = name;
            _this.point = point;
            return _this;
        }
        PauseAnimation.prototype.draw = function (ctx, xform) {
            var point = xform.transformPoint(this.point);
            ctx.translate(point.x, point.y);
            drawAttack(this.name, ctx);
        };
        return PauseAnimation;
    }(View.Animation));
    var MoveAnimation = (function (_super) {
        __extends(MoveAnimation, _super);
        function MoveAnimation(name, pointA, pointB) {
            var _this = _super.call(this, 500) || this;
            _this.name = name;
            _this.pointA = pointA;
            _this.pointB = pointB;
            return _this;
        }
        MoveAnimation.prototype.draw = function (ctx, xform) {
            var pointA = xform.transformPoint(this.pointA);
            var pointB = xform.transformPoint(this.pointB);
            var x = Util.querp(pointA.x, pointB.x, this.progress);
            var y = Util.querp(pointA.y, pointB.y, this.progress);
            ctx.translate(x, y);
            ctx.rotate(2 * Math.PI * this.progress * 2 * (pointA.x > pointB.x ? -1 : 1));
            drawAttack(this.name, ctx);
        };
        return MoveAnimation;
    }(View.Animation));
    var ArenaPage = (function (_super) {
        __extends(ArenaPage, _super);
        function ArenaPage() {
            var _this = _super.call(this, 'Arena') || this;
            _this.backgroundImage = new View.CanvasImage();
            _this.imageA = new View.CanvasImage();
            _this.imageB = new View.CanvasImage();
            _this.sequence = null;
            _this.timer = 0;
            _this.healths = [];
            _this.onStartButton = function () {
                if (Model.state.fight) {
                    Model.state.endFight();
                    _this.updateStartButton();
                    _this.sequence = null;
                    _this.draw();
                    return;
                }
                var teams = [];
                var fighterIDs = Model.state.getFighterIDs();
                teams.push([fighterIDs[_this.selectA.selectedIndex]]);
                teams.push([fighterIDs[_this.selectB.selectedIndex]]);
                Model.state.startFight(teams[0], teams[1]);
                _this.selectA.disabled = _this.selectB.disabled = true;
                _this.updateStartButton();
                _this.doAttack();
            };
            _this.onTick = function () {
                if (_this.sequence) {
                    if (_this.sequence.update()) {
                        _this.draw();
                    }
                    else {
                        _this.sequence = null;
                        if (Model.state.fight)
                            _this.doAttack();
                        else
                            window.clearInterval(_this.timer);
                    }
                }
            };
            _this.onFightersChanged = function () {
                _this.updateStartButton();
                _this.updateHealths();
                _this.updateImages();
            };
            var topDiv = document.createElement('div');
            topDiv.id = 'arena_top_div';
            _this.selectA = document.createElement('select');
            _this.selectB = document.createElement('select');
            _this.selectA.addEventListener('change', _this.onFightersChanged);
            _this.selectB.addEventListener('change', _this.onFightersChanged);
            var makeOption = function (id) {
                var option = document.createElement('option');
                option.text = Model.state.fighters[id].name;
                if (Model.state.fighters[id].isDead())
                    option.text += ' (x_x)';
                return option;
            };
            for (var id in Model.state.fighters) {
                _this.selectB.options.add(makeOption(id));
                _this.selectA.options.add(makeOption(id));
            }
            if (_this.selectB.options.length > 1)
                _this.selectB.selectedIndex = 1;
            _this.button = document.createElement('button');
            _this.button.addEventListener('click', _this.onStartButton);
            topDiv.appendChild(_this.selectA);
            topDiv.appendChild(_this.selectB);
            topDiv.appendChild(_this.button);
            _this.para = document.createElement('p');
            _this.para.style.margin = '0';
            _this.scroller = document.createElement('div');
            _this.scroller.id = 'arena_scroller';
            _this.scroller.className = 'scroller';
            _this.scroller.appendChild(_this.para);
            var canvas = document.createElement('canvas');
            canvas.id = 'arena_canvas';
            _this.canvas = new View.Canvas(canvas);
            _this.div.appendChild(topDiv);
            _this.div.appendChild(canvas);
            _this.div.appendChild(_this.scroller);
            _this.backgroundImage.loadImage(Data.Misc.ArenaBackgroundImage, function () { _this.draw(); });
            _this.update();
            _this.updateStartButton();
            _this.updateHealths();
            _this.updateImages();
            return _this;
        }
        ArenaPage.prototype.onShow = function () {
            this.canvas.element.width = View.Width;
            this.canvas.element.height = View.Width * this.canvas.element.clientHeight / this.canvas.element.clientWidth;
            if (Model.state.fight) {
                var fighterIDs = Model.state.getFighterIDs();
                this.selectA.selectedIndex = fighterIDs.indexOf(Model.state.fight.teams[0][0]);
                this.selectB.selectedIndex = fighterIDs.indexOf(Model.state.fight.teams[1][0]);
                this.doAttack();
            }
            this.draw();
        };
        ArenaPage.prototype.onClose = function () {
            return Model.state.fight == null;
        };
        ArenaPage.prototype.doAttack = function () {
            var _this = this;
            Util.assert(!!Model.state.fight);
            if (!this.timer)
                this.timer = window.setInterval(this.onTick, 40);
            var attackerIndex = Model.state.fight.nextTeamIndex;
            var result = Model.state.fight.step();
            var defenderIndex = Model.state.fight.nextTeamIndex;
            this.update();
            if (Model.state.fight.finished) {
                Model.state.endFight();
                this.updateStartButton();
            }
            var fighters = this.getFighters();
            var sourcePart = fighters[attackerIndex].bodyParts[result.sourceID];
            var targetPart = fighters[defenderIndex].bodyParts[result.targetID];
            this.sequence = new View.Sequence();
            var pointA = this.getBodyPartPoint(attackerIndex, sourcePart);
            var pointB = this.getBodyPartPoint(defenderIndex, targetPart);
            this.sequence.items.push(new GrowAnimation(result.name, pointA));
            this.sequence.items.push(new PauseAnimation(result.name, pointA, 500));
            this.sequence.items.push(new MoveAnimation(result.name, pointA, pointB));
            var damageString = result.attackDamage.toString() + ' x ' + (100 - result.defense).toString() + '%';
            var damageAnim = new DamageAnimation(damageString, pointB);
            damageAnim.onStart = function () { _this.updateHealths(); };
            this.sequence.items.push(damageAnim);
            this.sequence.items.push(new View.Animation(1000));
            this.sequence.start();
        };
        ArenaPage.prototype.getFighters = function () {
            var fighterIDs = Model.state.getFighterIDs();
            var fighterA = this.selectA.selectedIndex < 0 ? null : Model.state.fighters[fighterIDs[this.selectA.selectedIndex]];
            var fighterB = this.selectB.selectedIndex < 0 ? null : Model.state.fighters[fighterIDs[this.selectB.selectedIndex]];
            return [fighterA, fighterB];
        };
        ArenaPage.prototype.updateStartButton = function () {
            if (Model.state.fight) {
                this.button.innerText = 'Stop';
                this.button.disabled = false;
                return;
            }
            this.button.innerText = 'Start';
            var fighters = this.getFighters();
            this.button.disabled = !fighters[0] || !fighters[1] || fighters[0] == fighters[1] || fighters[0].isDead() || fighters[1].isDead();
        };
        ArenaPage.prototype.update = function () {
            if (!Model.state.fight)
                return;
            var atEnd = Math.abs(this.scroller.scrollTop + this.scroller.clientHeight - this.scroller.scrollHeight) <= 10;
            this.para.innerHTML = Model.state.fight.text;
            if (atEnd)
                this.scroller.scrollTop = this.scroller.scrollHeight;
        };
        ArenaPage.prototype.updateImages = function () {
            var _this = this;
            var fighters = this.getFighters();
            if (fighters.indexOf(null) >= 0)
                return;
            this.imageA.loadImage(fighters[0].image, function () { _this.draw(); });
            this.imageB.loadImage(fighters[1].image, function () { _this.draw(); });
            this.draw();
        };
        ArenaPage.prototype.updateHealths = function () {
            var fighters = this.getFighters();
            this.healths.length = 0;
            for (var i = 0; i < 2; ++i) {
                this.healths.push([]);
                if (fighters[i])
                    for (var _i = 0, _a = fighters[i].getBodyParts(); _i < _a.length; _i++) {
                        var part = _a[_i];
                        this.healths[this.healths.length - 1].push(part.health);
                    }
            }
        };
        ArenaPage.prototype.getImageRect = function (index) {
            var image = index ? this.imageB : this.imageA;
            var rect = new Rect(0, 0, image.image.width, image.image.height);
            var x = this.canvas.element.width / 2 + (index ? 50 : -50 - rect.width());
            var y = this.canvas.element.height - rect.height();
            rect.offset(x, y);
            return rect;
        };
        ArenaPage.prototype.getBodyPartPoint = function (fighterIndex, part) {
            var fighter = this.getFighters()[fighterIndex];
            var rect = this.getImageRect(fighterIndex);
            var data = part.getInstanceData(fighter.getSpeciesData());
            return new Point(fighterIndex ? rect.right - data.x : rect.left + data.x, rect.top + data.y);
        };
        ArenaPage.prototype.drawHealthBar = function (ctx, centre, current, max) {
            var scale = 5, height = 8;
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#802020';
            ctx.fillStyle = '#f08080';
            var innerRect = new Rect(centre.x - scale * max / 2, centre.y - height / 2, centre.x + scale * max / 2, centre.y + height / 2);
            var outerRect = innerRect.clone();
            outerRect.expand(1, 1, 1, 1);
            innerRect.right = innerRect.left + innerRect.width() * current / max;
            innerRect.fill(ctx);
            outerRect.stroke(ctx);
        };
        ArenaPage.prototype.drawHealthBars = function (ctx, sceneXform, fighterIndex) {
            var fighter = this.getFighters()[fighterIndex];
            var parts = fighter.getBodyParts();
            for (var i = 0; i < parts.length; ++i) {
                var part = parts[i];
                var data = part.getData(fighter.getSpeciesData());
                var point = this.getBodyPartPoint(fighterIndex, part);
                this.drawHealthBar(ctx, sceneXform.transformPoint(point), this.healths[fighterIndex][i], data.health);
            }
        };
        ArenaPage.prototype.draw = function () {
            if (!this.backgroundImage.image.complete)
                return;
            var ctx = this.canvas.element.getContext("2d");
            var width = this.canvas.element.width;
            var height = this.canvas.element.height;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, width, height);
            var gotImages = this.imageA.isComplete() && this.imageB.isComplete();
            var rectA, rectB;
            var sceneXform = new Xform();
            if (gotImages) {
                rectA = this.getImageRect(0);
                rectB = this.getImageRect(1);
                // Scale to fit.
                var scaleX = Math.max(rectA.width(), rectB.width()) / 1485; // Giant crab.
                var scaleY = Math.max(rectA.height(), rectB.height()) / 848; // Giant crab.
                var scale = Math.max(Math.max(scaleX, scaleY), 0.4);
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
            var fighters = this.getFighters();
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
        };
        return ArenaPage;
    }(View.Page));
    View.ArenaPage = ArenaPage;
})(View || (View = {}));
/// <reference path="page.ts" />
"use strict";
var View;
(function (View) {
    var BarracksPage = (function (_super) {
        __extends(BarracksPage, _super);
        function BarracksPage() {
            var _this = _super.call(this, 'Barracks') || this;
            var tableFactory = new View.Table.Factory();
            _this.div.appendChild(tableFactory.element);
            tableFactory.addColumnHeader('Name', 20);
            tableFactory.addColumnHeader('Image', 30);
            tableFactory.addColumnHeader('Part', 10);
            tableFactory.addColumnHeader('Health', 10);
            tableFactory.addColumnHeader('Armour', 10);
            tableFactory.addColumnHeader('Weapon', 10);
            tableFactory.addColumnHeader('Activity', 10);
            var activityItems = [];
            for (var id in Data.Activities.Types)
                activityItems.push(new View.Table.SelectCellItem(id, Data.Activities.Types[id].name));
            var _loop_4 = function (person) {
                var cells = [new View.Table.TextCell('<h4>' + person.name + '</h4>'), new View.Table.ImageCell(person.image)];
                for (var _i = 0, _a = Util.formatRows(person.getStatus()); _i < _a.length; _i++) {
                    var c = _a[_i];
                    cells.push(new View.Table.TextCell('<small>' + c + '</small>'));
                }
                var cell = new View.Table.SelectCell(100, activityItems, function (value) { person.setActivity(value); });
                cell.selectedTag = person.getActivity();
                cells.push(cell);
                tableFactory.addRow(cells, false, null);
            };
            for (var _i = 0, _a = Model.state.getPeople(); _i < _a.length; _i++) {
                var person = _a[_i];
                _loop_4(person);
            }
            return _this;
        }
        return BarracksPage;
    }(View.Page));
    View.BarracksPage = BarracksPage;
})(View || (View = {}));
"use strict";
var View;
(function (View) {
    var CanvasObject = (function () {
        function CanvasObject() {
        }
        CanvasObject.prototype.draw = function (ctx) { };
        CanvasObject.prototype.getRect = function () { return null; };
        CanvasObject.prototype.onClick = function () { };
        CanvasObject.prototype.isEnabled = function () { return true; };
        return CanvasObject;
    }());
    View.CanvasObject = CanvasObject;
    var CanvasImage = (function (_super) {
        __extends(CanvasImage, _super);
        function CanvasImage() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.pos = new Point(0, 0);
            return _this;
        }
        CanvasImage.prototype.loadImage = function (path, onLoad) {
            this.image = new Image();
            this.image.onload = function () { onLoad(); };
            this.image.src = path;
        };
        CanvasImage.prototype.draw = function (ctx) {
            ctx.drawImage(this.image, this.pos.x, this.pos.y);
        };
        CanvasImage.prototype.getRect = function () {
            return new Rect(this.pos.x, this.pos.y, this.pos.x + this.image.width, this.pos.y + this.image.height);
        };
        CanvasImage.prototype.isComplete = function () {
            return this.image && this.image.complete;
        };
        return CanvasImage;
    }(CanvasObject));
    View.CanvasImage = CanvasImage;
    var Canvas = (function () {
        function Canvas(element) {
            this.element = element;
        }
        Canvas.prototype.devToLog = function (x, y) {
            var scale = this.element.clientWidth / this.element.width;
            return new Point(x / scale, y / scale);
        };
        Canvas.prototype.draw = function () {
            Util.assert(false);
        };
        return Canvas;
    }());
    View.Canvas = Canvas;
})(View || (View = {}));
/// <reference path="page.ts" />
"use strict";
var View;
(function (View) {
    var DebugPage = (function (_super) {
        __extends(DebugPage, _super);
        function DebugPage() {
            var _this = _super.call(this, 'Debug') || this;
            _this.onBuyAllAnimals = function () {
                for (var tag in Data.Animals.Types) {
                    Model.state.addMoney(Data.Animals.Types[tag].cost);
                    Model.state.buyAnimal(tag);
                }
                View.Page.hideCurrent();
            };
            _this.onBuyAllPeople = function () {
                for (var tag in Data.People.Types) {
                    Model.state.addMoney(Data.People.Types[tag].cost);
                    Model.state.buyPerson(tag);
                }
                View.Page.hideCurrent();
            };
            _this.onBuyAllBuildings = function () {
                for (var tag in Data.Buildings.Levels) {
                    if (Model.state.buildings.canUpgrade(tag)) {
                        var level = Data.Buildings.getLevel(tag, Model.state.buildings.getNextUpgradeIndex(tag));
                        if (level.cost)
                            Model.state.addMoney(level.cost);
                        Model.state.buildings.buyUpgrade(tag);
                    }
                }
                View.Page.hideCurrent();
            };
            _this.onHeal = function () {
                for (var id in Model.state.fighters)
                    Model.state.fighters[id].resetHealth();
                View.Page.hideCurrent();
            };
            _this.addButton('Buy all animals', _this.onBuyAllAnimals);
            _this.addButton('Buy all people', _this.onBuyAllPeople);
            _this.addButton('Buy all buildings', _this.onBuyAllBuildings);
            _this.addButton('Heal fighters', _this.onHeal);
            return _this;
        }
        DebugPage.prototype.addButton = function (caption, handler) {
            var button = document.createElement('button');
            button.innerText = caption;
            button.addEventListener('click', handler);
            this.div.appendChild(button);
            this.div.appendChild(document.createElement('br'));
        };
        return DebugPage;
    }(View.Page));
    View.DebugPage = DebugPage;
})(View || (View = {}));
/// <reference path="page.ts" />
"use strict";
var View;
(function (View) {
    var KennelsPage = (function (_super) {
        __extends(KennelsPage, _super);
        function KennelsPage() {
            var _this = _super.call(this, 'Kennels') || this;
            var tableFactory = new View.Table.Factory();
            _this.div.appendChild(tableFactory.element);
            tableFactory.addColumnHeader('Name', 20);
            tableFactory.addColumnHeader('Image', 30);
            tableFactory.addColumnHeader('Part', 10);
            tableFactory.addColumnHeader('Health', 10);
            tableFactory.addColumnHeader('Armour', 15);
            tableFactory.addColumnHeader('Weapon', 15);
            for (var _i = 0, _a = Model.state.getAnimals(); _i < _a.length; _i++) {
                var animal = _a[_i];
                var cells = [new View.Table.TextCell('<h4>' + animal.name + '</h4>'), new View.Table.ImageCell(animal.image)];
                for (var _b = 0, _c = Util.formatRows(animal.getStatus()); _b < _c.length; _b++) {
                    var c = _c[_b];
                    cells.push(new View.Table.TextCell('<small>' + c + '</small>'));
                }
                tableFactory.addRow(cells, false, null);
            }
            return _this;
        }
        return KennelsPage;
    }(View.Page));
    View.KennelsPage = KennelsPage;
})(View || (View = {}));
"use strict";
var View;
(function (View) {
    var Trigger = (function (_super) {
        __extends(Trigger, _super);
        function Trigger(id, handler) {
            var _this = _super.call(this) || this;
            _this.id = id;
            _this.handler = handler;
            return _this;
        }
        Trigger.prototype.onClick = function () {
            if (this.isEnabled())
                this.handler(this.id);
        };
        return Trigger;
    }(View.CanvasImage));
    View.Trigger = Trigger;
    var Building = (function (_super) {
        __extends(Building, _super);
        function Building(id, handler) {
            var _this = _super.call(this, id, handler) || this;
            _this.handler = handler;
            _this.levelIndex = -1;
            _this.progress = -1;
            return _this;
        }
        Building.prototype.isEnabled = function () {
            return Model.state.buildings.getCurrentLevelIndex(this.id) >= 0;
        };
        Building.prototype.update = function () {
            var _this = this;
            var changed = false;
            var index = Model.state.buildings.getCurrentLevelIndex(this.id);
            if (index < 0 && !this.image) {
                var level_1 = Data.Buildings.getLevel(this.id, 0);
                this.loadImage(Data.Misc.ConstructionImage, function () { _this.onload(); });
                this.pos = new Point(level_1.mapX, level_1.mapY);
                changed = true;
            }
            else if (this.levelIndex != index) {
                this.levelIndex = index;
                var level = Data.Buildings.getLevel(this.id, index);
                this.loadImage(level.mapImage, function () { _this.onload(); });
                this.pos = new Point(level.mapX, level.mapY);
                changed = true;
            }
            var oldProgress = this.progress;
            if (Model.state.buildings.isConstructing(this.id))
                this.progress = Model.state.buildings.getConstructionProgress(this.id);
            else
                this.progress = -1;
            if (this.progress != oldProgress)
                changed = true;
            return changed;
        };
        Building.prototype.onload = function () {
            View.ludus.draw();
        };
        Building.prototype.draw = function (ctx) {
            if (this.progress >= 0) {
                var rect = this.getRect();
                rect.left = rect.right + 3;
                rect.right += 10;
                rect.top += 3;
                var rect2 = Object.create(rect);
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
            _super.prototype.draw.call(this, ctx);
        };
        return Building;
    }(Trigger));
    View.Building = Building;
    var Ludus = (function (_super) {
        __extends(Ludus, _super);
        function Ludus() {
            var _this = _super.call(this, document.getElementById('canvas_ludus')) || this;
            _this.Objects = [];
            _this.Buildings = {};
            _this.BackgroundImage = new View.CanvasImage();
            _this.BackgroundImage.loadImage(Data.Misc.LudusBackgroundImage, function () { _this.draw(); });
            _this.element.width = View.Width;
            _this.element.height = View.Height;
            _this.initObjects();
            return _this;
        }
        Ludus.prototype.draw = function () {
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
        };
        Ludus.prototype.initObjects = function () {
            var _this = this;
            this.Objects.length = 0;
            this.Buildings = {};
            var town = Data.Misc.TownTrigger;
            var trigger = new View.Trigger('town', Controller.onTownTriggerClicked);
            trigger.loadImage(town.mapImage, function () { _this.draw(); });
            trigger.pos = new Point(town.mapX, town.mapY);
            this.Objects.push(trigger);
            this.updateObjects();
            this.draw();
        };
        Ludus.prototype.updateObjects = function () {
            var redraw = false;
            for (var id in Data.Buildings.Levels) {
                if (Model.state.buildings.getCurrentLevelIndex(id) >= 0 || Model.state.buildings.isConstructing(id)) {
                    var building = this.Buildings[id];
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
        };
        return Ludus;
    }(View.Canvas));
    View.Ludus = Ludus;
})(View || (View = {}));
"use strict";
var View;
(function (View) {
    var Table;
    (function (Table) {
        var Cell = (function () {
            function Cell(width) {
                this.width = width;
            } // %
            Cell.prototype.getElement = function () {
                var e = document.createElement('td');
                if (this.width)
                    e.style.width = this.width.toString() + '%';
                return e;
            };
            return Cell;
        }());
        Table.Cell = Cell;
        var TextCell = (function (_super) {
            __extends(TextCell, _super);
            function TextCell(content, width) {
                var _this = _super.call(this, width) || this;
                _this.content = content;
                return _this;
            }
            TextCell.prototype.getElement = function () {
                var e = _super.prototype.getElement.call(this);
                e.innerHTML = this.content;
                return e;
            };
            return TextCell;
        }(Cell));
        Table.TextCell = TextCell;
        var ImageCell = (function (_super) {
            __extends(ImageCell, _super);
            function ImageCell(src, width) {
                var _this = _super.call(this, width) || this;
                _this.src = src;
                return _this;
            }
            ImageCell.prototype.getElement = function () {
                var e = _super.prototype.getElement.call(this);
                e.style.position = 'relative';
                var child = document.createElement('img');
                child.className = "centre";
                child.style.height = '90%';
                child.src = this.src;
                e.appendChild(child);
                return e;
            };
            return ImageCell;
        }(Cell));
        Table.ImageCell = ImageCell;
        var SelectCellItem = (function () {
            function SelectCellItem(tag, name) {
                this.tag = tag;
                this.name = name;
            }
            return SelectCellItem;
        }());
        Table.SelectCellItem = SelectCellItem;
        var SelectCell = (function (_super) {
            __extends(SelectCell, _super);
            function SelectCell(width, items, handler) {
                var _this = _super.call(this, width) || this;
                _this.items = items;
                _this.handler = handler;
                return _this;
            }
            SelectCell.prototype.getElement = function () {
                var _this = this;
                var e = _super.prototype.getElement.call(this);
                var select = document.createElement('select');
                for (var i = 0, item = void 0; item = this.items[i]; ++i) {
                    var optionElement = document.createElement('option');
                    optionElement.value = item.tag;
                    optionElement.innerText = item.name;
                    select.appendChild(optionElement);
                }
                select.value = this.selectedTag;
                select.addEventListener('change', function () { _this.handler(select.value); });
                e.appendChild(select);
                return e;
            };
            return SelectCell;
        }(Cell));
        Table.SelectCell = SelectCell;
        var Factory = (function () {
            function Factory() {
                this.element = document.createElement('div');
                this.table = document.createElement('table');
                this.element.appendChild(this.table);
                this.element.className = 'scroller';
            }
            Factory.prototype.addColumnHeader = function (name, width) {
                if (!this.headerRow) {
                    this.headerRow = this.table.insertRow(0);
                    this.headerRow.className = 'disabled';
                }
                var th = document.createElement('th');
                this.headerRow.appendChild(th);
                th.innerText = name;
                if (width)
                    th.style.width = width.toString() + '%';
            };
            Factory.prototype.addRow = function (cells, locked, handler) {
                var row = document.createElement('tr');
                row.className = 'table_row';
                this.table.appendChild(row);
                for (var _i = 0, cells_1 = cells; _i < cells_1.length; _i++) {
                    var cell = cells_1[_i];
                    row.appendChild(cell.getElement());
                }
                row.addEventListener('click', handler);
                if (locked)
                    row.style.opacity = '0.5';
                if (!locked && handler)
                    row.className += ' highlight';
            };
            return Factory;
        }());
        Table.Factory = Factory;
    })(Table = View.Table || (View.Table = {}));
})(View || (View = {}));
"use strict";
var View;
(function (View) {
    View.Width = 1280;
    View.Height = 720;
    var speeds = [0, 1, 10, 60];
    function init() {
        View.ludus = new View.Ludus();
        View.updateLayout();
        document.getElementById('reset_btn').addEventListener('click', Controller.onResetClicked);
        document.getElementById('debug_btn').addEventListener('click', Controller.onDebugClicked);
        var _loop_5 = function (i) {
            document.getElementById('speed_label_' + i).innerText = 'x' + speeds[i];
            var button = document.getElementById('speed_btn_' + i);
            button.addEventListener('click', function () { Controller.setSpeed(speeds[i]); });
        };
        for (var i = 0; i < speeds.length; ++i) {
            _loop_5(i);
        }
        updateSpeedButtons();
    }
    View.init = init;
    function showInfo(title, description) {
        var page = new View.Page(title);
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
        var width = document.documentElement.clientWidth;
        var height = document.documentElement.clientHeight;
        var offset = new Point(0, 0);
        var scale = 1;
        var sx = width / View.Width;
        var sy = height / View.Height;
        var imageAspect = View.Width / View.Height;
        if (sx < sy) {
            var devHeight = width / imageAspect;
            offset = new Point(0, (height - devHeight) / 2);
            scale = sx;
        }
        else {
            var devWidth = height * imageAspect;
            offset = new Point((width - devWidth) / 2, 0);
            scale = sy;
        }
        var div = document.getElementById('master_div');
        div.style.top = offset.y.toString() + 'px';
        div.style.bottom = offset.y.toString() + 'px';
        div.style.left = offset.x.toString() + 'px';
        div.style.right = offset.x.toString() + 'px';
        div.style.fontSize = (scale * 20).toString() + 'px';
        View.ludus.draw();
    }
    View.updateLayout = updateLayout;
    function updateSpeedButtons() {
        for (var i = 0; i < speeds.length; ++i) {
            var button = document.getElementById('speed_btn_' + i);
            button.checked = Model.state.speed == speeds[i];
        }
    }
    View.updateSpeedButtons = updateSpeedButtons;
})(View || (View = {}));
