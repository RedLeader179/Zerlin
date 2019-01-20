/*
Zerlin
TCSS 491 - Computational Worlds
Joshua Atherton, Michael Josten, Steven Golob
*/




window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

function GameEngine() {
    this.entities = [];
    this.ctx = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
    this.mouse = {x: 100, y: 100};
}

GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.timer = new Timer();
    this.startInput();
    console.log('game initialized');
}

GameEngine.prototype.start = function () {
    console.log("starting game");
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
}

GameEngine.prototype.loop = function () {
    this.clockTick = this.timer.tick();
    this.update();
    this.draw();
}

GameEngine.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
    this.ctx.save();
    this.ctx.translate(this.ctx.canvas.width/2, this.ctx.canvas.height/2); // Zerlin's center point for origin
    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].draw(this.ctx);
    }

    // draws axis' for debugging placement of entities
    this.ctx.beginPath();
    this.ctx.moveTo(-this.ctx.canvas.width/2 + 40, 0);
    this.ctx.lineTo(this.ctx.canvas.width/2 - 40, 0);
    this.ctx.moveTo(0, -this.ctx.canvas.height/2 + 40);
    this.ctx.lineTo(0, this.ctx.canvas.height/2 - 40);
    this.ctx.stroke();

    this.ctx.restore();
}

GameEngine.prototype.update = function () {
    var entitiesCount = this.entities.length;
    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];
        entity.update();
    }
}

GameEngine.prototype.addEntity = function (entity) {
    console.log('added entity');
    this.entities.push(entity);
}

GameEngine.prototype.startInput = function () {
    console.log('Starting input');

    var that = this;

    var getXandY = function (e) {
        var x = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
        var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;

        x -= that.ctx.canvas.width/2; // adjust to origin
        y -= that.ctx.canvas.height/2;

        // if (x < 1024) {             // what's this for?
        //     x = Math.floor(x / 32);
        //     y = Math.floor(y / 32);
        // }

        return { x: x, y: y };
    }

    // event listeners are added here

    // this.ctx.canvas.addEventListener("click", function (e) {
    //     that.click = getXandY(e);
    //     console.log("Left Click Event - X,Y " + e.clientX + ", " + e.clientY);
    // }, false);

    this.ctx.canvas.addEventListener("contextmenu", function (e) {
        // that.click = getXandY(e);
        // console.log("Right Click Event - X,Y " + e.clientX + ", " + e.clientY);
        e.preventDefault();
    }, false);

    this.ctx.canvas.addEventListener("mousemove", function (e) {
        that.mouse = getXandY(e);
    }, false);


    this.ctx.canvas.addEventListener("mousedown", function (e) {
        // console.log(e);
        if (e.button === 2) { // change back to right click
            console.log('1');
            that.rightClickDown = true;
        }
        // if (e.button === 0) {
        //     // left click down
        // }
        e.preventDefault();
    }, false);

    this.ctx.canvas.addEventListener("mouseup", function (e) {
        console.log(e);
        if (e.button === 2) { // change back to right click
            console.log('2');
            that.rightClickDown = false;
        }
        // if (e.button === 0) {
        //     // left click up
        // }
        e.preventDefault();
    }, false);


    // this.ctx.canvas.addEventListener("mousewheel", function (e) {
    //     that.wheel = e;
    //     console.log("Click Event - X,Y " + e.clientX + ", " + e.clientY + " Delta " + e.deltaY);
    // }, false);

    this.ctx.canvas.addEventListener("keydown", function (e) {
        console.log("Key Down Event - Char " + e.code + " Code " + e.keyCode);
    }, false);

    this.ctx.canvas.addEventListener("keypress", function (e) {
        if (e.code === "KeyD") that.d = true;
        else if (e.code === "KeyA") that.a = true;
        that.chars[e.code] = true;
        // console.log(e);
        console.log("Key Pressed Event - Char " + e.charCode + " Code " + e.keyCode);
    }, false);

    this.ctx.canvas.addEventListener("keyup", function (e) {
        if (e.code === "KeyD") that.d = false;
        else if (e.code === "KeyA") that.a = false;
        that.chars[e.code] = false;
        // console.log(e);
        console.log("Key Up Event - Char " + e.code + " Code " + e.keyCode);
    }, false);

    console.log('Input started');
}


function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
}

function Entity(game, x, y, deltaX, deltaY) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.removeFromWorld = false;

    // Entity's velocity
    this.deltaX = deltaX;
    this.deltaY = deltaY;
}

Entity.prototype.update = function () {

}

Entity.prototype.draw = function (ctx) {

    // draws outline for debugging
    if (this.game.showOutlines && this.radius) {
        this.game.ctx.beginPath();
        this.game.ctx.strokeStyle = "green";
        this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.game.ctx.stroke();
        this.game.ctx.closePath();
    }
}

Entity.prototype.rotateAndCache = function (image, angle) {
    var offscreenCanvas = document.createElement('canvas');
    var size = Math.max(image.width, image.height);
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    var offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.save();
    offscreenCtx.translate(size / 2, size / 2);
    offscreenCtx.rotate(angle);
    offscreenCtx.translate(0, 0);
    offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
    offscreenCtx.restore();
    //offscreenCtx.strokeStyle = "red";
    //offscreenCtx.strokeRect(0,0,size,size);
    return offscreenCanvas;
}

Entity.prototype.scaleAndCache = function (image, scale) {

}