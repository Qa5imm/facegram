"use strict";

var socket = io('http://localhost:5000');
var messageContainer = document.getElementById('message-container');
var messageForm = document.getElementById('send-container');
var messageInput = document.getElementById('message-input');
console.log("insie script");
var name = prompt('What is your name?');
appendMessage('You joined');
socket.emit('new-user', name);
socket.on('chat-message', function (data) {
  appendMessage("".concat(data.name, ": ").concat(data.message));
});
socket.on('user-connected', function (name) {
  appendMessage("".concat(name, " connected"));
});
socket.on('user-disconnected', function (name) {
  appendMessage("".concat(name, " disconnected"));
});
messageForm.addEventListener('submit', function (e) {
  e.preventDefault();
  var message = messageInput.value;
  appendMessage("You: ".concat(message));
  socket.emit('send-chat-message', message);
  messageInput.value = '';
});

function appendMessage(message) {
  var messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageContainer.append(messageElement);
}