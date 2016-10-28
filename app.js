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
        Model.init();
        View.init();
        View.Canvas.initObjects();
        updateHUD();
        window.setInterval(Controller.onTick, 100);
    }
    Controller.onLoad = onLoad;
    function onTick() {
        if (Model.state.update(0.1)) {
            View.Canvas.updateObjects();
            updateHUD();
        }
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
        View.showInfo('Barracks', 'TODO.');
    }
    function onKennelsTriggerClicked() {
        View.showInfo('Kennels', 'TODO.');
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
    var Popup;
    (function (Popup) {
        var Item = (function () {
            function Item(title, description, image, locked, handler) {
                this.title = title;
                this.description = description;
                this.image = image;
                this.locked = locked;
                this.handler = handler;
            }
            return Item;
        }());
        Popup.Item = Item;
        function show(title, items, action) {
            Popup.items = items;
            Popup.action = action;
            View.showPopup(title);
        }
        Popup.show = show;
        function onItemClicked(index) {
            View.hidePopup();
            var oldAction = Popup.action, oldItem = Popup.items[index];
            Popup.items = Popup.action = null;
            oldAction(oldItem);
        }
        Popup.onItemClicked = onItemClicked;
        function onBackgroundClicked() {
            View.hidePopup();
            Popup.items = Popup.action = null;
        }
        Popup.onBackgroundClicked = onBackgroundClicked;
    })(Popup = Controller.Popup || (Controller.Popup = {}));
})(Controller || (Controller = {}));
"use strict";
var Controller;
(function (Controller) {
    var Shop;
    (function (Shop) {
        var Item = (function (_super) {
            __extends(Item, _super);
            function Item(title, description, image, locked, price, handler, data) {
                _super.call(this, title, title + '<br>' + Util.formatMoney(price), image, locked, handler);
                this.price = price;
                this.handler = handler;
                this.data = data;
            }
            return Item;
        }(Controller.Popup.Item));
        function getShopTitle(name) {
            return name + ' (money available: ' + Util.formatMoney(Model.state.getMoney()) + ')';
        }
        function showShopsPopup() {
            var items = [];
            items.push(new Controller.Popup.Item('Builders\' Merchant', 'Buy building kits', 'images/builders.jpg', false, onBuildersMerchantClicked));
            items.push(new Controller.Popup.Item('Animal Market', 'Buy animals', 'images/animals.jpg', true));
            items.push(new Controller.Popup.Item('People Market', 'Buy people', 'images/people.png', true));
            items.push(new Controller.Popup.Item('Armourer', 'Buy armour', 'images/armourer.jpg', true));
            Controller.Popup.show('Let\'s go shopping!', items, function (item) { item.handler(); });
        }
        Shop.showShopsPopup = showShopsPopup;
        function onBuildersMerchantClicked() {
            var items = [];
            for (var i = 0, id; id = ['home', 'barracks', 'kennels', 'storage', 'weapon', 'armour', 'training', 'surgery', 'lab', 'merch'][i]; ++i) {
                var level = Data.Buildings.getLevel(id, Model.state.buildings.getNextUpgradeIndex(id));
                if (level) {
                    var item = new Item(level.name, level.description, level.shopImage, !Model.state.buildings.canUpgrade(id), level.cost, null, { id: id });
                    items.push(item);
                }
            }
            Controller.Popup.show(getShopTitle('Builders\' Merchant'), items, function (item) {
                Model.state.buildings.buyUpgrade(item.data.id);
                Controller.updateHUD();
                View.Canvas.updateObjects();
            });
        }
    })(Shop = Controller.Shop || (Controller.Shop = {}));
})(Controller || (Controller = {}));
"use strict";
var Data;
(function (Data) {
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
    var Misc;
    (function (Misc) {
    })(Misc = Data.Misc || (Data.Misc = {}));
})(Data || (Data = {}));
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
                return level && Model.state.money >= level.cost && !this.isConstructing(id);
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
    var State = (function () {
        function State() {
            this.money = 1000;
            this.buildings = new Model.Buildings.State();
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
        State.key = "state.v1";
        return State;
    }());
    Model.State = State;
    function init() {
        var str = localStorage.getItem(State.key);
        if (str) {
            Model.state = JSON.parse(str);
            Model.state.__proto__ = State.prototype;
            Model.state.buildings.__proto__ = Model.Buildings.State.prototype;
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
})(Util || (Util = {}));
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
            var hud = document.getElementById('hud_div');
            hud.style.top = this.Offset.y.toString() + 'px';
            hud.style.left = this.Offset.x.toString() + 'px';
            hud.style.right = this.Offset.x.toString() + 'px';
            //hud.style.right = (window.innerWidth - this.Offset.x).toString() + 'px';
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
"use strict";
var View;
(function (View) {
    function init() {
        View.Canvas.init();
    }
    View.init = init;
    function getCanvas() {
        return document.getElementById("canvas_ludus");
    }
    View.getCanvas = getCanvas;
    function showPopup(title) {
        var template = '\
        <tr class="{{classes}}" style="opacity: {{opacity}}; " onclick="Controller.Popup.onItemClicked({{index}}); event.stopPropagation();">\
            <td style="width:20%">\
                <h4>{{title}}</h4>\
            </td>\
            <td style="position: relative; width:20%">\
                <img class="centre" style="height:90%" src="{{image}}">\
                <!--<img class="centre" style="height:50%" {{lock_hidden}} src="images/lock.png">-->\
            </td>\
            <td>\
                <p>{{description}}</p>\
            </td>\
        </tr>';
        var items = Controller.Popup.items;
        var html = '';
        if (title)
            html += '<h2 style="margin:1vmin; text-align: center">' + title + '</h2>';
        html += '<table>';
        for (var i = 0; i < items.length; ++i) {
            var itemHtml = template;
            itemHtml = itemHtml.replace('{{index}}', String(i));
            itemHtml = itemHtml.replace('{{title}}', items[i].title);
            itemHtml = itemHtml.replace('{{image}}', items[i].image);
            itemHtml = itemHtml.replace('{{description}}', items[i].description);
            itemHtml = itemHtml.replace('{{classes}}', items[i].locked ? 'disabled' : '');
            itemHtml = itemHtml.replace('{{opacity}}', items[i].locked ? '0.5' : '1');
            itemHtml = itemHtml.replace('{{lock_hidden}}', items[i].locked ? '' : 'hidden');
            html += itemHtml;
        }
        html += '</table>';
        document.getElementById('container').innerHTML = html;
        document.getElementById('container').className = 'show';
        document.getElementById('popup').className = 'show';
    }
    View.showPopup = showPopup;
    function hidePopup() {
        document.getElementById('container').className = '';
        document.getElementById('popup').className = '';
    }
    View.hidePopup = hidePopup;
    function showInfo(title, description) {
        var template = '\
        <div class="item">\
            <p>{{description}}</p>\
        </div>';
        var html = '<h2 style="margin:10px">' + title + '</h2>';
        var itemHtml = template;
        itemHtml = itemHtml.replace('{{description}}', description);
        html += itemHtml;
        document.getElementById('container').innerHTML = html;
        document.getElementById('container').className = 'show';
        document.getElementById('popup').className = 'show';
    }
    View.showInfo = showInfo;
    function setHUDText(text) {
        document.getElementById('hud_span').innerText = text;
    }
    View.setHUDText = setHUDText;
})(View || (View = {}));
