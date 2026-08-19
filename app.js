

document.addEventListener("DOMContentLoaded", () => {

  const cartCount = document.querySelector(".cart-count");
  const addCartButtons = document.querySelectorAll(".add-cart");
  const cartButton = document.querySelector(".cart-btn");
  const categoryButtons = document.querySelectorAll(".category");
  const productCards = document.querySelectorAll(".product-card");
  const searchButton = document.querySelector(".search-btn");

  // =========================
  // PRODUCTS
  // =========================

  const products = [
    {
      id: 1,
      name: "کارتریج تونر Canon 725",
      brand: "Canon",
      price: 1250000
    },
    {
      id: 2,
      name: "کارتریج تونر HP 85A",
      brand: "HP",
      price: 1450000
    },
    {
      id: 3,
      name: "کارتریج تونر Samsung",
      brand: "Samsung",
      price: 1350000
    },
    {
      id: 4,
      name: "کارتریج تونر Brother",
      brand: "Brother",
      price: 1550000
    }
  ];


  // =========================
  // LOAD CART
  // =========================

  let cart = JSON.parse(localStorage.getItem("digiPrintCart")) || [];


  // =========================
  // SAVE CART
  // =========================

  function saveCart() {
    localStorage.setItem(
      "digiPrintCart",
      JSON.stringify(cart)
    );
  }


  // =========================
  // FORMAT PRICE
  // =========================

  function formatPrice(price) {
    return new Intl.NumberFormat("fa-IR").format(price);
  }


  // =========================
  // CART COUNT
  // =========================

  function updateCartCount() {

    const totalItems = cart.reduce(
      (total, item) => total + item.quantity,
      0
    );

    cartCount.textContent = totalItems;
  }


  // =========================
  // ADD PRODUCT
  // =========================

  function addToCart(productId) {

    const existingProduct = cart.find(
      item => item.id === productId
    );

    if (existingProduct) {

      existingProduct.quantity += 1;

    } else {

      const product = products.find(
        item => item.id === productId
      );

      if (!product) return;

      cart.push({
        ...product,
        quantity: 1
      });

    }

    saveCart();
    updateCartCount();

    showMessage("محصول به سبد خرید اضافه شد ✓");
  }


  // =========================
  // REMOVE PRODUCT
  // =========================

  function removeFromCart(productId) {

    cart = cart.filter(
      item => item.id !== productId
    );

    saveCart();
    updateCartCount();

    openCart();
  }


  // =========================
  // CHANGE QUANTITY
  // =========================

  function changeQuantity(productId, amount) {

    const product = cart.find(
      item => item.id === productId
    );

    if (!product) return;

    product.quantity += amount;

    if (product.quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    saveCart();
    updateCartCount();

    openCart();
  }


  // =========================
  // CART WINDOW
  // =========================

  function openCart() {

    const oldCart = document.querySelector(".cart-modal");

    if (oldCart) {
      oldCart.remove();
    }

    const modal = document.createElement("div");

    modal.className = "cart-modal";

    let cartHTML = `
      <div class="cart-overlay"></div>

      <div class="cart-box">

        <div class="cart-header">

          <h2>سبد خرید 🛒</h2>

          <button class="close-cart">
            ×
          </button>

        </div>

        <div class="cart-items">
    `;


    if (cart.length === 0) {

      cartHTML += `
        <div class="empty-cart">

          <div class="empty-cart-icon">
            🛒
          </div>

          <h3>
            سبد خرید خالی است
          </h3>

          <p>
            هنوز محصولی به سبد خرید اضافه نکرده‌اید.
          </p>

        </div>
      `;

    } else {

      cart.forEach(item => {

        cartHTML += `
          <div class="cart-item">

            <div class="cart-item-info">

              <strong>
                ${item.name}
              </strong>

              <span>
                ${item.brand}
              </span>

              <small>
                ${formatPrice(item.price)} تومان
              </small>

            </div>


            <div class="cart-item-actions">

              <button
                class="quantity-btn"
                data-id="${item.id}"
                data-action="increase">
                +
              </button>

              <span>
                ${item.quantity}
              </span>

              <button
                class="quantity-btn"
                data-id="${item.id}"
                data-action="decrease">
                −
              </button>

              <button
                class="remove-btn"
                data-id="${item.id}">
                🗑️
              </button>

            </div>

          </div>
        `;

      });

    }


    const totalPrice = cart.reduce(
      (total, item) =>
        total + (item.price * item.quantity),
      0
    );


    cartHTML += `
        </div>

        <div class="cart-footer">

          <div class="cart-total">

            <span>
              مبلغ کل:
            </span>

            <strong>
              ${formatPrice(totalPrice)}
              تومان
            </strong>

          </div>

          <button class="checkout-btn">
            ثبت سفارش
          </button>

        </div>

      </div>
    `;


    modal.innerHTML = cartHTML;

    document.body.appendChild(modal);


    // CLOSE

    modal.querySelector(".close-cart")
      .addEventListener("click", () => {
        modal.remove();
      });


    modal.querySelector(".cart-overlay")
      .addEventListener("click", () => {
        modal.remove();
      });


    // QUANTITY

    modal.querySelectorAll(".quantity-btn")
      .forEach(button => {

        button.addEventListener("click", () => {

          const id = Number(
            button.dataset.id
          );

          const action =
            button.dataset.action;

          if (action === "increase") {

            changeQuantity(id, 1);

          } else {

            changeQuantity(id, -1);

          }

        });

      });


    // REMOVE

    modal.querySelectorAll(".remove-btn")
      .forEach(button => {

        button.addEventListener("click", () => {

          const id = Number(
            button.dataset.id
          );

          removeFromCart(id);

        });

      });


    // CHECKOUT

    const checkoutButton =
      modal.querySelector(".checkout-btn");

    if (checkoutButton) {

      checkoutButton.addEventListener(
        "click",
        checkout
      );

    }

  }


  // =========================
  // CHECKOUT
  // =========================

  function checkout() {

    if (cart.length === 0) {

      alert(
        "سبد خرید شما خالی است."
      );

      return;
    }

    const totalPrice = cart.reduce(
      (total, item) =>
        total + (item.price * item.quantity),
      0
    );

    alert(
      "ثبت سفارش در مرحله بعدی فعال می‌شود.\n\n" +
      "مبلغ سفارش: " +
      formatPrice(totalPrice) +
      " تومان"
    );

  }


  // =========================
  // MESSAGE
  // =========================

  function showMessage(text) {

    const oldMessage =
      document.querySelector(".cart-message");

    if (oldMessage) {
      oldMessage.remove();
    }

    const message =
      document.createElement("div");

    message.className =
      "cart-message";

    message.textContent = text;

    document.body.appendChild(message);

    setTimeout(() => {

      message.classList.add("show");

    }, 10);

    setTimeout(() => {

      message.classList.remove("show");

      setTimeout(() => {
        message.remove();
      }, 300);

    }, 1800);

  }


  // =========================
  // ADD CART BUTTONS
  // =========================

  addCartButtons.forEach(
    (button, index) => {

      button.addEventListener(
        "click",
        () => {

          addToCart(
            products[index].id
          );

        }
      );

    }
  );


  // =========================
  // CART BUTTON
  // =========================

  cartButton.addEventListener(
    "click",
    openCart
  );


  // =========================
  // CATEGORY FILTER
  // =========================

  categoryButtons.forEach(button => {

    button.addEventListener(
      "click",
      () => {

        categoryButtons.forEach(
          btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        const category =
          button.textContent
            .trim()
            .toLowerCase();

        productCards.forEach(card => {

          const brand =
            card.querySelector(
              ".product-brand"
            )
            .textContent
            .trim()
            .toLowerCase();

          if (
            category === "همه" ||
            brand === category
          ) {

            card.style.display = "";

          } else {

            card.style.display = "none";

          }

        });

      }
    );

  });


  // =========================
  // SEARCH
  // =========================

  searchButton.addEventListener(
    "click",
    () => {

      const search =
        prompt(
          "نام محصول یا برند را وارد کنید:"
        );

      if (!search) return;

      const searchText =
        search.toLowerCase().trim();

      let found = false;

      productCards.forEach(card => {

        const name =
          card.querySelector("h3")
            .textContent
            .toLowerCase();

        const brand =
          card.querySelector(
            ".product-brand"
          )
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

        alert(
          "محصول مورد نظر پیدا نشد."
        );

        productCards.forEach(
          card =>
            card.style.display = ""
        );

      }

    }
  );


  // =========================
  // SCROLL ANIMATION
  // =========================

  const animatedElements =
    document.querySelectorAll(
      ".product-card, .brand-card, .contact-card, .feature"
    );

  const observer =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            entry.target.style.opacity = "1";

            entry.target.style.transform =
              "translateY(0)";

          }

        });

      },
      {
        threshold: 0.1
      }
    );


  animatedElements.forEach(element => {

    element.style.opacity = "0";

    element.style.transform =
      "translateY(25px)";

    element.style.transition =
      "opacity 0.6s ease, transform 0.6s ease";

    observer.observe(element);

  });


  // =========================
  // INITIALIZE
  // =========================

  updateCartCount();

});
