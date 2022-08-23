"use strict";

var socket = io();
var message_container_el = document.getElementById("message-container");
var send_container_el = document.getElementById("send-container");
var message_input_el = document.getElementById("message-input");
var send_button_el = document.getElementById("send-button");
var recipient_id_el = document.getElementById("recipient_id");
var my_id_el = document.getElementById("my_id");
var msg_data_el = document.getElementById("msg_data");
var chat_outgoing_el = document.getElementById("chat_outgoing");
var chat_incoming_el = document.getElementById("chat_incoming");
var details_outgoing_el = document.getElementById("details-outgoing");
var details_incoming_el = document.getElementById("details-incoming");
var wrapper_el = document.getElementById("wrapper");
var img_src_el = document.getElementById("img_src");
var src = img_src_el.src;
var final_src = src.replace("http://localhost:3000", "..");

function appendMessage(msg, direction) {
  var chat_el = document.createElement('div');
  var details_el = document.createElement('div');
  var p_el = document.createElement('p');
  details_el.classList.add('details');

  if (direction == "outgoing") {
    chat_el.classList.add('chat');
    chat_el.classList.add('outgoing');
    p_el.innerText = msg;
  } else if (direction == "incoming") {
    var img_el = document.createElement('img');
    img_el.setAttribute('src', final_src);
    chat_el.classList.add('chat');
    chat_el.classList.add('incoming');
    p_el.innerText = msg;
    chat_el.append(img_el);
  }

  details_el.append(p_el);
  chat_el.append(details_el);
  message_container_el.appendChild(chat_el);
}

socket.emit('new-user', my_id_el.innerText);
socket.on('recieve-msg', function (msg, id) {
  console.log(msg);
  appendMessage(msg, "incoming");
});
send_container_el.addEventListener("submit", function (e) {
  e.preventDefault();
  if (message_container_el.lastElementChild){
    message_container_el.lastElementChild.scrollIntoView(true);
  }
  var msg = message_input_el.value;
  if(msg!=""){
    appendMessage(msg, "outgoing");
    socket.emit('send-chat-message', recipient_id_el.innerText, msg);
    message_input_el.value = '';
  }
});