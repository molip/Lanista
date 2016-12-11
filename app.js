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
        function hitTestObjects(x, y) {
            for (var _i = 0, _a = View.Canvas.Objects; _i < _a.length; _i++) {
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
            var devPos = Util.getEventPos(e, View.getCanvas());
            var logPos = View.Canvas.devToLog(devPos.x, devPos.y);
            var obj = hitTestObjects(logPos.x, logPos.y);
            if (obj != Canvas.HotObject) {
                Canvas.HotObject = obj;
                View.Canvas.draw();
            }
        }
        Canvas.onMouseMove = onMouseMove;
        function onMouseOut() {
            if (Canvas.HotObject) {
                Canvas.HotObject = null;
                View.Canvas.draw();
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
        View.Canvas.initObjects();
        updateHUD();
        window.setInterval(Controller.onTick, 100);
        if (Model.state.fight)
            onArenaTriggerClicked();
    }
    Controller.onLoad = onLoad;
    function onTick() {
        if (Model.state.update(0.1)) {
            View.Canvas.updateObjects();
            updateHUD();
        }
        if (View.Popup.Current != null)
            View.Popup.Current.onTick();
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
            View.Canvas.initObjects();
        }
    }
    Controller.onResetClicked = onResetClicked;
    function onHomeTriggerClicked() {
        View.showInfo('Home', 'TODO: general stats etc. go here.');
    }
    function onBarracksTriggerClicked() {
        var popup = new View.BarracksPopup();
        popup.show();
    }
    function onKennelsTriggerClicked() {
        var popup = new View.KennelsPopup();
        popup.show();
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
        var popup = new View.ArenaPopup();
        popup.show();
    }
    function onTownTriggerClicked() {
        Controller.Shop.showShopsPopup();
    }
    Controller.onTownTriggerClicked = onTownTriggerClicked;
    function updateHUD() {
        var text = 'Money: ' + Util.formatMoney(Model.state.getMoney());
        View.setHUDText(text);
    }
    Controller.updateHUD = updateHUD;
})(Controller || (Controller = {}));
"use strict";
var Controller;
(function (Controller) {
    var Shop;
    (function (Shop) {
        function addItem(popup, title, description, image, locked, price, handler) {
            popup.addItem(title, description + '<br>' + Util.formatMoney(price), image, locked || price > Model.state.getMoney(), handler);
        }
        function getShopTitle(name) {
            return name + ' (money available: ' + Util.formatMoney(Model.state.getMoney()) + ')';
        }
        function showShopsPopup() {
            var popup = new View.ListPopup('Let\'s go shopping!');
            popup.addItem('Builders\' Merchant', 'Buy building kits', 'images/builders.jpg', false, onBuildersMerchantClicked);
            popup.addItem('Animal Market', 'Buy animals', 'images/animals.jpg', false, onAnimalMarketClicked);
            popup.addItem('People Market', 'Buy people', 'images/people.png', false, onPeopleMarketClicked);
            popup.addItem('Armourer', 'Buy armour', 'images/armourer.jpg', true, null);
            popup.show();
        }
        Shop.showShopsPopup = showShopsPopup;
        function onBuildersMerchantClicked() {
            var popup = new View.ListPopup(getShopTitle('Builders\' Merchant'));
            var _loop_1 = function(id) {
                level = Data.Buildings.getLevel(id, Model.state.buildings.getNextUpgradeIndex(id));
                if (level) {
                    handler = function () {
                        Model.state.buildings.buyUpgrade(id);
                        Controller.updateHUD();
                        View.Canvas.updateObjects();
                    };
                    addItem(popup, level.name, level.description, level.shopImage, !Model.state.buildings.canUpgrade(id), level.cost, handler);
                    popup.show();
                }
            };
            var level, handler;
            for (var _i = 0, _a = ['home', 'arena', 'barracks', 'kennels', 'storage', 'weapon', 'armour', 'training', 'surgery', 'lab', 'merch']; _i < _a.length; _i++) {
                var id = _a[_i];
                _loop_1(id);
            }
        }
        function onAnimalMarketClicked() {
            var popup = new View.ListPopup(getShopTitle('Animal Market'));
            var hasKennels = Model.state.buildings.getCurrentLevelIndex('kennels') >= 0;
            var _loop_2 = function(id) {
                handler = function () {
                    Model.state.buyAnimal(id);
                    Controller.updateHUD();
                };
                var type = Data.Animals.Types[id];
                addItem(popup, type.name, type.description, type.shopImage, !hasKennels, type.cost, handler);
                popup.show();
            };
            var handler;
            for (var id in Data.Animals.Types) {
                _loop_2(id);
            }
        }
        function onPeopleMarketClicked() {
            var popup = new View.ListPopup(getShopTitle('People Market'));
            var hasBarracks = Model.state.buildings.getCurrentLevelIndex('barracks') >= 0;
            var _loop_3 = function(id) {
                handler = function () {
                    Model.state.buyPerson(id);
                    Controller.updateHUD();
                };
                var type = Data.People.Types[id];
                addItem(popup, type.name, type.description, type.shopImage, !hasBarracks, type.cost, handler);
                popup.show();
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
    var BodyPart = (function () {
        function BodyPart(health, names, attack, weaponSite) {
            this.health = health;
            this.names = names;
            this.attack = attack;
            this.weaponSite = weaponSite;
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
            _super.call(this, tag, bodyPartIDs);
        }
        return Weapon;
    }(Accessory));
    Model.Weapon = Weapon;
    var Armour = (function (_super) {
        __extends(Armour, _super);
        function Armour(tag, bodyPartIDs) {
            _super.call(this, tag, bodyPartIDs);
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
        BodyPart.prototype.getName = function (speciesData) {
            return this.getData(speciesData).names[this.index];
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
            var data = this.getSpeciesData();
            for (var tag in data.bodyParts) {
                var part = data.bodyParts[tag];
                for (var i = 0, partName = ''; partName = part.names[i]; ++i) {
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
        // Gets available body parts compatible with specified site. 
        Fighter.prototype.getEmptySites = function (accType, site) {
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
        Fighter.prototype.getEmptySitesForAccessory = function (accType, accTag) {
            var data = accType == AccessoryType.Weapon ? Data.Weapons.Types[accTag] : Data.Armour.Types[accTag];
            for (var _i = 0, _a = data.sites; _i < _a.length; _i++) {
                var site = _a[_i];
                var bodyPartIDs = this.getEmptySites(accType, site);
                if (bodyPartIDs)
                    return bodyPartIDs;
            }
            return null;
        };
        Fighter.prototype.canAddWeapon = function (weaponTag) {
            return !!this.getEmptySitesForAccessory(AccessoryType.Weapon, weaponTag);
        };
        Fighter.prototype.canAddArmour = function (armourTag) {
            return !!this.getEmptySitesForAccessory(AccessoryType.Armour, armourTag);
        };
        Fighter.prototype.addWeapon = function (weaponTag) {
            // TODO: Choose site.
            var bodyPartIDs = this.getEmptySitesForAccessory(AccessoryType.Weapon, weaponTag);
            if (bodyPartIDs) {
                this.weapons.push(new Model.Weapon(weaponTag, bodyPartIDs));
                return;
            }
            Util.assert(false);
        };
        Fighter.prototype.addArmour = function (armourTag) {
            // TODO: Choose site.
            var bodyPartIDs = this.getEmptySitesForAccessory(AccessoryType.Armour, armourTag);
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
                row.push(part.getName(speciesData));
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
                    attacks.push(data.attack); // TODO: Check body part health.
            }
            for (var _i = 0, _a = this.weapons; _i < _a.length; _i++) {
                var weapon = _a[_i];
                var data = Data.Weapons.Types[weapon.tag];
                attacks = attacks.concat(data.attacks); // TODO: Check body part health.
            }
            return attacks;
        };
        Fighter.prototype.getBodyParts = function () {
            var parts = [];
            for (var id in this.bodyParts)
                parts.push(this.bodyParts[id]); // TODO: Check body part health ? 
            return parts;
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
        function Animal(id, tag) {
            var type = Data.Animals.Types[tag];
            _super.call(this, id, type.species, type.name, type.shopImage, type.weapons, type.armour);
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
            State.prototype.update = function (seconds) {
                var changed = false;
                for (var id in this.types)
                    if (this.continueConstruction(id, seconds))
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
            State.prototype.continueConstruction = function (id, seconds) {
                Util.assert(id in this.types);
                if (!this.isConstructing(id))
                    return false;
                var level = this.getNextLevel(id);
                Util.assert(level != null);
                if (this.types[id].progress + seconds >= level.buildTime) {
                    this.types[id].progress = -1;
                    ++this.types[id].levelIndex;
                }
                else
                    this.types[id].progress += seconds;
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
                this.text += this.attack(attacker, defender) + '<br>';
                if (++this.steps == 25) {
                    this.text += 'Finished';
                    this.finished = true;
                }
                return this.finished;
            };
            State.prototype.attack = function (attacker, defender) {
                var attacks = attacker.getAttacks();
                var attackData = attacks[Util.getRandomInt(attacks.length)];
                var defenderSpeciesData = defender.getSpeciesData();
                var targets = defender.getBodyParts();
                var target = targets[Util.getRandomInt(targets.length)];
                var targetData = target.getData(defenderSpeciesData);
                var armour = defender.getBodyPartArmour(target.id);
                var armourData = armour ? Data.Armour.Types[armour.tag] : null;
                var defense = armourData ? armourData.getDefense(attackData.type) : 0;
                var damage = attackData.damage * (100 - defense) / 100;
                var oldHealth = targetData.health;
                targetData.health = Math.max(0, targetData.health - damage);
                var msg = attacker.name + ' uses ' + attackData.name + ' on ' + defender.name + ' ' + targetData.names[target.index] + '. ';
                msg += 'Damage = ' + attackData.damage + ' x ' + (100 - defense) + '% = ' + damage.toFixed(1) + '. ';
                msg += 'Health ' + oldHealth.toFixed(1) + ' -> ' + targetData.health.toFixed(1) + '. ';
                return msg;
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
        }
        State.prototype.update = function (seconds) {
            var changed = this.buildings.update(seconds);
            Model.saveState();
            return changed;
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
        State.prototype.buyAnimal = function (typeID) {
            Util.assert(typeID in Data.Animals.Types);
            this.spendMoney(Data.Animals.Types[typeID].cost);
            this.fighters[this.nextFighterID] = new Model.Animal(this.nextFighterID, typeID);
            ++this.nextFighterID;
            Model.saveState();
        };
        State.prototype.buyPerson = function (typeID) {
            Util.assert(typeID in Data.People.Types);
            this.spendMoney(Data.People.Types[typeID].cost);
            this.fighters[this.nextFighterID] = new Model.Person(this.nextFighterID, typeID);
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
        State.prototype.startFight = function (teamA, teamB) {
            Util.assert(this.fight == null);
            this.fight = new Model.Fight.State(teamA, teamB);
        };
        State.prototype.endFight = function () {
            Util.assert(this.fight && this.fight.finished);
            this.fight = null;
        };
        State.key = "state.v6";
        return State;
    }());
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
        function Person(id, tag) {
            var type = Data.People.Types[tag];
            _super.call(this, id, 'human', type.name, type.shopImage, type.weapons, type.armour);
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
    return Point;
}());
var Rect = (function () {
    function Rect(left, top, right, bottom) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    }
    Rect.prototype.width = function () { return this.right - this.left; };
    Rect.prototype.height = function () { return this.bottom - this.top; };
    Rect.prototype.path = function (ctx) { ctx.rect(this.left, this.top, this.width(), this.height()); };
    ;
    Rect.prototype.pointInRect = function (point) {
        return point.x >= this.left && point.y >= this.top && point.x < this.right && point.y < this.bottom;
    };
    return Rect;
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
})(Util || (Util = {}));
"use strict";
var View;
(function (View) {
    var Popup = (function () {
        function Popup(title) {
            this.title = title;
            Util.assert(Popup.Current == null);
            Popup.Current = this;
            this.div = document.createElement('div');
        }
        Popup.hideCurrent = function () {
            if (Popup.Current && Popup.Current.onClose()) {
                Popup.Current = null;
                var elem = document.getElementById('popup');
                elem.className = '';
                elem.innerHTML = '';
                document.getElementById('blanket').className = '';
                document.getElementById('overlay_div').className = 'disabled';
            }
        };
        Popup.prototype.show = function () {
            var elem = document.getElementById('popup');
            elem.innerHTML = '';
            if (this.title) {
                var title = document.createElement('p');
                title.innerText = this.title;
                elem.appendChild(title);
            }
            elem.appendChild(this.div);
            elem.className = 'show';
            document.getElementById('blanket').className = 'show';
            document.getElementById('overlay_div').className = '';
        };
        Popup.prototype.onClose = function () { return true; };
        Popup.prototype.onTick = function () { };
        Popup.Current = null;
        return Popup;
    }());
    View.Popup = Popup;
    var ListPopup = (function (_super) {
        __extends(ListPopup, _super);
        function ListPopup(title) {
            _super.call(this, title);
            this.tableFactory = new View.Table.Factory();
            this.div.appendChild(this.tableFactory.element);
        }
        ListPopup.prototype.addItem = function (title, description, image, locked, handler) {
            var cells = [new View.Table.TextCell('<h4>' + title + '</h4>', 20), new View.Table.ImageCell(image, 20), new View.Table.TextCell(description)];
            this.tableFactory.addRow(cells, locked, function () {
                Popup.hideCurrent();
                handler();
            });
        };
        return ListPopup;
    }(Popup));
    View.ListPopup = ListPopup;
})(View || (View = {}));
/// <reference path="popup.ts" />
"use strict";
var View;
(function (View) {
    var ArenaPopup = (function (_super) {
        __extends(ArenaPopup, _super);
        function ArenaPopup() {
            _super.call(this, 'Arena');
            this.ticks = 0;
            this.para = document.createElement('p');
            this.para.style.margin = '0';
            this.scroller = document.createElement('div');
            this.scroller.className = 'scroller';
            this.scroller.style.bottom = '5%';
            this.scroller.appendChild(this.para);
            this.button = document.createElement('button');
            this.button.innerText = 'Start';
            this.button.style.top = '95%';
            this.button.style.bottom = '0';
            this.button.style.position = 'absolute';
            this.button.addEventListener('click', this.onStartButton);
            this.div.appendChild(this.scroller);
            this.div.appendChild(this.button);
            this.update();
        }
        ArenaPopup.prototype.onClose = function () {
            return Model.state.fight == null;
        };
        ArenaPopup.prototype.onStartButton = function () {
            var teams = [];
            for (var id in Model.state.fighters) {
                var team = [];
                team.push(id);
                teams.push(team);
                if (teams.length == 2)
                    break;
            }
            if (teams.length == 2)
                Model.state.startFight(teams[0], teams[1]);
        };
        ArenaPopup.prototype.onTick = function () {
            ++this.ticks;
            if (this.ticks % 1 == 0) {
                if (Model.state.fight) {
                    var finished = Model.state.fight.step();
                    this.update();
                    if (finished)
                        Model.state.endFight();
                }
            }
        };
        ArenaPopup.prototype.update = function () {
            if (!Model.state.fight)
                return;
            var atEnd = Math.abs(this.scroller.scrollTop + this.scroller.clientHeight - this.scroller.scrollHeight) <= 10;
            this.para.innerHTML = Model.state.fight.text;
            if (atEnd)
                this.scroller.scrollTop = this.scroller.scrollHeight;
        };
        return ArenaPopup;
    }(View.Popup));
    View.ArenaPopup = ArenaPopup;
})(View || (View = {}));
/// <reference path="popup.ts" />
"use strict";
var View;
(function (View) {
    var BarracksPopup = (function (_super) {
        __extends(BarracksPopup, _super);
        function BarracksPopup() {
            _super.call(this, 'Barracks');
            var tableFactory = new View.Table.Factory();
            this.div.appendChild(tableFactory.element);
            tableFactory.addColumnHeader('Name', 20);
            tableFactory.addColumnHeader('Image', 30);
            tableFactory.addColumnHeader('Part', 10);
            tableFactory.addColumnHeader('Health', 10);
            tableFactory.addColumnHeader('Armour', 15);
            tableFactory.addColumnHeader('Weapon', 15);
            for (var _i = 0, _a = Model.state.getPeople(); _i < _a.length; _i++) {
                var person = _a[_i];
                var cells = [new View.Table.TextCell('<h4>' + person.name + '</h4>'), new View.Table.ImageCell(person.image)];
                for (var _b = 0, _c = Util.formatRows(person.getStatus()); _b < _c.length; _b++) {
                    var c = _c[_b];
                    cells.push(new View.Table.TextCell('<small>' + c + '</small>'));
                }
                tableFactory.addRow(cells, false, null);
            }
        }
        return BarracksPopup;
    }(View.Popup));
    View.BarracksPopup = BarracksPopup;
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
            _super.call(this);
            this.pos = new Point(0, 0);
        }
        CanvasImage.prototype.loadImage = function (path) {
            this.image = new Image();
            this.image.onload = function () { View.Canvas.draw.call(View.Canvas); };
            this.image.src = path;
        };
        CanvasImage.prototype.draw = function (ctx) {
            ctx.drawImage(this.image, this.pos.x, this.pos.y);
        };
        CanvasImage.prototype.getRect = function () {
            return new Rect(this.pos.x, this.pos.y, this.pos.x + this.image.width, this.pos.y + this.image.height);
        };
        return CanvasImage;
    }(CanvasObject));
    View.CanvasImage = CanvasImage;
    var Trigger = (function (_super) {
        __extends(Trigger, _super);
        function Trigger(id, handler) {
            _super.call(this);
            this.id = id;
            this.handler = handler;
        }
        Trigger.prototype.onClick = function () {
            if (this.isEnabled())
                this.handler(this.id);
        };
        return Trigger;
    }(CanvasImage));
    View.Trigger = Trigger;
    var Building = (function (_super) {
        __extends(Building, _super);
        function Building(id, handler) {
            _super.call(this, id, handler);
            this.handler = handler;
            this.levelIndex = -1;
            this.progress = -1;
        }
        Building.prototype.isEnabled = function () {
            return Model.state.buildings.getCurrentLevelIndex(this.id) >= 0;
        };
        Building.prototype.update = function () {
            var changed = false;
            var index = Model.state.buildings.getCurrentLevelIndex(this.id);
            if (index < 0 && !this.image) {
                var level_1 = Data.Buildings.getLevel(this.id, 0);
                this.loadImage(Data.Misc.ConstructionImage);
                this.pos = new Point(level_1.mapX, level_1.mapY);
                changed = true;
            }
            else if (this.levelIndex != index) {
                this.levelIndex = index;
                var level = Data.Buildings.getLevel(this.id, index);
                this.loadImage(level.mapImage);
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
    var Canvas = (function () {
        function Canvas() {
        }
        Canvas.init = function () {
            Canvas.BackgroundImage = new CanvasImage();
            Canvas.BackgroundImage.loadImage(Data.Misc.LudusBackgroundImage);
        };
        Canvas.onResize = function () {
            this.updateTransform();
            this.draw();
        };
        Canvas.devToLog = function (x, y) {
            return new Point((x - this.Offset.x) / this.Scale, (y - this.Offset.y) / this.Scale);
        };
        Canvas.updateTransform = function () {
            var canvas = View.getCanvas();
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            if (!this.BackgroundImage.image.complete) {
                this.Offset = new Point(0, 0);
                this.Scale = 1;
            }
            var sx = canvas.width / this.BackgroundImage.image.width;
            var sy = canvas.height / this.BackgroundImage.image.height;
            var imageAspect = this.BackgroundImage.image.width / this.BackgroundImage.image.height;
            if (sx < sy) {
                var devHeight = canvas.width / imageAspect;
                this.Offset = new Point(0, (canvas.height - devHeight) / 2);
                this.Scale = sx;
            }
            else {
                var devWidth = canvas.height * imageAspect;
                this.Offset = new Point((canvas.width - devWidth) / 2, 0);
                this.Scale = sy;
            }
            var overlay = document.getElementById('canvas_overlay_div');
            overlay.style.top = this.Offset.y.toString() + 'px';
            overlay.style.bottom = this.Offset.y.toString() + 'px';
            overlay.style.left = this.Offset.x.toString() + 'px';
            overlay.style.right = this.Offset.x.toString() + 'px';
            overlay.style.fontSize = (this.Scale * 20).toString() + 'px';
        };
        Canvas.draw = function () {
            if (!this.BackgroundImage.image.complete)
                return;
            if (!this.hasDrawn) {
                this.hasDrawn = true;
                this.updateTransform();
            }
            var canvas = View.getCanvas();
            var ctx = canvas.getContext("2d");
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.translate(this.Offset.x, this.Offset.y);
            ctx.scale(this.Scale, this.Scale);
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
        Canvas.initObjects = function () {
            this.Objects.length = 0;
            this.Buildings = {};
            var town = Data.Misc.TownTrigger;
            var trigger = new View.Trigger('town', Controller.onTownTriggerClicked);
            trigger.loadImage(town.mapImage);
            trigger.pos = new Point(town.mapX, town.mapY);
            this.Objects.push(trigger);
            this.updateObjects();
            this.draw();
        };
        Canvas.updateObjects = function () {
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
        Canvas.Objects = [];
        Canvas.Buildings = {};
        Canvas.Scale = 1;
        Canvas.Offset = new Point(0, 0);
        return Canvas;
    }());
    View.Canvas = Canvas;
})(View || (View = {}));
/// <reference path="popup.ts" />
"use strict";
var View;
(function (View) {
    var KennelsPopup = (function (_super) {
        __extends(KennelsPopup, _super);
        function KennelsPopup() {
            _super.call(this, 'Kennels');
            var tableFactory = new View.Table.Factory();
            this.div.appendChild(tableFactory.element);
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
        }
        return KennelsPopup;
    }(View.Popup));
    View.KennelsPopup = KennelsPopup;
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
                _super.call(this, width);
                this.content = content;
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
                _super.call(this, width);
                this.src = src;
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
                this.table.appendChild(row);
                for (var _i = 0, cells_1 = cells; _i < cells_1.length; _i++) {
                    var cell = cells_1[_i];
                    row.appendChild(cell.getElement());
                }
                row.addEventListener('click', handler);
                if (locked)
                    row.style.opacity = '0.5';
                if (locked || !handler)
                    row.className = 'disabled';
            };
            return Factory;
        }());
        Table.Factory = Factory;
    })(Table = View.Table || (View.Table = {}));
})(View || (View = {}));
"use strict";
var View;
(function (View) {
    function init() {
        View.Canvas.init();
        document.getElementById("overlay_div").addEventListener('click', View.Popup.hideCurrent);
    }
    View.init = init;
    function getCanvas() {
        return document.getElementById("canvas_ludus");
    }
    View.getCanvas = getCanvas;
    function showInfo(title, description) {
        var popup = new View.Popup(title);
        popup.div.innerHTML = '<p>' + description + '</p>';
        popup.show();
    }
    View.showInfo = showInfo;
    function setHUDText(text) {
        document.getElementById('hud_span').innerText = text;
    }
    View.setHUDText = setHUDText;
})(View || (View = {}));
