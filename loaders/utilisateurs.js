const users = [];

//utilisateur rejoint chat
function userJoin(id, pseudo, salle){
    const user = { id, pseudo, salle };

    users.push(user);

    return user;
}

//obtenir l utilisateur courant 
function getCurUser(id){
    return users.find(user => user.id === id);
}

//utilisateur se deco de la salle
function userLeave(id){
    const index = users.findIndex(user => user.id === id);

    // si la methode findIndex ne trouve rien elle renvoit -1 d ou la condition
    if(index !== -1){
        return users.splice(index, 1)[0];
    }
}

//obtenir les utilisateurs de la salle
function getSalleUsers(salle){
    return users.filter(user => user.salle === salle);
}

module.exports = {
    userJoin,
    getCurUser,
    userLeave,
    getSalleUsers
};