/*
  HERTS VAPES V4
  Products, categories, flavours, prices, deals and stock now come from inventory.js.
  For normal future updates, edit inventory.js only.
*/
const inventory = window.HERTS_VAPES_INVENTORY || {};
const hvContact = window.HERTS_VAPES_CONTACT || {};

const menu = document.querySelector(".menu-visual");
const categoryList = document.getElementById("categoryList");
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
const WHATSAPP_NUMBER = hvContact.whatsappNumber || "447885752823";
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


function renderMenuCategories() {
  if (!categoryList) return;
  const categories = inventory.menuCategories || [];
  categoryList.innerHTML = categories.map((category) => `
    <button class="category-card" type="button" data-category="${escapeHtml(category.key)}" aria-label="Open ${escapeHtml(category.title)}">
      <span class="category-icon" aria-hidden="true">${categoryIcon(category.icon)}</span>
      <span class="category-name">${escapeHtml(category.title)}</span>
      ${category.image ? `<img class="category-image" src="${escapeHtml(category.image)}" alt="" loading="lazy" />` : ""}
      <span class="category-arrow" aria-hidden="true">›</span>
    </button>
  `).join("");
}

function categoryIcon(icon) {
  const icons = {
    tag: '<svg viewBox="0 0 48 48"><path d="M6 22V8h14l21 21-14 14L6 22Z"></path><path d="M15 15h.2"></path><path d="M17 33 31 19"></path><path d="M17 21c0 2 3 2 3 0s-3-2-3 0Z"></path><path d="M28 31c0 2 3 2 3 0s-3-2-3 0Z"></path></svg>',
    bottle: '<svg viewBox="0 0 48 48"><path d="M20 5h8v8l4 5v23a3 3 0 0 1-3 3H19a3 3 0 0 1-3-3V18l4-5V5Z"></path><path d="M20 13h8"></path><path d="M19 25h10v11H19z"></path></svg>',
    kit: '<svg viewBox="0 0 48 48"><path d="M17 7h14v34a4 4 0 0 1-4 4h-6a4 4 0 0 1-4-4V7Z"></path><path d="M20 13h8"></path><path d="M24 27h.2"></path></svg>',
    drop: '<svg viewBox="0 0 48 48"><path d="M24 5S12 20 12 30a12 12 0 0 0 24 0C36 20 24 5 24 5Z"></path></svg>',
    pod: '<svg viewBox="0 0 48 48"><path d="M15 6h18v13H15z"></path><path d="M13 19h22v23H13z"></path><path d="M18 28h12"></path></svg>',
    pouch: '<svg viewBox="0 0 48 48"><ellipse cx="24" cy="17" rx="17" ry="8"></ellipse><path d="M7 17v14c0 4.4 7.6 8 17 8s17-3.6 17-8V17"></path></svg>',
    tobacco: '<svg viewBox="0 0 48 48"><path d="M10 32c8-12 20-15 29-16"></path><path d="M14 37c7-8 15-11 24-11"></path><path d="M17 14h14l4 7H13l4-7Z"></path><path d="M13 21h22v13H13z"></path></svg>'
  };
  return icons[icon] || icons.bottle;
}

renderMenuCategories();

function revealMenu() {
  if (!menu) return;
  menu.classList.add("reveal");
  document.body.classList.add("menu-entered");
}

