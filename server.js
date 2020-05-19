const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const formatMessage = require('./loaders/messages');
const { userJoin, getCurUser,userLeave, getSalleUsers } = require('./loaders/utilisateurs');


// DOSSIER STATIC --> public 
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'my_irc bot';

// fonctionne lorsque le client se connecte
io.on('connection', socket => {
    // console.log('New websocket connection...');
    socket.on('joinSalle', ({ pseudo, salle }) => {
        const user = userJoin(socket.id, pseudo, salle);
        socket.join(user.salle);

        //envois un msg au client qui vient de se co 
        socket.emit('message', formatMessage(botName, 'Bienvenu sur my_irc !'));

        // envois un msg a ts les clients sauf celui qui vient de se co 
        socket.broadcast.to(user.salle).emit('message', formatMessage(botName, `${user.pseudo} vient de se connecter`));

        //envois les infos utilisateurs et salle
        io.to(user.salle).emit('salleUsers', {
            salle: user.salle,
            utilisateurs: getSalleUsers(user.salle)
        });
    });


    //ecoute pour un message
    socket.on('chatMessage', (msg) => {
        const user = getCurUser(socket.id);
        
        io.to(user.salle).emit('message', formatMessage(user.pseudo, msg));
    })

    //envois un msg quand un utilisateur se deco
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if(user){
            io.to(user.salle).emit('message', formatMessage(botName, `${user.pseudo} vient de se déconnecter`));
        };

        //envois les infos utilisateurs et salle lorsque quelqu un se deco
        io.to(user.salle).emit('salleUsers', {
            salle: user.salle,
            utilisateurs: getSalleUsers(user.salle)
        });
    })
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
