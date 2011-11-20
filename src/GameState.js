define(["Wall", "Bullet"],
function(Wall, Bullet) {
    var prototype = Object.create({},
    {
        walls: {
            value: [],
            writable: true
        },
        bullets: {
            value: [],
            writable: true
        },
        idseq: {
            value: 1,
            writeable: true
        }
    });

    prototype.simulate = function(dt) {
        var player = this.player;
        var direction = this.aimVector();

        var speed = 75;
        if (this.player.movement.forward) {
            this.player.position.x += direction.x * speed * dt / 1000;
            this.player.position.y += direction.y * speed * dt / 1000;
        }

        if (this.player.movement.left) {
            this.player.position.x += -direction.y * speed * dt / 1000;
            this.player.position.y += direction.x * speed * dt / 1000;
        }

        if (this.player.movement.right) {
            this.player.position.x += direction.y * speed * dt / 1000;
            this.player.position.y += -direction.x * speed * dt / 1000;
        }

        this.walls.forEach(function(wall) {
            wall.update(dt);
        },
        this);

        this.walls.forEach(function(wall) {
            var vec = wall.distanceTo(this.player.position);
            var dst = Math.sqrt(vec.x * vec.x + vec.y * vec.y);

            if (dst < 5) {
                player.position.x += (5 - dst) * vec.x / dst;
                player.position.y += (5 - dst) * vec.y / dst;
            }
        },this);
        
        this.bullets.forEach(function(bullet, index) {
            bullet.update(dt);
            
            this.walls.forEach(function(wall) {
                var vec = wall.distanceTo(bullet.position);
                var dst = Math.sqrt(vec.x * vec.x + vec.y * vec.y);

                if (dst < 3) {
                    delete this.bullets[index];
                    this.onDestroyBullet(bullet);
                    wall.dead = true;
                }
            },this);
        }, this);

        if (this.distanceToGoal() < 50) {
            this.onGoalReached(new Date().getTime() - this.started);
        }
    }

    prototype.aimVector = function() {
        var direction = {
            x: this.player.aim.x - this.player.position.x,
            y: this.player.aim.y - this.player.position.y
        };

        var len = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
        direction.x = direction.x / len;
        direction.y = direction.y / len;

        return direction;
    }

    prototype.distanceToGoal = function() {
        var vec = {
            x: this.goal.x - this.player.position.x,
            y: this.goal.y - this.player.position.y
        };
        return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
    }

    prototype.moveForwardStart = function() {
        this.player.movement.forward = true;
    }

    prototype.moveForwardStop = function() {
        this.player.movement.forward = false;
    }

    prototype.moveLeftStart = function() {
        this.player.movement.left = true;
    }

    prototype.moveLeftStop = function() {
        this.player.movement.left = false;
    }

    prototype.moveRightStart = function() {
        this.player.movement.right = true;
    }

    prototype.moveRightStop = function() {
        this.player.movement.right = false;
    }

    prototype.shootBullet = function() {
        var bullet = Bullet.create(this.player.position, this.aimVector());
        bullet.id = this.idseq++;
        this.bullets.push(bullet);
        this.onCreateBullet(bullet);
    }

    prototype.setup = function(maze) {
        this.started = new Date().getTime();
        var self = this;
        maze.forEach(function(wallCfg) {
            setTimeout(function () {
                self._addWall(Wall.create(wallCfg));
            }, wallCfg.offset);
        },
        this);
    }

    prototype._addWall = function(wall) {
        wall.id = this.idseq++;
        wall.created = new Date().getTime();
        wall.onSpawnChild = $.proxy(this._addWall, this);
        this.walls.push(wall);
        this.onCreateWall(wall);
    }

    return {
        create: function() {
            var obj = Object.create(prototype);

            obj.player = {
                aim: {
                    x: 0,
                    y: 0
                },
                position: {
                    x: 10,
                    y: 10
                },
                movement: {
                    left: false,
                    right: false,
                    forward: false
                }
            };

            obj.goal = {
                x: 960,
                y: 640
            };

            return obj;
        }
    }
})