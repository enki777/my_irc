const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const salleName = document.getElementById('room-name');
const userList = document.getElementById('users');


//obtenir pseudo et salle depuis l url
const{pseudo, salle } = Qs.parse(location.search, {
    //permet de ne pas prendre les caracteres speciaux
    ignoreQueryPrefix: true
});

const socket = io();

//rejoindre salle de chat
socket.emit('joinSalle', {pseudo, salle});

//obtenir salle et utilisateurs
socket.on('salleUsers', ({ salle, utilisateurs }) => {
    outputSalleName(salle);
    outputUtilisateursName(utilisateurs);
    
});

//message du serveur
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //defiler au dernier message
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// socket.on('messageDeco', message => {
//     console.log(message);
//     outputMessage(message);

//     //defiler au dernier message
//     chatMessages.scrollTop = chatMessages.scrollHeight;
// });

//envois message sur la room
chatForm.addEventListener('submit',(e) =>{
    e.preventDefault();

    //valeur de l input
    const msg = e.target.elements.msg.value;
    
    //envois du msg au serveur
    socket.emit('chatMessage', msg);

    //supprime le contenu de l input
    e.target.elements.msg.value = '';
    //permet a l utilisateur de rester sur l input pour reecrire directement
    e.target.elements.msg.focus();
});

//affiche le message dans la div
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML= `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">${message.text}</p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

// ajoute nom de salle a la sidebar
function outputSalleName(salle){
    salleName.innerText = salle;
}

//ajoute utilisateurs a la sidebar
function outputUtilisateursName(users){
    //on transforme le tableau de users en string contenant chacune un li contenant chaque nom
    userList.innerHTML = `
        ${users.map(user => `<li>${user.pseudo}</li>`).join('')}
    `;
}