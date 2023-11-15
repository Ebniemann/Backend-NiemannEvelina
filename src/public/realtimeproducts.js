const socket = io();

let divAction;
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

socket.on("nuevoProducto", (datos) => {
  const prod = datos.nuevoProducto;
  alert(`Producto agregado ${prod.title}`);
});

socket.on("productoEliminado", (datos) => {
  const productoEliminado = datos.id;
  alert(`Producto con ID ${productoEliminado} eliminado`);
});
