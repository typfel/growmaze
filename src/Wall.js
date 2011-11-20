define([], function () {
    
    var prototype = Object.create({}, {});
    
    prototype.update = function(dt) {
        
        if (this.dead) {
            return;
        }
        
        var age =  new Date().getTime() - this.created;
        var step = this.speed * dt / 1000.0;
        
        //console.log(step);
        
        switch(this.direction) {
            case 'south':
            this.end.y += step;
            break;
            case 'north':
            this.end.y -= step;
            break;
            case 'west':
            this.end.x -= step;
            break;
            case 'east':
            this.end.x += step;
        }
        
        this.children.forEach(function (child) {
            if (!child.created && age > child.offset) {
                console.log('spawn');
                this.onSpawnChild(child);
            }
        }, this);
    }
    
    prototype.distanceTo = function (point) {
        var a = this.end.x - this.start.x;
        var b = this.end.y - this.start.y;
        var u = ((point.x - this.start.x) * a + (point.y - this.start.y) * b) / (a * a + b * b);
        
        if (u > 1) {
            u = 1;
        }
        
        if (u < 0) {
            u = 0;
        }
        
        var x = this.start.x + u * a;
        var y = this.start.y + u * b;
                
        return { x: point.x - x, y: point.y - y };
    }
    
    prototype.constructor =  function (cfg) {
        var obj = Object.create(prototype);
        
        obj.offset    = cfg.offset;
        obj.direction = cfg.direction;
        obj.start     = { x: cfg.start.x, y: cfg.start.y };
        obj.end       = { x: cfg.start.x, y: cfg.start.y };
        obj.children  = [];
        
        
        if (cfg.speed) {
            obj.speed = cfg.speed;
        } else {
            obj.speed = 110;
        }
        
        if (cfg.children) {
            cfg.children.forEach(function (childCfg) {
                obj.children.push(prototype.constructor(childCfg));
            });
        }
        
        return obj;
    }
    
    return {
        create: prototype.constructor
    }
    
});