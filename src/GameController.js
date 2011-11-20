define(["GameState"], function (GameState) {
    
    var REFRESH_RATE = 10;
    
    var requestAnimFrame = (function () {
        return  window.requestAnimationFrame       ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                window.oRequestAnimationFrame      ||
                window.msRequestAnimationFrame     ||
                function(callback, element) {
                    return window.setTimeout(callback, REFRESH_RATE);
                };
    })();
    
    var cancelRequestAnimFrame = (function () {
        return  window.cancelRequestAnimationFrame       ||
                window.webkitCancelRequestAnimationFrame ||
                window.mozCancelRequestAnimationFrame    ||
                window.oCancelRequestAnimationFrame      ||
                window.msCancelRequestAnimationFrame     ||
                function(handle) {
                    window.clearTimeout(handle);
                }
    })();
    
    var prototype = Object.create({}, {
    });
    
    prototype.playLevel = function () {
        this._gameState = new GameState.create();
        this._gameState.onCreateWall = $.proxy(this.view.createWall, this.view);
        this._gameState.onCreateBullet = $.proxy(this.view.createBullet, this.view);
        this._gameState.onDestroyBullet = $.proxy(this.view.destroyBullet, this.view);
        this._gameState.onGoalReached = $.proxy(this._onGoalReached, this);
        this._gameState.setup([
        { 
            start: { x: 100, y: 0 }, 
            direction: 'south',
            offset: 0,
            children: [{ 
                start: { x: 100, y: 50 }, 
                direction: 'east', 
                offset: 500,
                children: [{
                    start: { x: 250, y: 50 }, 
                    direction: 'south', 
                    offset: 1500,
                    speed: 80
                }, {
                    start: { x: 350, y: 50 }, 
                    direction: 'south', 
                    offset: 2500,
                    speed: 80
                }, {
                    start: { x: 450, y: 50 }, 
                    direction: 'south', 
                    offset: 3000,
                    speed: 80
                }]
            }]
        },
        {
            start: { x: 0, y: 300 }, 
            direction: 'east',
            offset: 1000,
            children: [{ 
                start: { x: 200, y: 300 }, 
                direction: 'north', 
                offset: 2000 }]
        },
        {
            start: { x: 960, y: 250 },
            direction: 'west',
            offset: 2500,
            speed: 80,
            children: [{ 
                start: { x: 700, y: 250 }, 
                direction: 'south', 
                speed: 40,
                offset: 3400,
                children: [{
                    start: { x: 700, y: 350 }, 
                    direction: 'east', 
                    speed: 50,
                    offset: 2400,
                    children: [{
                        start: { x: 850, y: 350 }, 
                        direction: 'south', 
                        speed: 50,
                        offset: 3000
                    }]
                }]
            }]
        },
        {
            start: { x: 400, y: 640 },
            direction: 'north',
            offset: 1000,
            speed: 60,
            children: [
            { 
                start: { x: 400, y: 600 }, 
                direction: 'west', 
                offset: 1200 
            },{ 
                start: { x: 400, y: 530 }, 
                direction: 'east', 
                offset: 1600,
                speed: 70,
                children: [{
                    start: { x: 600, y: 530 }, 
                    direction: 'north', 
                    offset: 30000,
                    speed: 40
                }]
            }]
        }
        ]);
        this.view.createPlayer(this._gameState.player.position);
        this._lastTime = new Date().getTime();
        this._runGameLoop();
    }
    
    prototype._runGameLoop = function () {
        this._animHandle = requestAnimFrame($.proxy(this._runGameLoop, this));
        
        var currentTime = new Date().getTime();
        var dt =  currentTime - this._lastTime;
        this._lastTime = currentTime;
        
        this._gameState.simulate(dt);
        
        this._gameState.walls.forEach(function (wall) {
            this.view.updateWall(wall);
        }, this);
        
        this._gameState.bullets.forEach(function (bullet) {
           this.view.updateBullet(bullet);
        }, this);
        
        this.view.updatePlayer(this._gameState.player);
        this.view.draw();
    }
    
    prototype._onGoalReached = function (time) {
        console.log("goal reached")
        cancelRequestAnimFrame(this._animHandle);
        this.view.displayScore(time);
        this.view.draw();
    }
    
    prototype._onKeyDown = function (event) {
        if (event.key === 'a') {
            this._gameState.moveLeftStart();
        } else 
        if (event.key === 'd') {
            this._gameState.moveRightStart();
        }
        if (event.key === 'w') {
            this._gameState.moveForwardStart();
        }
    }
    
    prototype._onKeyUp = function (event) {
        if (event.key === 'a') {
            this._gameState.moveLeftStop();
        } else 
        if (event.key === 'd') {
            this._gameState.moveRightStop();
        }
        if (event.key === 'w') {
            this._gameState.moveForwardStop();
        }
    }
    
    prototype._onMouseMove = function (event) {
        this._gameState.player.aim = event.point;
    }
    
    prototype._onMouseDown = function (event) {
        this._gameState.shootBullet();
    }
    
    return {
        create: function (gameView) {
            
            var obj = Object.create(prototype, {
                view: {
                    value: gameView
                }
            });
            
            var tool = new paper.Tool();            
            tool.onKeyDown   = $.proxy(obj._onKeyDown, obj);
            tool.onKeyUp     = $.proxy(obj._onKeyUp, obj);
            tool.onMouseMove = $.proxy(obj._onMouseMove, obj);
            tool.onMouseDown = $.proxy(obj._onMouseDown, obj);
            
            
            obj.playLevel();
            return obj;
        }
    }
});