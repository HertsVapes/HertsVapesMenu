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
const panel = document.getElementById("inventoryPanel");
const panelTitle = document.getElementById("panelTitle");
const panelContent = document.getElementById("panelContent");
const closePanel = document.getElementById("closePanel");

function softTap() {
  if (navigator.vibrate) navigator.vibrate(8);
}

document.querySelectorAll("[data-scroll]").forEach((button) => {
  button.addEventListener("click", () => {
    softTap();
    document.querySelector(button.dataset.scroll).scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

function revealOnScroll() {
  const vh = window.innerHeight;
  if (menu && menu.getBoundingClientRect().top < vh * 0.84) menu.classList.add("reveal");
  if (readyCard && readyCard.getBoundingClientRect().top < vh * 0.86) readyCard.classList.add("reveal");
}

window.addEventListener("scroll", revealOnScroll, { passive: true });
window.addEventListener("load", revealOnScroll);

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
          <div class="deal-name">${deal.name}</div>
          <div class="deal-meta">${deal.meta}</div>
          <div class="included-list">${deal.included.map(item => `<span>${item}</span>`).join("")}</div>
        </div>
        <div class="price-pill">${deal.price}</div>
      </div>
    </article>
  `;
}

function renderProduct(product) {
  const hasExpandable = (product.flavours && product.flavours.length > 1) || product.details;
  return `
    <article class="product-card ${hasExpandable ? "can-open" : ""}">
      <button class="product-main" type="button" ${hasExpandable ? "" : "disabled"}>
        <div>
          <div class="product-name">${product.name}</div>
          <div class="product-meta">${product.meta}${hasExpandable ? "  ▾" : ""}</div>
        </div>
        ${product.price ? `<div class="price-pill">${product.price}</div>` : ""}
      </button>
      ${product.pricing ? renderPricing(product) : ""}
      ${hasExpandable ? renderExpandable(product) : ""}
    </article>
  `;
}

function renderPricing(product) {
  return `
    <div class="price-pair">
      ${product.pricing.map(row => `<div class="price-row"><span>${row.label}</span><strong>${row.price}</strong></div>`).join("")}
      ${product.saving ? `<div class="saving">${product.saving}</div>` : ""}
      ${product.details ? `<div class="flavour-list">${product.details.map(detail => `<div class="flavour">${detail}</div>`).join("")}</div>` : ""}
    </div>
  `;
}

function renderExpandable(product) {
  const list = product.flavours || product.details || [];
  const twoCol = list.length >= 6 ? " two-col" : "";
  return `<div class="expand-content"><div class="flavour-list${twoCol}">${list.map(item => `<div class="flavour">${item}</div>`).join("")}</div></div>`;
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
