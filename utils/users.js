const users = [];

// join user to chat 

function userJoin(id, username, room) {
    const user = { id, username, room };

    users.push(user);
    
    return user;
}
    // Get current user
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}
//user leave chat

function userLeave(id) {
    const index = users.findIndex(user => user.id === id); // so if it find the user it return -1 

    if(index !== -1) {
        return users.splice(index, 1)[0]; // return the user array of that user 
    }
}

// Get room users
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
} 

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};