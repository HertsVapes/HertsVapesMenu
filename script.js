const inventory = {
  special: {
    title: "Special Deals",
    type: "deals",
    items: [
      { name: "Vaporesso XROS Pro 2 + 4 Nic Salts", price: "£30", meta: "Kit bundle", included: ["Vaporesso body kit", "4 Elux Legend Nic Salt liquids"] },
      { name: "2 XROS Pods + 6 Nic Salts", price: "£20", meta: "Pods and liquids bundle", included: ["2 Vaporesso Corex XROS Pods", "6 Elux Legend Nic Salt liquids"] },
      { name: "2 Hayati Dual Flavour 25000", price: "£25", meta: "25K disposable bundle", included: ["2 Hayati Dual Flavour 25000 devices"] },
      { name: "3 Elux Legend 3500", price: "£10", meta: "3.5K disposable bundle", included: ["3 Elux Legend 3500 devices"] },
      { name: "2 Lost Mary BM6000 + 1 Hayati 25K", price: "£30", meta: "Mixed disposable bundle", included: ["2 Lost Mary BM6000 devices", "1 Hayati Dual Flavour 25000"] }
    ]
  },

  disposable: {
    title: "Disposable Vapes",
    items: [
      { name: "Lost Mary BM6000", price: "£10", meta: "13 flavours available", flavours: ["Summer Grape", "Blue Razz Lemonade", "Pineapple Ice", "Cherry Cola", "Cherry Ice", "Strawberry Raspberry Cherry Ice", "Banana Ice", "Triple Mango", "Blueberry Sour Raspberry", "Double Apple", "Blueberry Cherry Cranberry", "Miami Mint", "Orange Bru"] },
      { name: "Hayati Dual Flavour 25000", price: "£15", meta: "5 flavour combinations", flavours: ["Strawberry Cranberry Cherry / Strawberry Raspberry Ice", "Blue Razz Cherry / Blue Razz Gummy Bear", "Blueberry Cotton Candy / Raspberry Cotton Candy", "Strawberry Cranberry Cherry / Cherry Ice", "Kiwi Banana / Strawberry Banana"] },
      { name: "Enjoy Ultra 9000", price: "£10", meta: "2 flavours available", flavours: ["Berry Apple Peach", "Apple Watermelon Strawberry"] },
      { name: "Pixl 8000", price: "£10", meta: "Flavour: Black Cherry", flavours: ["Black Cherry"], simple: true },
      { name: "Hayati Pro Max 6000", price: "£10", meta: "Flavour: Fizzy Cherry", flavours: ["Fizzy Cherry"], simple: true },
      { name: "Elux Legend 3500", price: "£5", meta: "5 flavours available", flavours: ["Cherry Ice", "Fizzy Cherry", "Cherry Sours", "Pineapple Ice", "Watermelon Cherry Raspberry Ice"] }
    ]
  },

  podkits: {
    title: "Pod Kits",
    items: [
      { name: "Vaporesso XROS Pro 2.0 Body Kit", price: "£25", meta: "Comes with 2 pods", details: ["Glittering Black", "Glittering Silver", "Gem Green"] }
    ]
  },

  salts: {
    title: "Nic Salts",
    items: [
      { name: "Elux Legend Nic Salts (20mg)", price: "£2.50", meta: "25 flavours available", flavours: ["Mr Blue", "Blueberry Cranberry Cherry", "Blue Razz Gummy", "Blackberry Ice", "Banana Ice", "Gummy Bear", "Fizzy Cherry", "Watermelon Ice", "Blueberry Sour Raspberry", "Cherry Ice", "Blue Razz Cherry", "Cherry Sour Raspberry", "Grape", "Lemon Lime", "Strawberry Raspberry Cherry", "Cola", "Juicy Peach", "Pineapple Ice", "Hubba Bubba", "Lemonade", "Raspberry Peach", "Triple Mango", "Raspberry Watermelon", "Black Cherry", "Triple Melon"] }
    ]
  },

  pods: {
    title: "Replacement Pods",
    items: [
      { name: "Vaporesso Corex XROS Pods (0.6Ω)", meta: "Replacement pods", pricing: [{ label: "1 Pod", price: "£5" }, { label: "Pack of 4", price: "£15" }], saving: "Save £5" }
    ]
  },

  pouches: {
    title: "Nicotine Pouches",
    items: [
      { name: "Nicotine Pouches", meta: "VELO and Pablo available", pricing: [{ label: "1 Box", price: "£5" }, { label: "Pack of 5 Boxes", price: "£20" }], saving: "Save £5", details: ["VELO - Minty Lemon (10mg)", "Pablo - Frosted Mint (50mg)"] }
    ]
  }
};

