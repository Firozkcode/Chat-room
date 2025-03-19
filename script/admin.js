const socket = io();

const adminPassInput = document.getElementById("adminPass");
const adminLoginBtn = document.getElementById("adminLoginBtn");
const adminPanelDiv = document.getElementById("admin-panel");
const chatroomIDInput = document.getElementById("chatroomID");
const setRoomBtn = document.getElementById("setRoomBtn");
const logoutAdminBtn = document.getElementById("logoutAdmin");

adminLoginBtn.addEventListener("click", () => {
    if (adminPassInput.value === "admin") {
        document.getElementById("admin-login").style.display = "none";
        adminPanelDiv.style.display = "block";
    } else {
        alert("Incorrect Admin Password!");
    }
});

setRoomBtn.addEventListener("click", () => {
    const roomKey = chatroomIDInput.value.trim();
    if (roomKey) {
        socket.emit("set-room", roomKey);
    }
});

socket.on("room-changed", (data) => {
    alert(data.message);
});

logoutAdminBtn.addEventListener("click", () => window.location.reload());
