define([], function () {
   
   var prototype = Object.create({}, {});
   
   prototype.update = function (dt) {
       var speed = 200;
       var step = speed * dt / 1000;
       this.position.x += this.direction.x * step;
       this.position.y += this.direction.y * step;
   }
   
   prototype.constructor = function (position, direction) {
       console.log(direction);
       var obj = Object.create(prototype);       
       obj.position = { x: position.x, y: position.y };
       obj.direction = { x: direction.x, y: direction.y };
       return obj;
   }
   
   return {
       create: prototype.constructor
   };
});