const menu = document.querySelector(".menu-visual");
const readyCard = document.querySelector(".ready-card");
const bulkCard = document.querySelector(".bulk-card");
const panel = document.getElementById("inventoryPanel");
const panelTitle = document.getElementById("panelTitle");
const panelContent = document.getElementById("panelContent");
const closePanel = document.getElementById("closePanel");
const cartFloat = document.getElementById("cartFloat");
const cartCount = document.getElementById("cartCount");
const cartOverlay = document.getElementById("cartOverlay");
const cartDrawer = document.getElementById("cartDrawer");
const cartClose = document.getElementById("cartClose");
const cartBody = document.getElementById("cartBody");
const cartWhatsapp = document.getElementById("cartWhatsapp");
const cartSnapchat = document.getElementById("cartSnapchat");
const cartClear = document.getElementById("cartClear");
const toast = document.getElementById("toast");
const WHATSAPP_NUMBER = "447885752823";
const CART_KEY = "hertsVapesCart";
let cart = loadCart();
let toastTimer;

function softTap() {
  if (navigator.vibrate) navigator.vibrate(8);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (error) {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCart();
}

document.querySelectorAll("[data-scroll]").forEach((button) => {
  button.addEventListener("click", () => {
    softTap();
    const target = document.querySelector(button.dataset.scroll);
    if (target && target.id === "menu" && menu) menu.classList.add("reveal");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

function revealOnScroll() {
  const vh = window.innerHeight;
  const hasStartedScrolling = window.scrollY > 24;

  // Keep the menu as a dim preview on first load. It becomes clear once the
  // customer taps Shop Now or starts scrolling, which makes the first screen
  // feel more intentional and less like two separate posters.
  if (menu && (hasStartedScrolling || menu.getBoundingClientRect().top < vh * 0.56)) {
    menu.classList.add("reveal");
  }

  if (readyCard && readyCard.getBoundingClientRect().top < vh * 0.86) readyCard.classList.add("reveal");
  if (bulkCard && bulkCard.getBoundingClientRect().top < vh * 0.88) bulkCard.classList.add("reveal");
}

window.addEventListener("scroll", revealOnScroll, { passive: true });
window.addEventListener("load", () => {
  // Do not auto-reveal the menu on load; the faded preview is intentional.
  renderCart();
  revealOnScroll();
});

document.querySelectorAll(".category-hit").forEach((button) => {
  button.addEventListener("click", () => {
    softTap();
    openCategory(button.dataset.category);
  });
});

closePanel.addEventListener("click", () => {
  softTap();
  panel.classList.remove("open");
  panel.style.display = "none";
  document.getElementById("menu").scrollIntoView({ behavior: "smooth", block: "start" });
});

function openCategory(key) {
  const category = inventory[key];
  panelTitle.textContent = category.title;
  panelContent.innerHTML = renderCategory(category);
  panel.style.display = "block";
  requestAnimationFrame(() => panel.classList.add("open"));
  panel.scrollIntoView({ behavior: "smooth", block: "start" });
  setupProductCards();
}

function renderCategory(category) {
  if (category.type === "deals") return category.items.map(renderDeal).join("");
  return category.items.map(renderProduct).join("");
}

function renderDeal(deal) {
  return `
    <article class="deal-card">
      <div class="deal-main">
        <div>
          <div class="deal-name">${escapeHtml(deal.name)}</div>
          <div class="deal-meta">${escapeHtml(deal.meta)}</div>
          <div class="included-list">${deal.included.map(item => `<span>${escapeHtml(item)}</span>`).join("")}</div>
        </div>
        <div class="price-pill">${escapeHtml(deal.price)}</div>
      </div>
      <div class="card-actions">
        <button class="add-cart-button" type="button" data-add="${escapeHtml(deal.name)}" data-price="${escapeHtml(deal.price)}">Add to Cart</button>
      </div>
    </article>
  `;
}

function renderProduct(product) {
  const choices = product.flavours || product.details || [];
  const hasExpandable = choices.length > 1;
  return `
    <article class="product-card ${hasExpandable ? "can-open" : ""}">
      <button class="product-main" type="button" ${hasExpandable ? "" : "disabled"}>
        <div>
          <div class="product-name">${escapeHtml(product.name)}</div>
          <div class="product-meta">${escapeHtml(product.meta)}${hasExpandable ? "  ▾" : ""}</div>
        </div>
        ${product.price ? `<div class="price-pill">${escapeHtml(product.price)}</div>` : ""}
      </button>
      ${product.pricing ? renderPricing(product) : ""}
      ${hasExpandable ? renderExpandable(product) : ""}
      ${!product.pricing && !hasExpandable ? renderQuickAdd(product, choices[0]) : ""}
    </article>
  `;
}

function renderQuickAdd(product, option = "") {
  return `
    <div class="card-actions">
      <button class="add-cart-button" type="button" data-add="${escapeHtml(product.name)}" data-option="${escapeHtml(option)}" data-price="${escapeHtml(product.price || "")}">Add to Cart</button>
    </div>
  `;
}

function renderPricing(product) {
  if (product.details && product.details.length) {
    return `
      <div class="price-pair priced-options">
        ${product.details.map(detail => `
          <div class="option-group">
            <div class="option-title">${escapeHtml(detail)}</div>
            <div class="option-prices">
              ${product.pricing.map(row => `<button class="price-row add-price" type="button" data-add="${escapeHtml(product.name)}" data-option="${escapeHtml(detail + " - " + row.label)}" data-price="${escapeHtml(row.price)}"><span>${escapeHtml(row.label)}</span><strong>${escapeHtml(row.price)}</strong></button>`).join("")}
            </div>
          </div>
        `).join("")}
        ${product.saving ? `<div class="saving">${escapeHtml(product.saving)}</div>` : ""}
      </div>
    `;
  }

  return `
    <div class="price-pair">
      ${product.pricing.map(row => `<button class="price-row add-price" type="button" data-add="${escapeHtml(product.name)}" data-option="${escapeHtml(row.label)}" data-price="${escapeHtml(row.price)}"><span>${escapeHtml(row.label)}</span><strong>${escapeHtml(row.price)}</strong></button>`).join("")}
      ${product.saving ? `<div class="saving">${escapeHtml(product.saving)}</div>` : ""}
    </div>
  `;
}

function renderExpandable(product) {
  const list = product.flavours || product.details || [];
  const twoCol = list.length >= 6 ? " two-col" : "";
  return `<div class="expand-content"><div class="flavour-list${twoCol}">${list.map(item => `<button class="flavour add-flavour" type="button" data-add="${escapeHtml(product.name)}" data-option="${escapeHtml(item)}" data-price="${escapeHtml(product.price || "")}">${escapeHtml(item)}<span>Add</span></button>`).join("")}</div></div>`;
}

function setupProductCards() {
  const cards = [...document.querySelectorAll(".product-card.can-open")];
  cards.forEach((card) => {
    const button = card.querySelector(".product-main");
    button.addEventListener("click", () => {
      softTap();
      cards.forEach(other => { if (other !== card) other.classList.remove("open"); });
      card.classList.toggle("open");
    });
  });
}

panelContent.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  if (!addButton) return;
  softTap();
  addToCart({
    name: addButton.dataset.add,
    option: addButton.dataset.option || "",
    price: addButton.dataset.price || ""
  });
});

function addToCart(item) {
  const key = `${item.name}||${item.option}||${item.price}`;
  const existing = cart.find(cartItem => cartItem.key === key);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, key, qty: 1 });
  }
  saveCart();
  showToast("Added to cart");
}

