const socket = io();

const welcome = document.getElementById("welcome");
const enterForm = welcome.querySelector("#enter");
const room = document.querySelector("#room");

room.hidden = true;

let roomName;

function handleEnterSubmit(event) {
  event.preventDefault();
  const roomNameInput = enterForm.querySelector("#roomName");
  const nicknameInput = enterForm.querySelector("#nickname");
  roomName = roomNameInput.value;
  socket.emit("enter_room", roomName, nicknameInput.value, showRoom);
}

enterForm.addEventListener("submit", handleEnterSubmit);

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const msgForm = room.querySelector("#msg");
  msgForm.addEventListener("submit", handleMessageSubmit);
}

socket.on("welcome", (user) => {
  addMessage(`${user} arrived!`);
});

socket.on("bye", (left) => {
  addMessage(`${left} left TT`);
});

socket.on("new_message", addMessage);

socket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";
  if (rooms.length === 0) {
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
});
