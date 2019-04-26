var Game = {};

Game.init = function(){
    game.stage.disableVisibilityChange = true;
};

Game.preload = function() {
            this.load.image('player', 'assets/star.png');
            this.load.image('bomb', 'assets/bomb.png');
            this.load.image('wallS', 'assets/wall.png');
            this.load.image('tmap', 'assets/placehold_tilemap.png');
            this.load.tilemapTiledJSON('map1', 'assets/map1.json');
            this.load.image('wallW', 'assets/wallDestroy.png');
            this.load.spritesheet('explosion', 'assets/explosion.png', {frameWidth:64, frameHeight:64});
}

        var players = [0,1,2,3];
        var clientID = 2;

        var keyW;
        var keyA;
        var keyS;
        var keyD;
        var keyBomb;
        var speed = 300;

        var bombs;
        var bombCooldown;
        var bombExplosion;
        var canPlaceBomb = true;
        var explosions;
        var dead = false;
        var direction = 0;
        var wallsStrong;
        var wallsWeak;

Game.create = function(){       
    var map = this.make.tilemap({ key: "map1" });
            var tiles = map.addTilesetImage("placehold_tilemap", "tmap");
            wallsStrong = map.createStaticLayer("wallsStrong", tiles);
            map.setCollision([1, 2]);
            wallsWeak = map.createDynamicLayer("wallsWeak", tiles);
            map.setCollision([1, 2]);

            bombs = this.physics.add.group();
            explosions = this.physics.add.group();


            this.anims.create({
                key: 'explode',
                frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 24 }),
                frameRate: 20,
                repeat: 0
            });

             for (var i = 0; i < players.length; i++) {
            players[i] = this.physics.add.sprite(0, 0, 'player');
            players[i].body.setGravity(0, 0);
            players[i].setBounce(0.1);
            players[i].setCollideWorldBounds(true);

            this.physics.add.collider(bombs,players[i]);
            this.physics.add.overlap(explosions,players[i],function(){killPlayer(players[i]);});
            this.physics.add.collider(wallsStrong,players[i]);
            this.physics.add.collider(wallsWeak,players[i]);
             }
             players[0].x = 0; players[0].y = 0;
             players[1].x = 1216; players[1].y = 0;
             players[2].x = 64; players[2].y = 640;
             players[3].x = 1152; players[3].y = 640;

            this.physics.add.overlap(explosions, wallsWeak, destroyWall, null, this);
            this.physics.add.collider(bombs, wallsStrong);
            this.physics.add.collider(bombs, wallsWeak);

            keyW = this.input.keyboard.addKey("W");
            keyA = this.input.keyboard.addKey("A");
            keyS = this.input.keyboard.addKey("S");
            keyD = this.input.keyboard.addKey("D");
            keyBomb = this.input.keyboard.addKey("SPACE");

            keyW.onDown.add(Game.movePlayer,this);
            keyA.onDown.add(Game.movePlayer,this);
            keyS.onDown.add(Game.movePlayer,this);
            keyD.onDown.add(Game.movePlayer,this);
            keyBomb.onDown.add(Game.movePlayer,this);


} 
Game.update = function(){  

 if (!dead) {
                players[clientID].setVelocityX(0);
                players[clientID].setVelocityY(0);
                if (keyW.isDown) {
                    players[clientID].setVelocityY(-speed);
                    direction = 1;
                    Game.movePlayer();

                }
                else if (keyS.isDown) {
                    players[clientID].setVelocityY(speed);
                    direction = 3;
                    Game.movePlayer();
                }
                if (keyA.isDown) {
                    players[clientID].setVelocityX(-speed);
                    direction = 2;
                    Game.movePlayer();

                }
                else if (keyD.isDown) {
                    players[clientID].setVelocityX(speed);
                    direction = 0;
                    Game.movePlayer();
                }
                if (keyBomb.isDown && canPlaceBomb) {
                    var bombx = players[clientID].x;
                    var bomby = players[clientID].y;


                    var bomb = bombs.create(bombx, bomby, 'bomb').setOrigin(0.5, 0.5);
                    bomb.setCollideWorldBounds(true);
                    bomb.body.setGravityX(0);
                    bomb.body.setGravityY(0);
                    canPlaceBomb = false;
                    bombCooldown = this.time.delayedCall(2000, allowPlacing, [], this);
                    bombExplosion = this.time.delayedCall(2000, explodeBomb, [bomb], this);


                }
  
            }              
}

 function allowPlacing() {
            canPlaceBomb = true;
        }

        
        function killPlayer(p)
        {
            dead = true;
        }


        function movePlayer(s)
        {
            Client.updateCoords(clientID,players[clientID].x,players[clientID].y);
        }

Game.changeClientId = function(id){
clientID = id;
}