function updateQty(key, change) {
  const item = cart.find(cartItem => cartItem.key === key);
  if (!item) return;
  item.qty += change;
  if (item.qty <= 0) cart = cart.filter(cartItem => cartItem.key !== key);
  saveCart();
}

function removeFromCart(key) {
  cart = cart.filter(cartItem => cartItem.key !== key);
  saveCart();
}

function totalItems() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function renderCart() {
  const total = totalItems();
  cartCount.textContent = total;
  cartCount.hidden = total === 0;
  cartFloat.classList.toggle("has-items", total > 0);

  if (!cart.length) {
    cartBody.innerHTML = `<div class="empty-cart">Your cart is empty.<br>Open a category and add what you want.</div>`;
    return;
  }

  cartBody.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-main">
        <strong>${escapeHtml(item.name)}</strong>
        ${item.option ? `<span>${escapeHtml(item.option)}</span>` : ""}
        ${item.price ? `<em>${escapeHtml(item.price)}</em>` : ""}
      </div>
      <div class="qty-control">
        <button type="button" data-qty="-1" data-key="${escapeHtml(item.key)}" aria-label="Decrease quantity">−</button>
        <span>${item.qty}</span>
        <button type="button" data-qty="1" data-key="${escapeHtml(item.key)}" aria-label="Increase quantity">+</button>
      </div>
      <button class="remove-item" type="button" data-remove="${escapeHtml(item.key)}" aria-label="Remove item">×</button>
    </div>
  `).join("");
}

function buildOrderMessage() {
  if (!cart.length) {
    return "Hi Herts Vapes, I'd like to place an order.";
  }

  const lines = cart.map(item => {
    const option = item.option ? ` - ${item.option}` : "";
    const price = item.price ? ` (${item.price})` : "";
    return `• ${item.name}${option}${price} ×${item.qty}`;
  }).join("\n");

  return `Hi Herts Vapes,\n\nI'd like to order:\n\n${lines}\n\nCollection or delivery?`;
}

