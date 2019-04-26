var Client = {};
Client.socket = io.connect();


Client.askNewPlayer = function(){
    Client.socket.emit('newplayer');
};

Client.sendClick = function(x,y){
  Client.socket.emit('click',{x:x,y:y});
};

Client.socket.on('newplayer',function(data){
    Game.addNewPlayer(data.id,data.x,data.y);
});

Client.socket.on('allplayers',function(data){
    for(var i = 0; i < data.length; i++){
        Game.addNewPlayer(data[i].id,data[i].x,data[i].y);
        socket.emit('updateClientId',data[i].id);
    }
    
    Client.updateCoords = function(id,x,y){
    Client.socket.emit('updatecoords',{clientID:id,newX:x, newY:y});
};

    Client.socket.on('move',function(data){
        Game.movePlayer(data.id,data.x,data.y);
    });
});


