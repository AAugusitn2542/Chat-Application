// backend entry point is server.js
const path = require('path');

const http = require('http');

const express = require("express");

const socketio = require('socket.io'); // using socket.io

const formatMessage = require('./utils/messages'); // go thorugh this path

const {userJoin, 
       getCurrentUser, 
       userLeave,
       getRoomUsers} = require('./utils/users'); 

// stopped at 51:08... 
// cant send messages due to line 48 in this file
const app = express();

const server = http.createServer(app);

const io = socketio(server);


// Set static folder
app.use(express.static(path.join(__dirname, 'public'))); // cureent directioryu 

const botName = "Skooiboi Minion";
// run when a client connects
io.on('connection', socket => {
    console.log("We are connected like connect 4");
    
    socket.on('joinRoom', ({username, room}) => {
        const user = userJoin(socket.id, username, room);    
    



        socket.join(user.room);
        


        //Welcome current user
        socket.emit('message', formatMessage(botName, 'Welcome To The Skooiboi App')); 
    



    // Broadcast when the user connects
    socket.broadcast
    .to(user.room)
    .emit(
        'message',
        formatMessage(botName, `${user.username}  joined the chat`)
        ); 


        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });




    }); 




        // listen for chatMessage
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        // gives the name for user when chatting
        io.to(user.room).emit('message', formatMessage(user.username, msg));  
    });






        //Runs when a client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if(user){
            io.to(user.name)
            .emit(
                'message', 
                formatMessage(botName, `${user.username} has left the chat`)
            ); // emit the message to the whole chat is notified and io.to(user.name) to attach a user name to it

            io.to(user.room).emit('roomUsers', {
                room:user.room,
                users: getRoomUsers(user.room)
            });
    

        }


   
});
});



const PORT = 3000 || process.env.PORT; // look to see if we have aenorivermont variable called port



server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  // Summary within the funtion
    //emit to everyone excpet the user that is connecting | socket.broadcast.emit();
    //broadcast to everone we do | io.emit
    // to broadcast only to the client | socket.emit()