const socket = io();

socket.on("connect", () => {
  socket.emit("getStoredMessages");
});

function chatMessages(datos) {
  let socketMessages = document.createElement("p");
  socketMessages.innerHTML = `<strong>${datos.emisor} </strong> dice: <p> ${datos.message}</p>`;
  socketMessages.classList.add("messages");
  divMessage.appendChild(socketMessages);
  divMessage.scrollTop = divMessage.scrollHeight;

  console.log(chatMessages);
}
socket.on("storedMessages", (storedMessages) => {
  if (storedMessages && storedMessages.length > 0) {
    storedMessages.forEach((msg) => {
      chatMessages(msg);
    });
    console.log(storedMessages);
  }
});

let inputMessage = document.getElementById("menssage");
let divMessage = document.getElementById("messageDiv");

Swal.fire({
  title: "Identifiquese",
  input: "text",
  text: "Ingrese su nickname",
  inputValidator: (value) => {
    return !value && "Debe iingresar un nombre...!";
  },
  allowOutsideClick: false,
}).then((result) => {
  socket.emit("id", result.value);

  socket.on("newUser", (nombre) => {
    Swal.fire(`Se conecto ${nombre}`);
  });

  socket.on("Bienvenido", (datos) => {
    datos.forEach((msg) => {
      let socketMessages = document.createElement("p");
      socketMessages.innerHTML = `<strong>${msg.emisor} </strong> dice: <p> ${msg.message}</p>`;
      socketMessages.classList.add("messages");
      divMessage.appendChild(socketMessages);
      divMessage.scrollTop = divMessage.scrollHeight;
    });
  });

  socket.on("chatMessages", (datos) => {
    chatMessages(datos);
  });

  inputMessage.addEventListener("keyup", (e) => {
    if (e.code === "Enter" && e.target.value.trim().length > 0) {
      socket.emit("menssage", {
        emisor: result.value,
        message: e.target.value.trim(),
      });
      e.target.value = "";
    }
  });

  socket.on("userDisconnect", (nombre) => {
    Swal.fire(`Se desconecto  ${nombre}`);
  });
});