async function copyOrderMessage() {
  const message = buildOrderMessage();
  try {
    await navigator.clipboard.writeText(message);
    showToast("Order copied");
  } catch (error) {
    showToast("Order ready to copy");
  }
  return message;
}

function openCart() {
  softTap();
  cartOverlay.classList.add("open");
  cartDrawer.classList.add("open");
  cartOverlay.setAttribute("aria-hidden", "false");
  cartDrawer.setAttribute("aria-hidden", "false");
}

function closeCart() {
  softTap();
  cartOverlay.classList.remove("open");
  cartDrawer.classList.remove("open");
  cartOverlay.setAttribute("aria-hidden", "true");
  cartDrawer.setAttribute("aria-hidden", "true");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1500);
}

cartFloat.addEventListener("click", openCart);
cartOverlay.addEventListener("click", closeCart);
cartClose.addEventListener("click", closeCart);

cartBody.addEventListener("click", (event) => {
  const qtyButton = event.target.closest("[data-qty]");
  const removeButton = event.target.closest("[data-remove]");

  if (qtyButton) {
    softTap();
    updateQty(qtyButton.dataset.key, Number(qtyButton.dataset.qty));
  }

  if (removeButton) {
    softTap();
    removeFromCart(removeButton.dataset.remove);
  }
});

cartClear.addEventListener("click", () => {
  softTap();
  cart = [];
  saveCart();
  showToast("Cart cleared");
});

cartWhatsapp.addEventListener("click", async () => {
  softTap();
  const message = await copyOrderMessage();
  window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
});

cartSnapchat.addEventListener("click", async () => {
  softTap();
  await copyOrderMessage();
  window.open("https://www.snapchat.com/add/herts.vps", "_blank");
});
