// const socket = io("http://localhost:3000", {});
const socket = io();

const clientTotal = document.getElementById("clients-total");
const messageContainer = document.getElementById("message-container");
const nameInput = document.getElementById("name-input");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");


const messageTone = new Audio('/tune.mp3')

messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    sendMessage()
    messageInput.value = ""
})

socket.on("client-total", (data) => {
    clientTotal.textContent = `Total Clients : ${data}`
    console.log(data)
})

socket.on("chat-message", (data) => {
    console.log(data)
    addMessageToUI(false, data);
    messageTone.play();
    scrollToBottom()
})

function sendMessage() {
    if (!messageInput.value) return;
    const data = {
        name: nameInput.value,
        message: messageInput.value,
        datetime: new Date()
    }
    socket.emit("message-sent", data)
    addMessageToUI(true, data);
    scrollToBottom();
    clearTyping();
}

function addMessageToUI(isOwnMessage, data) {
    clearTyping();
    const element = `
    <li class="${isOwnMessage ? "message-right" : "message-left"}">
    <p>
        ${data.message}
        <span>${data.name} ${moment(data.datetime).fromNow()}</span>
    </p>
</li>
`

    messageContainer.innerHTML += element;

}


function scrollToBottom() {
    messageContainer.scrollTo(0, messageContainer.scrollHeight)
}

messageInput.addEventListener("focus", (e) => {
    socket.emit("feedback", {
        feedback: `${nameInput.value} is typing a message`
    })
})
messageInput.addEventListener("keydown", (e) => {
    socket.emit("feedback", {
        feedback: `${nameInput.value} is typing a message`
    })
})
messageInput.addEventListener("blur", (e) => {
   
    socket.emit("feedback", {
        feedback: ``
    })
})

function clearTyping() {
    
 document.querySelectorAll("li.message-feedback").forEach((el)=>{
     el.remove();
    //  el.parentNode.removeChild(el);
 })

}

socket.on("typed", (data) => {
    clearTyping();
    console.log("he is typing")
    messageContainer.innerHTML += `<li class="message-feedback">
    <p class="feedback" id="feedback">${data.feedback}</p>
</li>`

})

