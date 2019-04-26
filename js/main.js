var game = new Phaser.Game(1216, 640, Phaser.AUTO, document.getElementById('death'));
game.state.add('Game',Game);
game.state.start('Game');