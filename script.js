/*
  HERTS VAPES PRODUCT DATA
  Future updates: edit products, flavours, prices, bundles and bulk copy in this inventory object only.
  The rendering/cart/order logic below should not need changing for normal stock updates.
*/
const settings = window.HV_SETTINGS || {
  whatsappNumber: "447885752823",
  snapchatUsername: "herts.vps",
  snapchatUrl: "https://www.snapchat.com/add/herts.vps"
};

const rawInventoryBundle = window.HV_INVENTORY || {};
const inventory = rawInventoryBundle.inventory || rawInventoryBundle.products || {};
const fallbackCategoryTitles = {
  special: ["Special Deals", "Best value bundles", "special.png"],
  disposable: ["Disposable Vapes", "Live flavours and prices", "disposable.png"],
  podkits: ["Pod Kits", "Kits and colours", "podkits.png"],
  salts: ["Nic Salts", "20mg liquids", "salts.png"],
  pods: ["Replacement Pods", "XROS Corex pods", "pods.png"],
  pouches: ["Nicotine Pouches", "Boxes and pack deals", "pouches.png"],
  tobacco: ["Tobacco", "Amber Leaf Original", "tobacco.png"],
  bulk: ["HV Bulk", "£100+ pre-orders", "menu.jpg"]
};
const categoryData = Array.isArray(rawInventoryBundle.categories) && rawInventoryBundle.categories.length
  ? rawInventoryBundle.categories
  : Object.keys(inventory).map(key => {
      const fallback = fallbackCategoryTitles[key] || [key, "Tap to view", ""];
      return { key, title: fallback[0], subtitle: fallback[1], image: fallback[2], ariaLabel: `Open ${fallback[0]}` };
    });

const menu = document.querySelector(".menu-visual");
const readyCard = document.querySelector(".ready-card");
const bulkCard = document.querySelector(".bulk-card");
const categoryGrid = document.getElementById("categoryGrid");
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
const WHATSAPP_NUMBER = settings.whatsappNumber || "447885752823";
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

function disabledAttr(item) {
  return item && item.inStock === false ? " disabled aria-disabled=\"true\"" : "";
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

function revealMenu() {
  if (!menu) return;
  menu.classList.add("reveal");
  document.body.classList.add("menu-entered");
}
function renderCategoryCards() {
  if (!categoryGrid || !menu) return false;
  try {
    const safeCategories = categoryData.filter(category => category && category.key && inventory[category.key]);
    if (!safeCategories.length) return false;
    categoryGrid.innerHTML = safeCategories.map(renderCategoryCard).join("");
    categoryGrid.hidden = false;
    /* Keep original menu.jpg visible as confirmed fallback. */
    return true;
  } catch (error) {
    console.error("Herts Vapes inventory menu failed. Original menu fallback remains visible.", error);
    categoryGrid.hidden = true;
    menu.classList.remove("inventory-ready");
    return false;
  }
}

function renderCategoryCard(category) {
  const image = category.image ? escapeHtml(category.image) : "";
  return `
    <button class="category-card" type="button" data-category="${escapeHtml(category.key)}" aria-label="${escapeHtml(category.ariaLabel || `Open ${category.title}`)}">
      <span class="category-card-text">
        <strong>${escapeHtml(category.title)}</strong>
        <em>${escapeHtml(category.subtitle || "Tap to view")}</em>
      </span>
      ${image ? `<img src="${image}" alt="" class="category-card-img" loading="lazy" />` : ""}
      <span class="category-card-arrow">›</span>
    </button>
  `;
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
  renderCategoryCards();
  setupCategoryButtons();
  updateBusinessLinks();
  renderCart();
});

function setupCategoryButtons() {
  document.querySelectorAll("[data-category]").forEach((button) => {
    if (button.dataset.boundCategory === "true") return;
    button.dataset.boundCategory = "true";
    button.addEventListener("click", () => {
      softTap();
      openCategory(button.dataset.category);
    });
  });
}

function whatsappUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function bulkWhatsappUrl(category) {
  const message = category.bulkMessage || "Hi Herts Vapes,\n\nI'm interested in your bulk prices.\n\nProducts I'm interested in:\n\n•";
  return whatsappUrl(message);
}

function updateBusinessLinks() {
  const defaultText = settings.whatsappOrderText || "Hi Herts Vapes, I'd like to place an order.";
  const defaultWhatsappUrl = whatsappUrl(defaultText);
  document.querySelectorAll('[data-business-link="whatsapp"]').forEach(link => { link.href = defaultWhatsappUrl; });
  const snapUrl = settings.snapchatUrl || `https://www.snapchat.com/add/${settings.snapchatUsername || "herts.vps"}`;
  document.querySelectorAll('[data-business-link="snapchat"]').forEach(link => { link.href = snapUrl; });
}

if (closePanel && panel) {
  closePanel.addEventListener("click", () => {
    softTap();
    panel.classList.remove("open");
    panel.style.display = "none";
    const menuSection = document.getElementById("menu");
    if (menuSection) menuSection.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function openCategory(key) {
  const category = inventory[key];
  if (!category || !panel || !panelTitle || !panelContent) {
    showToast("Menu item not available");
    return;
  }
  try {
    panel.dataset.category = key;
    panelTitle.textContent = category.title || fallbackCategoryTitles[key]?.[0] || "Menu";
    panelContent.innerHTML = renderCategory(category);
    panel.style.display = "block";
    requestAnimationFrame(() => panel.classList.add("open"));
    panel.scrollIntoView({ behavior: "smooth", block: "start" });
    setupProductCards();
  } catch (error) {
    console.error("Category failed to open", key, error);
    showToast("Category could not open");
  }
}

function renderCategory(category) {
  if (category.type === "bulk") return renderBulkCategory(category);
  const items = Array.isArray(category.items) ? category.items : [];
  if (!items.length) return `<div class="empty-cart"><strong>No items listed yet.</strong><br>This category is ready to update in inventory.js.</div>`;
  if (category.type === "deals") return items.map(renderDeal).join("");
  return items.map(renderProduct).join("");
}

function renderDeal(deal) {
  const promptData = deal.prompts ? escapeHtml(deal.prompts.join("||")) : "";
  const displayName = deal.subline ? `${deal.name} ${deal.subline}` : deal.name;
  return `
    <article class="deal-card offer-card ${deal.inStock === false ? "out-of-stock" : ""}">
      ${renderDealVisuals(deal)}
      <div class="deal-main">
        <div>
          ${deal.saving ? `<div class="saving-badge">${escapeHtml(deal.saving)}</div>` : ""}
          <div class="deal-name">${escapeHtml(deal.name)}</div>
          ${deal.subline ? `<div class="deal-plus-line">${escapeHtml(deal.subline)}</div>` : ""}
          <div class="deal-meta">${escapeHtml(deal.meta)}</div>
          ${deal.confirm ? `<div class="confirm-note">${escapeHtml(deal.confirm)}</div>` : ""}
        </div>
        <div class="price-pill">${escapeHtml(deal.price)}</div>
      </div>
      <div class="card-actions">
        <button class="add-cart-button" type="button"${disabledAttr(deal)} data-add="${escapeHtml(displayName)}" data-price="${escapeHtml(deal.price)}" data-prompts="${promptData}">ADD</button>
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
        ${(category.points || []).map(point => `<div class="bulk-point">${escapeHtml(point)}</div>`).join("")}
      </div>
      <div class="bulk-minimum-box">
        <span>Available on bulk pre-orders from</span>
        <strong>£100+</strong>
      </div>
      <a href="${bulkWhatsappUrl(category)}" class="order-button bulk-button">Order on WhatsApp</a>
      <p class="bulk-footnote">You will be redirected to WhatsApp to place your bulk order.</p>
    </article>
  `;
}


function renderProduct(product) {
  const choices = product.flavours || product.details || [];
  const hasExpandable = choices.length > 1 && !product.pricing;
  const hasSingleChoice = choices.length === 1 && !product.pricing;

  return `
    <article class="product-card ${hasExpandable ? "can-open" : ""} ${product.inStock === false ? "out-of-stock" : ""}">
      <button class="product-main" type="button" ${hasExpandable && product.inStock !== false ? "" : "disabled"}>
        <div>
          <div class="product-name">${escapeHtml(product.name)}${product.popular ? ` <span class="popular-badge">MOST POPULAR</span>` : ""}</div>
          <div class="product-meta">${escapeHtml(product.meta)}${hasExpandable ? "  ▾" : ""}</div>
        </div>
        ${product.inStock === false ? `<div class="stock-pill">OUT OF STOCK</div>` : (product.price ? `<div class="price-pill">${escapeHtml(product.price)}</div>` : "")}
      </button>
      ${product.pricing ? renderPricing(product) : ""}
      ${hasExpandable ? renderExpandable(product) : ""}
      ${hasSingleChoice ? renderSingleOption(product, choices[0]) : ""}
      ${!product.pricing && choices.length === 0 ? renderQuickAdd(product, "") : ""}
    </article>
  `;
}

function renderQuickAdd(product, option = "") {
  return `
    <div class="card-actions">
      <button class="add-cart-button" type="button"${disabledAttr(product)} data-add="${escapeHtml(product.name)}" data-option="${escapeHtml(option)}" data-price="${escapeHtml(product.price || "")}">ADD</button>
    </div>
  `;
}

function renderSingleOption(product, option = "") {
  return `
    <div class="single-option-list">
      <button class="option-add-row" type="button"${disabledAttr(product)} data-add="${escapeHtml(product.name)}" data-option="${escapeHtml(option)}" data-price="${escapeHtml(product.price || "")}">
        <span>${escapeHtml(option || product.name)}</span>
        <em>ADD</em>
      </button>
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
              ${product.pricing.map(row => `<button class="price-row add-price" type="button"${disabledAttr(product)} data-add="${escapeHtml(product.name)}" data-option="${escapeHtml(detail + " - " + row.label)}" data-price="${escapeHtml(row.price)}"><span>${escapeHtml(row.label)}</span><strong>${escapeHtml(row.price)}</strong><em>ADD</em></button>`).join("")}
            </div>
            ${product.saving ? `<div class="saving option-saving">${escapeHtml(product.saving)}</div>` : ""}
          </div>
        `).join("")}
      </div>
    `;
  }

  return `
    <div class="price-pair priced-options">
      ${product.pricing.map(row => `<button class="price-row add-price" type="button"${disabledAttr(product)} data-add="${escapeHtml(product.name)}" data-option="${escapeHtml(row.label)}" data-price="${escapeHtml(row.price)}"><span>${escapeHtml(row.label)}</span><strong>${escapeHtml(row.price)}</strong><em>ADD</em></button>`).join("")}
      ${product.saving ? `<div class="saving">${escapeHtml(product.saving)}</div>` : ""}
    </div>
  `;
}

function renderExpandable(product) {
  const list = product.flavours || product.details || [];
  const twoCol = list.length >= 6 ? " two-col" : "";
  return `<div class="expand-content"><div class="flavour-list${twoCol}">${list.map(item => `<button class="flavour add-flavour" type="button"${disabledAttr(product)} data-add="${escapeHtml(product.name)}" data-option="${escapeHtml(item)}" data-price="${escapeHtml(product.price || "")}">${escapeHtml(item)}<span>ADD</span></button>`).join("")}</div></div>`;
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

if (panelContent) panelContent.addEventListener("click", (event) => {
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
  setTimeout(() => window.open(settings.snapchatUrl || `https://www.snapchat.com/add/${settings.snapchatUsername || "herts.vps"}`, "_blank"), 350);
});

// Final public clean build marker. Functionality above is unchanged.
window.HERTS_VAPES_BUILD = "v4-menu-visible-fallback-locked";
