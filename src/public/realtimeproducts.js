const socket = io();

let divAction;
let addAction = document.getElementById("add");
let deleteAction = document.getElementById("delete");
let products = document.getElementById("products");

socket.on("saludo", (datos) => {
  console.log(`${datos.emisor} dice ${datos.mensaje}`);
});

socket.on("products", (datos) => {
  const productsSocketDiv = document.getElementById("productsSocket");
  productsSocketDiv.innerHTML = "";

  const products = datos.products;
  products.forEach((products) => {
    const productItem = document.createElement("div");
    productItem.innerText = `${products.title} - $${products.price}`;
    productsSocketDiv.appendChild(productItem);
  });
});

socket.on("verProduct", (datos) => {
  const newProducts = document.getElementById("productsSocket");
  const newProduct = datos.datos;
  const productItem = document.createElement("div");
  productItem.innerText = `${newProduct.title} - $${newProduct.price}`;
  newProducts.appendChild(productItem);
});

document
  .getElementById("formAction")
  .addEventListener("submit", function (evento) {
    evento.preventDefault();
    const title = document.getElementById("add").value;
    const price = document.getElementById("price").value;

    socket.emit("agregarProducto", { title, price });
    document.getElementById("add").value = "";
    document.getElementById("price").value = "";
  });

// addAction.addEventListener("keyup", (evento) => {
//   if (evento.code === "Enter") {
//     socket.emit("add", { mensaje: evento.target.value });
//   }
// });
