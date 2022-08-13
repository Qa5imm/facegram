
const socket = io();

const message_container_el= document.getElementById("message-container")
const send_container_el= document.getElementById("send-container")
const message_input_el= document.getElementById("message-input")
const send_button_el= document.getElementById("send-button")
const recipient_id_el= document.getElementById("recipient_id")
const my_id_el= document.getElementById("my_id")
const msg_data_el= document.getElementById("msg_data")
const chat_outgoing_el= document.getElementById("chat_outgoing")
const chat_incoming_el= document.getElementById("chat_incoming")
const details_outgoing_el= document.getElementById("details-outgoing")
const details_incoming_el= document.getElementById("details-incoming")
const wrapper_el= document.getElementById("wrapper")
const img_src_el= document.getElementById("img_src")
const src= img_src_el.src
const final_src=src.replace("http://localhost:3000", "..")



function appendMessage(msg,direction){
const chat_el=document.createElement('div')
const details_el= document.createElement('div')
const p_el= document.createElement('p')
details_el.classList.add('details')

if(direction == "outgoing"){
  chat_el.classList.add('chat') 
  chat_el.classList.add('outgoing') 
  
  p_el.innerText=msg
}
else if(direction == "incoming"){
  const img_el= document.createElement('img')
  img_el.setAttribute('src', final_src)
  chat_el.classList.add('chat')
  chat_el.classList.add('incoming')
  p_el.innerText=msg
  chat_el.append(img_el)

}
  details_el.append(p_el)
  chat_el.append(details_el)
  message_container_el.appendChild(chat_el)
}

socket.emit('new-user', my_id_el.innerText)


socket.on('recieve-msg',(msg,id)=>{
    console.log(msg)
    appendMessage(msg, "incoming" )

})
send_container_el.addEventListener("submit",(e)=>
{
    e.preventDefault()
    message_container_el.lastElementChild.scrollIntoView(true)
    let msg= message_input_el.value
    appendMessage(msg, "outgoing" )
    socket.emit('send-chat-message', recipient_id_el.innerText,msg)
    message_input_el.value=''
})

