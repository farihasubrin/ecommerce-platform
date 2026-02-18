// Demo product data (replace with your own)
const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 49.99,
    desc: "Comfortable sound with strong bass.",
    img: "https://images.unsplash.com/photo-1518441902117-f0a04b3a3c1c?auto=format&fit=crop&w=800&q=60"
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 79.99,
    desc: "Track your steps and notifications.",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=60"
  },
  {
    id: 3,
    name: "Running Shoes",
    price: 59.99,
    desc: "Lightweight and durable for daily use.",
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=60"
  },
  {
    id: 4,
    name: "Backpack",
    price: 34.99,
    desc: "Strong, stylish, and spacious.",
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=60"
  }
];

const productGrid = document.getElementById("productGrid");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const cartItemsEl = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const cartCountEl = document.getElementById("cartCount");
const checkoutMsg = document.getElementById("checkoutMsg");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Render products
function renderProducts() {
  productGrid.innerHTML = "";
  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <div class="price">$${p.price.toFixed(2)}</div>
      <button class="add-btn" onclick="addToCart(${p.id})">Add to Cart</button>
    `;
    productGrid.appendChild(div);
  });
}

// Add to cart
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const item = cart.find(i => i.id === productId);

  if (item) item.qty += 1;
  else cart.push({ ...product, qty: 1 });

  saveCart();
  renderCart();
  openCart();
}

// Change qty
function changeQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== productId);

  saveCart();
  renderCart();
}

// Remove item
function removeItem(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart();
  renderCart();
}

// Render cart
function renderCart() {
  cartItemsEl.innerHTML = "";

  if (cart.length === 0) {
    cartItemsEl.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    cart.forEach(item => {
      const row = document.createElement("div");
      row.className = "cart-item";
      row.innerHTML = `
        <img src="${item.img}" alt="${item.name}">
        <div>
          <h4>${item.name}</h4>
          <div class="mini">$${item.price.toFixed(2)}</div>
          <div class="qty-row">
            <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
            <span>${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
            <button class="remove-btn" onclick="removeItem(${item.id})">Remove</button>
          </div>
        </div>
      `;
      cartItemsEl.appendChild(row);
    });
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  cartTotalEl.textContent = total.toFixed(2);

  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  cartCountEl.textContent = count;
}

// Save cart
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Open/Close cart drawer
function openCart() {
  cartDrawer.classList.add("open");
  overlay.classList.add("show");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  overlay.classList.remove("show");
}

// Checkout (demo)
document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    checkoutMsg.textContent = "Cart is empty!";
    return;
  }
  cart = [];
  saveCart();
  renderCart();
  checkoutMsg.textContent = "✅ Order placed (demo).";
  setTimeout(() => (checkoutMsg.textContent = ""), 2500);
});

document.getElementById("openCartBtn").addEventListener("click", openCart);
document.getElementById("closeCartBtn").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

// Init
renderProducts();
renderCart();
