$(function () {
  $('[data-toggle="tooltip"]').tooltip()

  const addToCartBtns = document.querySelectorAll(".addToCartBtn");
  const loading = document.getElementById("loading-overlay");

  addToCartBtns.forEach(btn => {
    btn.addEventListener("click", async () => {
      const cartId = btn.getAttribute("data-cart-id");
      const productId = btn.getAttribute("data-product-id");
      const quantity = btn.getAttribute("data-quantity");

      loading.style.display = "block";

      try {
        const response = await fetch(`/api/cart/${cartId}/product/${productId}/${quantity}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer your-auth-token" 
          },
        });

        if (!response.ok) {
          throw new Error("Error al agregar el producto al carrito");
        }

        console.log(`Producto ${productId} agregado al carrito correctamente`);

      } catch (error) {
        console.error("Error:", error.message);

      } finally {

        loading.style.display = "none";
      }
    });
  });
})