document.querySelectorAll("[data-scroll]").forEach((button) => {
  button.addEventListener("click", () => {
    softTap();
    revealMenu();
    const target = document.querySelector(button.dataset.scroll);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

function revealOnScroll() {
  const vh = window.innerHeight;
  if (window.scrollY > 18 || (menu && menu.getBoundingClientRect().top < vh * 0.72)) revealMenu();
  if (readyCard && readyCard.getBoundingClientRect().top < vh * 0.86) readyCard.classList.add("reveal");
  if (bulkCard && bulkCard.getBoundingClientRect().top < vh * 0.88) bulkCard.classList.add("reveal");
}

window.addEventListener("scroll", revealOnScroll, { passive: true });
window.addEventListener("load", () => {
  document.body.classList.add("hero-loaded");
  renderCart();
});

document.querySelectorAll("[data-category]").forEach((button) => {
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
  if (!category) return;
  panel.dataset.category = key;
  panelTitle.textContent = category.title;
  panelContent.innerHTML = renderCategory(category);
  panel.style.display = "block";
  requestAnimationFrame(() => panel.classList.add("open"));
  panel.scrollIntoView({ behavior: "smooth", block: "start" });
  setupProductCards();
}


function isInStock(item) {
  return !item || item.stock !== false;
}

function choiceLabel(choice) {
  return typeof choice === "string" ? choice : (choice.name || choice.label || "");
}

function choiceStock(choice) {
  return typeof choice === "string" ? true : choice.stock !== false;
}

function stockText(item) {
  return isInStock(item) ? "" : "OUT OF STOCK";
}

function renderCategory(category) {
  if (category.type === "bulk") return renderBulkCategory(category);
  if (category.type === "deals") return category.items.map(renderDeal).join("");
  return category.items.map(renderProduct).join("");
}

function renderDeal(deal) {
  const promptData = deal.prompts ? escapeHtml(deal.prompts.join("||")) : "";
  const displayName = deal.subline ? `${deal.name} ${deal.subline}` : deal.name;
  const available = isInStock(deal);
  return `
    <article class="deal-card offer-card ${available ? "" : "is-out-of-stock"}">
      ${renderDealVisuals(deal)}
      <div class="deal-main">
        <div>
          ${deal.saving ? `<div class="saving-badge">${escapeHtml(deal.saving)}</div>` : ""}
          <div class="deal-name">${escapeHtml(deal.name)}</div>
          ${deal.subline ? `<div class="deal-plus-line">${escapeHtml(deal.subline)}</div>` : ""}
          <div class="deal-meta">${escapeHtml(deal.meta)}</div>
          ${deal.confirm ? `<div class="confirm-note">${escapeHtml(deal.confirm)}</div>` : ""}
          ${!available ? `<div class="stock-badge">${stockText(deal)}</div>` : ""}
        </div>
        <div class="price-pill">${escapeHtml(deal.price)}</div>
      </div>
      <div class="card-actions">
        <button class="add-cart-button" type="button" data-add="${escapeHtml(displayName)}" data-price="${escapeHtml(deal.price)}" data-prompts="${promptData}" ${available ? "" : "disabled"}>${available ? "ADD" : "OUT"}</button>
      </div>
    </article>
  `;
}

function renderDealVisuals(deal) {
  if (!deal.visuals || !deal.visuals.length) return "";
  return `
    <div class="deal-visuals">
      ${deal.visuals.map((visual, index) => `
        ${index > 0 ? `<span class="deal-visual-plus">+</span>` : ""}
        <div class="deal-product-tile">
          <span class="deal-product-label">${escapeHtml(visual.label)}</span>
          ${visual.qty ? `<strong>${escapeHtml(visual.qty)}</strong>` : ""}
        </div>
      `).join("")}
    </div>
  `;
}

function renderBulkCategory(category) {
  return `
    <article class="bulk-panel-card bulk-final-card">
      <div class="bulk-icon-box package-icon" aria-hidden="true">
        <svg viewBox="0 0 120 100" focusable="false">
          <path d="M20 34 60 14 100 34 60 54 20 34Z"></path>
          <path d="M20 34v38l40 20V54L20 34Z"></path>
          <path d="M100 34v38L60 92V54l40-20Z"></path>
          <path d="M42 24 82 44"></path>
        </svg>
      </div>
      <p class="bulk-panel-kicker">HV BULK</p>
      <h3>Bulk Orders</h3>
      <p class="bulk-intro">${escapeHtml(category.intro)}</p>
      <div class="bulk-points panel-bulk-points">
        ${category.points.map(point => `<div class="bulk-point">${escapeHtml(point)}</div>`).join("")}
      </div>
      <div class="bulk-minimum-box">
        <span>Available on bulk pre-orders from</span>
        <strong>£100+</strong>
      </div>
      <a href="${category.link}" class="order-button bulk-button">Order on WhatsApp</a>
      <p class="bulk-footnote">You will be redirected to WhatsApp to place your bulk order.</p>
    </article>
  `;
}


function renderProduct(product) {
  const choices = product.flavours || product.details || [];
  const hasExpandable = choices.length > 1 && !product.pricing;
  const hasSingleChoice = choices.length === 1 && !product.pricing;
  const available = isInStock(product);

  return `
    <article class="product-card ${hasExpandable ? "can-open" : ""} ${available ? "" : "is-out-of-stock"}">
      <button class="product-main" type="button" ${hasExpandable && available ? "" : "disabled"}>
        <div>
          <div class="product-name">${escapeHtml(product.name)}${product.popular ? ` <span class="popular-badge">MOST POPULAR</span>` : ""}</div>
          <div class="product-meta">${escapeHtml(product.meta)}${hasExpandable && available ? "  ▾" : ""}</div>
          ${!available ? `<div class="stock-badge">${stockText(product)}</div>` : ""}
        </div>
        ${product.price ? `<div class="price-pill">${escapeHtml(product.price)}</div>` : ""}
      </button>
      ${product.pricing ? renderPricing(product, available) : ""}
      ${hasExpandable && available ? renderExpandable(product) : ""}
      ${hasSingleChoice ? renderSingleOption(product, choices[0], available) : ""}
      ${!product.pricing && choices.length === 0 ? renderQuickAdd(product, "", available) : ""}
    </article>
  `;
}

function renderQuickAdd(product, option = "", parentAvailable = true) {
  const available = parentAvailable && isInStock(product);
  return `
    <div class="card-actions">
      <button class="add-cart-button" type="button" data-add="${escapeHtml(product.name)}" data-option="${escapeHtml(option)}" data-price="${escapeHtml(product.price || "")}" ${available ? "" : "disabled"}>${available ? "ADD" : "OUT"}</button>
    </div>
  `;
}

function renderSingleOption(product, option = "", parentAvailable = true) {
  const label = choiceLabel(option) || product.name;
  const available = parentAvailable && choiceStock(option);
  return `
    <div class="single-option-list">
      <button class="option-add-row" type="button" data-add="${escapeHtml(product.name)}" data-option="${escapeHtml(label)}" data-price="${escapeHtml(product.price || "")}" ${available ? "" : "disabled"}>
        <span>${escapeHtml(label)}</span>
        <em>${available ? "ADD" : "OUT"}</em>
      </button>
    </div>
  `;
}

function renderPricing(product, parentAvailable = true) {
  if (product.details && product.details.length) {
    return `
      <div class="price-pair priced-options">
        ${product.details.map(detail => `
          <div class="option-group">
            <div class="option-title">${escapeHtml(detail)}</div>
            <div class="option-prices">
              ${product.pricing.map(row => { const available = parentAvailable && isInStock(row); return `<button class="price-row add-price" type="button" data-add="${escapeHtml(product.name)}" data-option="${escapeHtml(detail + " - " + row.label)}" data-price="${escapeHtml(row.price)}" ${available ? "" : "disabled"}><span>${escapeHtml(row.label)}</span><strong>${escapeHtml(row.price)}</strong><em>${available ? "ADD" : "OUT"}</em></button>`; }).join("")}
            </div>
            ${product.saving ? `<div class="saving option-saving">${escapeHtml(product.saving)}</div>` : ""}
          </div>
        `).join("")}
      </div>
    `;
  }

  return `
    <div class="price-pair priced-options">
      ${product.pricing.map(row => { const available = parentAvailable && isInStock(row); return `<button class="price-row add-price" type="button" data-add="${escapeHtml(product.name)}" data-option="${escapeHtml(row.label)}" data-price="${escapeHtml(row.price)}" ${available ? "" : "disabled"}><span>${escapeHtml(row.label)}</span><strong>${escapeHtml(row.price)}</strong><em>${available ? "ADD" : "OUT"}</em></button>`; }).join("")}
      ${product.saving ? `<div class="saving">${escapeHtml(product.saving)}</div>` : ""}
    </div>
  `;
}

function renderExpandable(product) {
  const list = product.flavours || product.details || [];
  const twoCol = list.length >= 6 ? " two-col" : "";
  return `<div class="expand-content"><div class="flavour-list${twoCol}">${list.map(item => {
    const label = choiceLabel(item);
    const available = choiceStock(item);
    return `<button class="flavour add-flavour" type="button" data-add="${escapeHtml(product.name)}" data-option="${escapeHtml(label)}" data-price="${escapeHtml(product.price || "")}" ${available ? "" : "disabled"}>${escapeHtml(label)}<span>${available ? "ADD" : "OUT"}</span></button>`;
  }).join("")}</div></div>`;
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
    price: addButton.dataset.price || "",
    prompts: addButton.dataset.prompts ? addButton.dataset.prompts.split("||") : []
  });
});

function addToCart(item) {
  const key = `${item.name}||${item.option}||${item.price}`;
  const existing = cart.find(cartItem => cartItem.key === key);
  if (existing) {
    existing.qty += 1;
    if ((!existing.prompts || !existing.prompts.length) && item.prompts && item.prompts.length) existing.prompts = item.prompts;
  } else {
    cart.push({ ...item, key, qty: 1, prompts: item.prompts || [] });
  }
  saveCart();
  showToast("✓ Added");
  pulseCart();
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
    cartBody.innerHTML = `<div class="empty-cart"><strong>Your order starts here.</strong><br>Tap <b>ADD</b> on any product to begin.</div>`;
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
    return "Hi,\n\nI'd like to place an order.\n\nCollection / Delivery:";
  }

  const lines = cart.map(item => {
    const optionLine = item.option ? ` - ${item.option}` : "";
    return `• ${item.name}${optionLine} ×${item.qty}`;
  }).join("\n");

  const promptSections = cart
    .filter(item => item.prompts && item.prompts.length)
    .map(item => {
      const header = `\n${item.name} ×${item.qty}`;
      const promptLines = [];
      for (let i = 1; i <= item.qty; i += 1) {
        if (item.qty > 1) promptLines.push(`Bundle ${i}:`);
        item.prompts.forEach(prompt => {
          promptLines.push(`${prompt}:`);
        });
      }
      return `${header}\n${promptLines.join("\n")}`;
    });

  const promptText = promptSections.length
    ? `\n${promptSections.join("\n")}`
    : "";

  return `Hi,\n\nI'd like:\n\n${lines}${promptText}\n\nCollection / Delivery:`;
}

async function copyOrderMessage() {
  const message = buildOrderMessage();
  try {
    await navigator.clipboard.writeText(message);
    showToast("✓ Order copied");
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

function pulseCart() {
  cartFloat.classList.remove("cart-pop");
  void cartFloat.offsetWidth;
  cartFloat.classList.add("cart-pop");
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
  showToast("✓ Order copied. Paste into Snapchat.");
  setTimeout(() => window.open(hvContact.snapchatUrl || "https://www.snapchat.com/add/herts.vps", "_blank"), 350);
});

// Final public clean build marker. Functionality above is unchanged.
window.HERTS_VAPES_BUILD = "v4-inventory-master";
