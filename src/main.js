require({
    urlArgs: "bust=" + (new Date()).getTime()
},
["jquery", "GameView", "GameController", "../lib/paper"],
function ($, GameView, GameController) {
    
    $(function () {
        $('.maze-game').each(function (index, element) {
            paper = new paper.PaperScope();
            
            var gameView   = GameView.create(element);
            var controller = GameController.create(gameView);
        });
    });
});