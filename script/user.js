const socket = io();

const loginDiv = document.getElementById("login");
const usernameInput = document.getElementById("username");
const roomKeyInput = document.getElementById("roomKey");
const joinBtn = document.getElementById("joinBtn");
const chatroomDiv = document.getElementById("chatroom");
const userName = document.getElementById("user-name");
const allMessages = document.getElementById("messages");
const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("message");
const logoutUserBtn = document.getElementById("logoutUser");

let currentUserName = "";
let currentRoomKey = "";

function notificationMessage(type, messageText) {
    const notificationContainer = document.getElementById("notificationContainer");

    // Create the notification element
    const notification = document.createElement("div");
    notification.className = `notification ${type}`; // Add class for styling

    // Add the message
    const message = document.createElement("div");
    message.className = "message";
    message.textContent = messageText;

    // Add a close button
    const closeBtn = document.createElement("button");
    closeBtn.className = "close-btn";
    closeBtn.innerHTML = "&times;";
    closeBtn.addEventListener("click", () => {
        notification.remove();
    });

    // Add the progress bar
    const progressBar = document.createElement("div");
    progressBar.className = "progress-bar";

    // Append elements to the notification
    notification.appendChild(message);
    notification.appendChild(closeBtn);
    notification.appendChild(progressBar);

    // Append the notification to the container
    notificationContainer.appendChild(notification);

    // Remove the notification after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

joinBtn.addEventListener("click", (e) => {
    e.preventDefault();
    currentUserName = usernameInput.value.trim();
    currentRoomKey = roomKeyInput.value.trim();

    if (currentUserName && currentRoomKey) {
        socket.emit("join-room", { name: currentUserName, key: currentRoomKey });
    }
});

socket.on("access-granted", () => {
    loginDiv.style.display = "none";
    chatroomDiv.style.display = "flex";
    userName.textContent = `Me: ${currentUserName}`;
});

socket.on("access-denied", (message) => {
    alert(message);
});

socket.on("message", ({ sender, senderId, message, type }) => {
    const p = document.createElement("p");
    if(sender === currentUserName){
        p.textContent = `${message}`;
    }
    else{
        p.textContent = `${sender}: ${message}`;
    }
    allMessages.appendChild(p);
    if (type === "connect") {
        p.innerText = message;
        p.classList.add("connect"); // For connection messages
    } else if (type === "disconnect") {
        p.innerText = message;
        p.classList.add("connect"); // For disconnection messages
    } else if (type === "message") {
        // p.innerText = `${sender}: ${message}`;
        p.classList.add(senderId === socket.id ? "sender" : "receiver"); // Sender or receiver
    }
});

socket.on("room-changed", (data) => {
    alert(data.message);
    notificationMessage("processing", "Admin has changed the chatroom ID. Please rejoin.");
    setTimeout(() => logoutUser(), 4000);
});

function sendMessage() {     
    const message = messageInput.value.trim();     
    if (message) {         
        socket.emit("user-message", { message, sender: currentUserName, roomKey: currentRoomKey });         
        messageInput.value = "";         
        messageInput.focus(); // Keep the input field focused  
    } 
}

sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        sendMessage();
    }
});

function logoutUser() {
    socket.emit("leave-room", { name: currentUserName, roomKey: currentRoomKey });
    window.location.reload();
    notificationMessage("processing", "Admin has changed the chatroom ID. Please rejoin.");

}

logoutUserBtn.addEventListener("click", logoutUser);
