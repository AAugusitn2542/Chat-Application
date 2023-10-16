const chatForm = document.getElementById('chat-form'); // get the element from the chat.html
const chatMessages = document.querySelector('.chat-messages'); // using queryselector to get the pass aruguement8
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true   // we want to extract only the parameters
});


const socket = io(); // catch this on the client side

//Join chatrrom
socket.emit('joinRoom', { username, room });


// Get room and users
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
});


socket.on('message', message => {
    console.log(message);
    outputMessage(message); // message from server

    //Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});



// message submit
chatForm.addEventListener('submit', e => {
    e.preventDefault();
       
        // Get Message Text 
    const msg = e.target.elements.msg.value; 
     
    
    // Emit a message to the Server
    socket.emit('chatMessage', msg);  
   
  
    e.target.elements.msg.value = '';
   
   
   // Clear input
   e.target.elements.msg.focus(); 
});


// output message to DOM
function outputMessage (message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}




//Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}




//Add users to DOM
function outputUsers(users){

    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;

}