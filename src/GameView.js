define([], function () {
    
    var prototype = Object.create({}, {
        walls: {
            value: {}
        },
        bullets: {
            value: {}
        }
    });
    
    prototype.createPlayer = function (position) {
        var point = new paper.Point(position.x, position.y);
        var player = new paper.Path.Circle(point, 5);
        player.fillColor = 'red';
        this.player = player;
    }
    
    prototype.updatePlayer = function (player) {
        var point = new paper.Point(player.position.x, player.position.y);
        this.player.position = point;
    }
    
    prototype.createWall = function (data) {
        var start = new paper.Point(data.start.x, data.start.y);
        var end = new paper.Point(data.end.x, data.end.y);
        var wall = new paper.Path.Line(start, end);
        wall.strokeColor = 'white';
        this.walls[data.id] = wall;
    }
    
    prototype.updateWall = function (data) {
        var wall = this.walls[data.id];
        var point = new paper.Point(data.end.x, data.end.y);
        wall.lastSegment.point = point;
    }
    
    prototype.createBullet = function (data) {
        var point = new paper.Point(data.position.x, data.position.y);
        var bullet = new paper.Path.Circle(point, 3);
        bullet.fillColor = 'yellow';
        this.bullets[data.id] = bullet;
    }
    
    prototype.updateBullet = function (data) {
        var point = new paper.Point(data.position.x, data.position.y);
        this.bullets[data.id].position = point;
    }
    
    prototype.destroyBullet = function (data) {
        this.bullets[data.id].remove();
        delete this.bullets[data.id];
    }
    
    prototype.displayScore = function (time) {
        var text = new paper.PointText(new paper.Point(20, 40));
        text.characterStyle = {
            fontSize: 24,
            fillColor: 'white',
        };
        text.content = "Your reached the goal in " + time / 1000 + " seconds";
    }
    
    prototype.draw = function () {
        this.view.draw();
    }
    
    return {
        create: function (container) {
            $(container).append('<canvas id="game-canvas" width="960" height="640"></canvas>');
            paper.setup(document.getElementById('game-canvas'));

            obj = Object.create(prototype, {
                view: {
                    value: paper.view
                }
            });
            
            var point = new paper.Point(960, 640);
            var player = new paper.Path.Circle(point, 40);
            player.fillColor = 'white';
            
            return obj;
        }
    }
});