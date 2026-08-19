
document.addEventListener("DOMContentLoaded", () => {

  const cartCount = document.querySelector(".cart-count");
  const addCartButtons = document.querySelectorAll(".add-cart");
  const cartButton = document.querySelector(".cart-btn");
  const categoryButtons = document.querySelectorAll(".category");
  const productCards = document.querySelectorAll(".product-card");
  const searchButton = document.querySelector(".search-btn");

  let cart = [];

  /* =========================
     CART
  ========================= */

  function updateCartCount() {
    cartCount.textContent = cart.length;
  }

  addCartButtons.forEach((button, index) => {

    button.addEventListener("click", () => {

      const product = productCards[index];

      const name = product.querySelector("h3").textContent.trim();
      const brand = product.querySelector(".product-brand").textContent.trim();

      cart.push({
        name: name,
        brand: brand
      });

      updateCartCount();

      const originalText = button.textContent;

      button.textContent = "✓ اضافه شد";

      button.style.background = "#198754";

      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = "";
      }, 1200);

    });

  });


  /* =========================
     CART BUTTON
  ========================= */

  cartButton.addEventListener("click", () => {

    if (cart.length === 0) {

      alert("سبد خرید شما خالی است.");

      return;
    }

    let message = "محصولات سبد خرید:\n\n";

    cart.forEach((item, index) => {

      message += `${index + 1}. ${item.name} - ${item.brand}\n`;

    });

    message += `\nتعداد محصولات: ${cart.length}`;

    alert(message);

  });


  /* =========================
     CATEGORY FILTER
  ========================= */

  categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

      categoryButtons.forEach(btn => {
        btn.classList.remove("active");
      });

      button.classList.add("active");

      const category = button.textContent.trim().toLowerCase();

      productCards.forEach(card => {

        const brand = card
          .querySelector(".product-brand")
          .textContent
          .trim()
          .toLowerCase();

        if (category === "همه" || brand === category) {

          card.style.display = "";

        } else {

          card.style.display = "none";

        }

      });

    });

  });


  /* =========================
     SEARCH
  ========================= */

  searchButton.addEventListener("click", () => {

    const search = prompt("نام محصول یا برند را وارد کنید:");

    if (!search) return;

    const searchText = search.toLowerCase().trim();

    let found = false;

    productCards.forEach(card => {

      const name = card
        .querySelector("h3")
        .textContent
        .toLowerCase();

      const brand = card
        .querySelector(".product-brand")
        .textContent
        .toLowerCase();

      if (
        name.includes(searchText) ||
        brand.includes(searchText)
      ) {

        card.style.display = "";
        found = true;

      } else {

        card.style.display = "none";

      }

    });

    if (!found) {

      alert("محصول مورد نظر پیدا نشد.");

      productCards.forEach(card => {
        card.style.display = "";
      });

    }

  });


  /* =========================
     SCROLL ANIMATION
  ========================= */

  const animatedElements = document.querySelectorAll(
    ".product-card, .brand-card, .contact-card, .feature"
  );

  const observer = new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";

        }

      });

    },
    {
      threshold: 0.1
    }
  );


  animatedElements.forEach(element => {

    element.style.opacity = "0";
    element.style.transform = "translateY(25px)";
    element.style.transition = "opacity 0.6s ease, transform 0.6s ease";

    observer.observe(element);

  });


  /* =========================
     INITIAL CART
  ========================= */

  updateCartCount();

});
