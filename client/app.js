const loginForm = document.getElementById('welcome-form');
const userNameInput = document.getElementById('username');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const messageContentInput = document.getElementById('message-content');
const socket = io();

let userName = '';

socket.on('message', ({ author, content }) => addMessage(author, content))

const login = (e) => {
    e.preventDefault();
    if(!userNameInput.value){
        alert("Empty input!");
        return;
    } else {
        userName = userNameInput.value;
        socket.emit('user', {user: userName, id: socket.id})
    }
    socket.emit('message', {author: 'ChatBot', content: `<i>${userName} has joined the conversation!</i>`})

    loginForm.classList.remove('show');
    messagesSection.classList.add('show');
}

const addMessage = (author, content) => {
    const message = document.createElement('li');
    message.classList.add('message', 'message--received')
    if(author == userName){
        message.classList.add('message--self');
    } 
    message.innerHTML = `
    <h3 class="message__author">${author === userName ? 'You' : author}</h3>
    <div class="message__content">${content}</div>    
    `
    messagesList.appendChild(message);
}

const sendMessage = (e) => {
    e.preventDefault();

    let messageContent = messageContentInput.value;

    if(!messageContent.length){
        alert("Type message!");
        return;
    } else {
        addMessage(userName, messageContent);
        socket.emit('message', {author: userName, content: messageContent })
        messageContentInput.value = '';
    };
};


loginForm.addEventListener('submit', login);
addMessageForm.addEventListener('submit', sendMessage);